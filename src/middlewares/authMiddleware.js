import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role  // Incluir el campo role en la carga útil del token
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '10d'  // Ejemplo de duración del token
  });
};

const protect = async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      console.log('User:', req.user); // Verifica si req.user contiene role
      res.locals.user = req.user;
      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      res.redirect('/login');
    }
  } else {
    console.log('No token found, redirecting to login');
    res.redirect('/login');
  }
};

export { protect, generateToken };
