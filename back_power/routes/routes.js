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
const qs = require('qs');

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


router.get('/obtener-informes/:id', async (req, res) => {

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

      id_report = results[0][0].id_report; // Obtiene el id del informe desde los resultados del procedimiento almacenado  
    });

    const tokenEndpoint = `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/token`;
    const resource = 'https://analysis.windows.net/powerbi/api';

    const params = {
      grant_type: 'client_credentials',
      client_id: process.env.AZURE_CLIENT_ID,
      client_secret: process.env.AZURE_CLIENT_SECRET,
      scope: `${resource}/.default`,
    };

    const response = await axios.post(tokenEndpoint, qs.stringify(params), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const accessToken = response.data.access_token;

    const apiUrl = 'https://api.powerbi.com/v1.0/myorg/reports';
    const reportsResponse = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });


    //lista de reportes
    const reports = reportsResponse.data.value;
    
    res.json({ reports, reportUrl });
  } catch (error) {
    console.error('Error:', error.message);

    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', error.response);
    }

    res.status(500).json({ error: 'Error al obtener los informes de Power BI' });
  }
});


module.exports = router;
