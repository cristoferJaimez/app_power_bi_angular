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
const moment = require('moment-timezone');


// Ruta del login para iniciar session
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const { ip, method, originalUrl, headers } = req;
  const timestamp = new Date().toISOString();
  const user = req.body.username; // Suponiendo que el nombre de usuario se envía en el cuerpo de la solicitud

  // Registro de datos de tránsito en la consola
  console.log(`[${timestamp}] IP: ${ip}, Método: ${method}, Ruta: ${originalUrl}, Usuario: ${user}`);
  const horaColombia = moment().tz('America/Bogota').format('HH:mm:ss');
  console.log(`La hora actual en Colombia es: ${horaColombia}`);


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
      if (err || results.length === 0 || !results[0][0] || typeof results[0][0].id_report === 'undefined') {
        return res.status(404).json({ message: 'Informe no encontrado' });
      }



      const id_report_db = results[0][0].id_report;
      const id_grupo_db = results[0][0].url_report;




      try {
        // AZ APP ADD
        const tokenEndpoint = `https://login.microsoftonline.com/common/oauth2/token`;
        const groupPowerBi = `https://api.powerbi.com/v1.0/myorg/groups`;

        const pw = process.env.AZ_PASSWORD;

        const params = {
          resource: process.env.RESOURCE,
          scope: process.env.SCOPE,
          username: 'wvega@close-upinternational.com.co',
          password: pw,
          client_id: process.env.AZURE_CLIENT_ID,
          client_secret: process.env.AZURE_CLIENT_SECRET,
          grant_type: process.env.GRANT_TYPE
        };

        const response = await axios.post(tokenEndpoint, qs.stringify(params), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });

        // Buscar grupo
        const powerbi_group = await axios.get(groupPowerBi, {
          headers: {
            'Authorization': `Bearer ${response.data.access_token}`
          }
        });

        // Lógica para buscar grupo
        let id_group = '';
        powerbi_group.data.value.forEach(e => {
          if (id_grupo_db === e.id) {
            id_group = e.id;
          }
        });

        // Fin de la lógica
        // Buscar reportes
        const powerbi_rep_url = `https://api.powerbi.com/v1.0/myorg/groups/${id_group}/reports?`;

        const powerbi_reports = await axios.get(powerbi_rep_url, {
          headers: {
            'Authorization': `Bearer ${response.data.access_token}`
          }
        });

        let powerbi_report = '';
        let embedUrl = '';
        powerbi_reports.data.value.forEach(e => {
          if (id_report_db === e.id) {
            powerbi_report = e.id;
            embedUrl = e.embedUrl;
          }
        });

        let accessToken = '';
        // Buscar token para el informe
        const body = {
          accessLevel: 'view'
        };

        const token_url = `https://api.powerbi.com/v1.0/myorg/groups/${id_group}/reports/${powerbi_report}/Generatetoken`;

        const power_token = await axios.post(token_url, body, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${response.data.access_token}`
          }
        });

        res.status(200).json({
          id: powerbi_report,
          embedUrl: embedUrl,
          accessToken: power_token.data.token
        });
      } catch (error) {
        console.error('Error obteniendo los informes de Power BI:', error.response);
        res.status(500).json({ message: 'Error al obtener los informes de Power BI' });
      }
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


router.get('/eliminar-post/:id', async (req, res) => {
  const postId = req.params.id;
  //console.log(req.params.id);
  // Ejecutar el procedimiento almacenado
  const query = `CALL estado_post(${postId})`;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error al ejecutar el procedimiento almacenado:', error);
      return res.status(500).json({ error: 'Error al eliminar el post' });
    }

    const newStatus = results[0][0].new_status;
    //console.log('Nuevo estado del post:', newStatus);

    // Realizar otras acciones o enviar la respuesta al cliente
    return res.status(200).json({ newStatus });
  });
});


router.get('/restaurar-post/:id', async (req, res) => {
  // Ejecutar el procedimiento almacenado
  const postId = req.params.id;
  const query = `CALL estado_post(${postId})`;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error al ejecutar el procedimiento almacenado:', error);
      return res.status(500).json({ error: 'Error al eliminar el post' });
    }

    const newStatus = results[0][0].new_status;
    //console.log('Nuevo estado del post:', newStatus);

    // Realizar otras acciones o enviar la respuesta al cliente
    return res.status(200).json({ newStatus });
  });
});




module.exports = router;
