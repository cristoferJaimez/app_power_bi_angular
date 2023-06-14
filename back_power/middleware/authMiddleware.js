// Middleware para verificar si el usuario es administrador
const isAdmin = (req, res, next) => {
  const userType = req.headers.user_type; // Obtener el tipo de usuario del token decodificado

  if (userType === 'admin') {
    //res.status(200).json({ message: 'Acceso permitido.' });
    next(); // El usuario es administrador, continuar con la siguiente ruta o middleware
  } else {
    res.status(403).json({ message: 'Acceso denegado. Solo los administradores pueden acceder a esta ruta.' });
  }
};

// Middleware para verificar si el usuario es usuario normal
const isUser = (req, res, next) => {
  const userType = req.headers.user_type; // Obtener el tipo de usuario del token decodificado

  if (userType === 'user') {
    //res.status(200).json({ message: 'Acceso permitido.' });
    next(); // El usuario es usuario normal, continuar con la siguiente ruta o middleware
  } else {
    res.status(403).json({ message: 'Acceso denegado. Solo los usuarios pueden acceder a esta ruta.' });
  }
};


module.exports = {
  isAdmin,
  isUser
};
