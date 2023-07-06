const mysql = require('mysql');
require('dotenv').config(); // Cargar las variables de entorno desde el archivo .env

// Configurar la conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Conectar a la base de datos
try {
  connection.connect();
  console.log('Conexión exitosa a la base de datos');
} catch (err) {
  console.error('Error al conectar a la base de datos:', err);
}

module.exports = connection; // Exportar la conexión para usarla en otros módulos
