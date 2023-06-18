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
    const query = `CALL select_post(?)`;

    connection.query(query, [reportId], async (err, results) => {
      if (err || results.length === 0) {
        return res.status(404).json({ message: 'Informe no encontrado' });
      }

      const id_report = results[0][0].id_report;
      let reports = [];

      let accessToken; // Mover la declaración de accessToken aquí

      try {
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

        accessToken = response.data.access_token; // Asignar el valor del accessToken aquí

        console.log(accessToken);

        const apiUrl = 'https://api.powerbi.com/v1.0/myorg/reports';
        const reportsResponse = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        reports = reportsResponse.data.value;
      } catch (error) {
        console.error('Error obteniendo los informes de Power BI:', error.message);
      }

      const filteredReports = reports.filter(report => report.id === id_report);
      const embedUrl = filteredReports.length > 0 ? filteredReports[0].embedUrl :  `https://app.powerbi.com/reportEmbed?reportId=5598d4ad-17e7-45fa-b322-49a50157b352&groupId=7dfb8435-e327-493f-887b-a8cac1da371f `; // Obtener la URL dinámica del informe si existe, de lo contrario, dejarla vacía

      const responseObj = {
        //reports: filteredReports,
        id:id_report,
        embedUrl,
        accessToken: accessToken // Incluir el token de acceso en el objeto de respuesta
      };

      res.json(responseObj);
    });
  } catch (error) {
    console.error('Error:', error.message);

    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', error.response);
    }

    const defaultReport = { id: '', name: 'Informe no disponible' };
    const defaultResponse = { reports: [defaultReport], embedUrl: '' };

    res.status(error.response ? error.response.status : 500).json(defaultResponse);
  }
});





module.exports = router;
