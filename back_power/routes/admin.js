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
  router.get('/items', authenticateToken, (req, res) => {
    // Lógica para obtener todos los elementos
    res.send('Obtener todos los elementos');
  });
  
module.exports = router;