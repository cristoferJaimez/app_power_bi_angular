const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/jwtMiddleware');
const { isAdmin, isUser } = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const connection = require('../data/conex'); // Importa la conexión a la base de datos
const axios = require('axios');
const https = require('https');
const { ClientSecretCredential } = require("@azure/identity");


// Ruta del login para iniciar session
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  connection.query('CALL login_usuario(?, ?, @resultado, @usuario_id, @descripcion, @image_url, @tipo_usuario)', [username, password], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'Error en la autenticación' });
      return;
    }


    const resultado = results[0][0].resultado;
    const usuarioId = results[0][0].usuario_id;
    const descripcion = results[0][0].descripcion;
    const imagenUrl = results[0][0].image_url;
    const tipoUsuario = results[0][0].tipo_usuario;



    if (resultado > 0) {
      const payload = {
        userId: usuarioId,
        username: username
      };

      const token = jwt.sign(payload, 'secreto', { expiresIn: '1h' });

      res.json({ token, usuarioId, descripcion, imagenUrl, tipoUsuario });
    } else {
      res.status(401).json({ message: 'Credenciales inválidas' });
    }
  });
});

// Ruta para verificar la validez del token JWT
router.get('/verify-token', authenticateToken, (req, res) => {
  //console.log(req);
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  jwt.verify(token, 'secreto', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    // El token es válido
    res.json({ message: 'Token válido' });
  });
});



// Ruta para obtener un informe de Power BI
router.get('/powerbi-report-details/:id', async (req, res) => {
  try {
    const reportId = req.params.id;
    //console.log(reportId);
    const query = `CALL select_post(?)`;

    connection.query(query, [reportId], async (err, results) => {
      if (err || results.length === 0) {
        console.log(err);
        // Error al llamar al procedimiento almacenado o informe no encontrado
        return res.status(404).json({ message: 'Informe no encontrado' });
      }

      const id_report = results[0][0].id_report; // Obtiene el id del informe desde los resultados del procedimiento almacenado
      const embedUrl = results[0][0].url_report; // Obtiene la URL del informe desde los resultados del procedimiento almacenado

      const credential = new ClientSecretCredential(
        process.env.AZURE_TENANT_ID,
        process.env.AZURE_CLIENT_ID,
        process.env.AZURE_CLIENT_SECRET
      );

      try {
        const tokenResponse = await credential.getToken("https://analysis.windows.net/powerbi/api/.default");
        //console.log('Token obtenido:', tokenResponse.token); // Imprime el token en el registro

        console.log(tokenResponse.token);

        // Obtener información del usuario autenticado
        const userApiResponse = await axios.get('https://graph.microsoft.com/v1.0/me', { headers: { Authorization: `Bearer ${tokenResponse.token}` } });
        const user = userApiResponse.data;

        // Mostrar los datos del usuario en la consola
        console.log('Datos del usuario:');
        console.log('ID:', user.id);
        console.log('Nombre:', user.displayName);
        console.log('Email:', user.mail);


        const reportDetails = {
          reportId: id_report,
          embedUrl: embedUrl,
          accessToken: tokenResponse.token,
        };


        // Utiliza el accessToken para acceder a tus informes de Power BI

        res.json(reportDetails);
      } catch (error) {
        console.error('Error al obtener el token:', error.message);
        res.status(500).send('Error al obtener el token');
      }
    });
  } catch (error) {
    console.error('Error en la ruta /powerbi-report-details:', error.message);
    res.status(500).send('Error en la ruta /powerbi-report-details');
  }
});


router.post('/get-token-and-url', async (req, res) => {
  try {
    const scope = 'https://analysis.windows.net/powerbi/api/.default';
    const tokenEndpoint = `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/token`;
    
    const requestBody = new URLSearchParams();
    requestBody.append('client_id', process.env.AZURE_CLIENT_ID);
    requestBody.append('client_secret', process.env.AZURE_CLIENT_SECRET);
    requestBody.append('grant_type', 'client_credentials');
    requestBody.append('scope', scope);

    const response = await axios.post(tokenEndpoint, requestBody);
    const token = response.data.access_token;
   
    const headers = {
      Authorization: `Bearer ${token}`
    };

    const reportId = "f71dd63e-24eb-4f63-b817-6fd80f8a950";
    const apiUrl = `https://api.powerbi.com/v1.0/myorg/reports/${reportId}`;

    try {
      const reportResponse = await axios.get(apiUrl, { headers });
      const embedUrl = reportResponse.data.embedUrl;
      console.log(reportResponse);
      res.json({ token, embedUrl });
    } catch (error) {
      console.error('Error al obtener la URL del informe:', error.message);
      res.status(500).json({ error: 'Error al obtener la URL del informe', details: error });
    }
  } catch (error) {
    console.error('Error al obtener el token:', error.message);
    res.status(500).json({ error: 'Error al obtener el token', details: error.response.data });
  }
});





module.exports = router;
