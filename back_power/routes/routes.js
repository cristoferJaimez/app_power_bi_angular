const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/jwtMiddleware');
const { isAdmin, isUser } = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const connection = require('../data/conex'); // Importa la conexión a la base de datos
const axios = require('axios');
const https = require('https');


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
    console.log(reportId);
    const query = `CALL select_post(?)`;

    connection.query(query, [reportId], async (err, results) => {
      if (err || results.length === 0) {
        console.log(err);
        // Error al llamar al procedimiento almacenado o informe no encontrado
        return res.status(404).json({ message: 'Informe no encontrado' });
      }

      const id_report = results[0][0].id_report; // Obtiene el id del informe desde los resultados del procedimiento almacenado
      const embedUrl = results[0][0].url_report; // Obtiene la URL del informe desde los resultados del procedimiento almacenado
      //const accessToken = results[0][0].toke_report; // Obtiene el accessToken desde los resultados del procedimiento almacenado

      // Aquí puedes realizar las acciones adicionales con los resultados obtenidos
      const clientId = process.env.CLIENT_ID;
      const clientSecret = process.env.CLIENT_SECRET;
      const resource = 'https://analysis.windows.net/powerbi/api'; // Puede variar dependiendo del recurso al que quieras acceder

      try {
        const response = await axios.post('https://login.microsoftonline.com/common/oauth2/token', {
          grant_type: 'client_credentials',
          client_id: clientId,
          client_secret: clientSecret,
          resource: resource
        });

        const accessToken = response.data.access_token;
        const reportDetails = {
          reportId: id_report,
          embedUrl: embedUrl,
          accessToken: accessToken,
        };
        // Utiliza el accessToken para acceder a tus informes de Power BI

        res.json(reportDetails);
      } catch (error) {
        console.error('Error al obtener el token:', error.message);
        const reportDetails = {
          reportId: id_report,
          embedUrl: embedUrl,
          accessToken: "hhh_89",
        };
        // Utiliza el accessToken para acceder a tus informes de Power BI

        res.json(reportDetails);
        //res.status(500).send('Error al obtener el token');
      }
    });
  } catch (error) {
    console.error('Error en la ruta /powerbi-report-details:', error.message);
    res.status(500).send('Error en la ruta /powerbi-report-details');
  }
});



module.exports = router;
