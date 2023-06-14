const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/jwtMiddleware');
const { isAdmin, isUser } = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const connection = require('../data/conex'); // Importa la conexión a la base de datos
const axios = require('axios');
const https = require('https');

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
  
module.exports = router;