import Course from '../models/cursos.model.js';

// Obtener todos los cursos
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error });
  }
};

// Obtener un curso por ID
const getCourseById = async (req, res) => {
  const courseId = req.params.id;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Curso no encontrado' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error });
  }
};

// Crear un curso
const createCourse = async (req, res) => {
  const { title, description, price, videoUrl, imgUrl } = req.body;

  try {
    const course = await Course.create({
      title,
      description,
      price,
      videoUrl,
      imgUrl,
      user: req.user._id, // Asociar el curso con el usuario actual
    });
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear curso', error });
  }
};

// Actualizar un curso
const updateCourse = async (req, res) => {
  const courseId = req.params.id;
  const { title, description, price } = req.body;

  try {
    let course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Curso no encontrado' });
    }

    // Verificar que el usuario que intenta actualizar el curso sea el propietario del curso
    if (course.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No autorizado para actualizar este curso' });
    }

    // Actualizar el curso
    course.title = title;
    course.description = description;
    course.price = price;
    await course.save();

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error });
  }
};

// Eliminar un curso
const deleteCourse = async (req, res) => {
  const courseId = req.params.id;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Curso no encontrado' });
    }

    // Verificar que el usuario que intenta eliminar el curso sea el propietario del curso
    if (course.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No autorizado para eliminar este curso' });
    }

    await course.remove();

    res.json({ message: 'Curso eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error });
  }
};

export { getCourses, getCourseById, createCourse, updateCourse, deleteCourse };
