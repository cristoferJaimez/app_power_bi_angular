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

// Ruta protegida con JWT - GET para obtener los posts de un usuario
router.get('/list-items/:id', authenticateToken, (req, res) => {
  const userId = req.params.id; // Obtener el ID de usuario de los parámetros de la URL

  // Llamar al procedimiento almacenado para obtener los posts del usuario
  connection.query('CALL listar_posts_por_usuario(?)', [userId], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: error });
      return;
    }

    // Obtener los resultados del procedimiento almacenado
    const posts = results[0];

    if (posts.length === 0) {
      // No se encontraron posts para el usuario
      res.json({ message: 'No hay posts disponibles' });
    } else {
      // Responder en formato JSON con los posts obtenidos
      res.json(posts);
    }
  });
});

// Ruta protegida con JWT - GET para obtener todos los elementos
router.get('/items', authenticateToken, (req, res) => {
  // Lógica para obtener todos los elementos
  res.send('Obtener todos los elementos');
});

//rutas de usuario//
// Ruta protegida con JWT - GET para obtener un elemento por su ID
router.get('/items/:id', authenticateToken, (req, res) => {
  const itemId = req.params.id;
  // Lógica para obtener el elemento por su ID
  res.send(`Obtener elemento con ID ${itemId}`);
});

// Ruta protegida con JWT - POST para crear un nuevo elemento
router.post('/items', authenticateToken, (req, res) => {
  // Lógica para crear un nuevo elemento
  res.send('Crear un nuevo elemento');
});

// Ruta protegida con JWT - PUT para actualizar un elemento por su ID
router.put('/items/:id', authenticateToken, (req, res) => {
  const itemId = req.params.id;
  // Lógica para actualizar el elemento por su ID
  res.send(`Actualizar elemento con ID ${itemId}`);
});

// Ruta protegida con JWT - DELETE para eliminar un elemento por su ID
router.delete('/items/:id', authenticateToken, (req, res) => {
  const itemId = req.params.id;
  // Lógica para eliminar el elemento por su ID
  res.send(`Eliminar elemento con ID ${itemId}`);
});

//rutas de admin//
//users
router.post('/new-user', authenticateToken, isAdmin, (req, res) => {
  try {
    // Llamada al procedimiento almacenado
    connection.query(
      'CALL crear_usuario(?, ?, ?, ?, ?, ?)',
      [
        req.body.nombre,
        req.body.contraseña,
        req.body.descripcion,
        req.body.tipoUsuario === 'admin' ? 1 : 2,
        req.body.url,
        req.body.email
      ],
      (error, results) => {
        if (error) {
          console.error('Error al ejecutar el procedimiento almacenado:', error);
          return res.status(500).json({ message: 'Error al crear el nuevo usuario' });
        } else {
          console.log('Nuevo usuario creado correctamente');
          return res.json({ message: 'Nuevo usuario creado correctamente' });
        }
      }
    );
  } catch (error) {
    console.error('Error al crear el nuevo usuario:', error);
    return res.status(500).json({ message: 'Error al crear el nuevo usuario' });
  }
});

//posts
router.get('/list-labs', authenticateToken, isAdmin,(req, res) => {
  // Llamada al procedimiento almacenado
  connection.query('CALL obtener_usuarios_post()', (error, results) => {
    if (error) {
      // Ocurrió un error al ejecutar el procedimiento almacenado
      console.error(error);
      return res.status(500).send('Error en el servidor');
    }

    // Obtener los resultados del procedimiento almacenado
    const usuarios = results[0];
    //console.log(usuarios);
    res.json(usuarios); // Enviar solo la respuesta del procedimiento almacenado
  });
});

// Ruta para procesar el formulario y llamar al procedimiento almacenado
router.post('/guardar-post', authenticateToken, isAdmin, (req, res) => {
  try {
    // Obtener los datos del formulario enviados en la solicitud
    const { usuario_id, id_report, url_report, token_report, title, description } = req.body;

    // Llamar al procedimiento almacenado
    const insertProcedure = `CALL guardar_post(?, ?, ?, ?, ?, NOW(), NOW(), 1, ?)`;
    const procedureValues = [usuario_id, id_report, url_report, token_report, description, title];

    // Ejecutar el procedimiento almacenado en la base de datos
    connection.query(insertProcedure, procedureValues, (error, results) => {
      if (error) {
        console.error('Error al ejecutar el procedimiento almacenado:', error);
        return res.status(500).json({ error: 'Error al guardar el formulario' });
      }

      // Formulario guardado exitosamente
      return res.status(200).json({ message: 'Formulario guardado exitosamente' });
    });
  } catch (error) {
    console.error('Error al procesar el formulario:', error);
    return res.status(500).json({ error: 'Error al procesar el formulario' });
  }
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



router.get('/get-token', async (req, res) => {
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
  
      // Utiliza el accessToken para acceder a tus informes de Power BI
  
      res.send('Token obtenido correctamente');
    } catch (error) {
      console.error('Error al obtener el token:', error.message);
      res.status(500).send('Error al obtener el token');
    }
  });
  

module.exports = router;
