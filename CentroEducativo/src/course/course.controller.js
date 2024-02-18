'use strict';
import Course from './course.model.js'
import Teacher from '../teacher/teacher.model.js'
import Student from '../student/student.model.js'

// Agregar un curso
export const addCourse = async (req, res) => {
    try {
        // Verificar si el usuario es un profesor
        const { id } = req.params;
        const teacher = await Teacher.findById(id);
        if (!teacher) {
            return res.status(403).send({ message: 'Unauthorized, your role is not TEACHER' });
        }

        // Obtener los datos del curso del cuerpo de la solicitud
        const { title, description } = req.body;

        // Crear un nuevo curso asociado al profesor
        const course = new Course({
            title: title,
            description: description,
            teacher: teacher._id // Asignar el ID del profesor al curso
        });

        // Agregar el ID del curso al profesor
        teacher.assignedCourses.push(course._id);

        // Guardar el curso y el profesor en la base de datos
        await Promise.all([course.save(), teacher.save()]);

        return res.status(201).send({ message: 'Course added successfully', course });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error adding course', error });
    }
};

export const updateCourse = async (req, res) => {
    try {
        // Verificar si el usuario es un profesor
        const { id } = req.params;
        const teacher = await Teacher.findById(id);
        if (!teacher) {
            return res.status(403).send({ message: 'Unauthorized' });
        }

        // Obtener los datos del curso del cuerpo de la solicitud
        const { title, description } = req.body;

        // Actualizar el curso asociado al profesor por su título
        const updatedCourse = await Course.findOneAndUpdate(
            { title: title, teacher: teacher._id }, // Buscar el curso por su título y el ID del profesor
            { description: description },
            { new: true }
        );

        if (!updatedCourse) {
            return res.status(404).send({ message: 'Course not found in your courses' });
        }

        return res.status(200).send({ message: 'Course updated successfully', updatedCourse });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error updating course', error });
    }
};

export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;

        // Verificar si el usuario es un profesor
        const teacher = await Teacher.findById(id);
        if (!teacher) {
            return res.status(403).send({ message: 'Unauthorized' });
        }

        // Eliminar el curso asociado al profesor por su título
        const deletedCourse = await Course.findOneAndDelete({ title: title, teacher: teacher._id });

        if (!deletedCourse) {
            return res.status(404).send({ message: 'Course not found in your courses' });
        }

        // Eliminar la referencia del curso de la lista de cursos asignados de los estudiantes
        await Student.updateMany(
            { assignedCourses: deletedCourse._id },
            { $pull: { assignedCourses: deletedCourse._id } }
        );

        return res.status(200).send({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error deleting course', error });
    }
};

export const getAllCourses = async (req, res) => {
    try {
        // Verificar si el usuario es un profesor
        const { id } = req.params;
        const teacher = await Teacher.findById(id);
        if (!teacher) {
            return res.status(403).send({ message: 'Unauthorized' });
        }

        // Obtener todos los cursos asociados al profesor
        const courses = await Course.find({ teacher: teacher._id });
        return res.status(200).send({ courses });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error retrieving courses', error });
    }
};