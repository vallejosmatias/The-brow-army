import User from '../models/user.model.js';
import Course from '../models/cursos.model.js';

// Obtener los datos del perfil del usuario
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('courses').exec();

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.render('profile', {
      user,
      courses: user.courses,
      showNavbarFooter: true
    });
  } catch (error) {
    console.error('Error al obtener el perfil del usuario:', error);
    res.status(500).json({ message: 'Error al obtener el perfil del usuario' });
  }
};

// Actualizar los datos del perfil del usuario
export const updateUserProfile = async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (currentPassword && newPassword) {
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(400).send('La contraseña actual es incorrecta');
      }
      user.password = newPassword;
    }

    user.name = name;
    user.email = email;

    await user.save();
    res.redirect('/profile');
  } catch (error) {
    console.error('Error al actualizar los datos del perfil del usuario:', error);
    res.status(500).send('Error al actualizar los datos del perfil');
  }
};

// Eliminar la cuenta del usuario
export const deleteUserProfile = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.redirect('/logout');
  } catch (error) {
    console.error('Error al eliminar la cuenta del usuario:', error);
    res.status(500).send('Error al eliminar la cuenta');
  }
};
