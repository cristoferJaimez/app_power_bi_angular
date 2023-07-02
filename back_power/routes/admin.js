const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/jwtMiddleware');
const { isAdmin, isUser } = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const connection = require('../data/conex'); // Importa la conexión a la base de datos
const axios = require('axios');
const https = require('https');


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
      const procedureValues = [usuario_id, id_report, url_report, "sin_token", description, title];
  
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
  router.get('/items', (req, res) => {
    // Lógica para obtener todos los elementos
    const query = "CALL getAllPosts();";
  
    // Ejecutar la consulta al procedimiento almacenado
    connection.query(query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los posts' });
      } else {
        res.json(results[0]); // Devuelve los resultados obtenidos por el procedimiento almacenado
      }
    });
  });  
   

  // Definir la ruta que utiliza el procedimiento almacenado
router.get('/posts/:id', (req, res) => {
  const postId = req.params.id;
  console.log(postId);
  // Llamada al procedimiento almacenado GetPostData
  const query = `CALL GetPostData(${postId})`;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error al ejecutar el procedimiento almacenado: ', err);
      res.status(500).json({ error: 'Error al obtener los datos del post' });
      return;
    }

    // Los datos del post estarán en results[0]
    const postData = results[0][0];
    res.json(postData);
  });
});
  
 
router.post('/update-post', (req, res) => {
  const { postId, title, description, reportId, reportUrl } = req.body;

  const query = `CALL actualizarPost(${postId}, '${title}', '${description}', '${reportId}', '${reportUrl}')`;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error al actualizar los datos en la tabla post', error);
      res.status(500).json({ error: 'Error al actualizar los datos en la tabla post' });
    } else {
      console.log('Datos actualizados en la tabla post');
      res.status(200).json({ message: 'Datos actualizados en la tabla post' });
    }
  });
});

router.get('/users', (req, res) => {
  const query = 'CALL getAllUsers()';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error al obtener los usuarios', error);
      res.status(500).json({ error: 'Error al obtener los usuarios' });
    } else {
      console.log('Usuarios obtenidos correctamente');
      res.status(200).json(results[0]);
    }
  });
});


router.post('/toggle-user-status/:userId', (req, res) => {
  const userId = req.params.userId;

  // Llamada al procedimiento almacenado
  connection.query('CALL ToggleUserStatus(?)', [userId], (error, results) => {
    if (error) {
      console.error('Error al ejecutar el procedimiento almacenado: ', error);
      res.status(500).json({ error: 'Error al ejecutar el procedimiento almacenado' });
    } else {
      console.log('Procedimiento almacenado ejecutado correctamente');
      const status = results[0][0].status;
      
      // Obtener el estado actualizado del usuario desde los resultados
      console.log(status);
      
      res.status(200).json({ status: status });
    }
  });
});




module.exports = router;