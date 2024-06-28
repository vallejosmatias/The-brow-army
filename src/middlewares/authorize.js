const authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Acceso denegado. Solo para administradores.' });
    }
  };
  
  export {authorizeAdmin};
  