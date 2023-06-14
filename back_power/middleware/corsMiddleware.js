// corsMiddleware.js
const cors = require('cors');

const corsMiddleware = cors({
  origin: '*',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  methods: 'GET, POST, PUT, DELETE'
});

module.exports = corsMiddleware;
