const express = require('express');
const cors = require('cors');
const routes = require('../routes/routes');
const isAdmin = require('../routes/admin');
const isUsers = require('../routes/users');



const app = express();
const port = 3000;

// Middleware de CORS
app.use(cors());

// Middleware para analizar el cuerpo de la solicitud como JSON
app.use(express.json());

// Utilizar las rutas definidas en routes.js
app.use(routes);
app.use(isAdmin);
app.use(isUsers);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
