'use strict'

import Student from './student.model.js'
import Teacher from '../teacher/teacher.model.js'
import Course from '../course/course.model.js'
import { checkUpdate, checkPassword, encrypt} from '../utils/validator.js'
import {generateJwt} from '../utils/jwt.js'

export const register = async (req, res) => {
    try {
        let data = req.body;
        data.password = await encrypt(data.password);

        // Crear un nuevo estudiante
        const student = new Student(data);
        await student.save();

        // Si el estudiante tiene cursos asignados, actualiza los cursos
        if (data.assignedCourses && data.assignedCourses.length > 0) {
            // Agrega el ID del estudiante a cada curso asignado
            await Course.updateMany(
                { _id: { $in: data.assignedCourses } },
                { $push: { students: student._id } }
            );
        }

        return res.send({ message: 'Student is saved successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'Error registering student', error });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Busca al usuario en ambos modelos
        let user = await Student.findOne({ username });
        if (!user) {
            user = await Teacher.findOne({ username });
        }
        
        // Verifica si el usuario existe y la contraseña es correcta
        if (user && (await checkPassword(password, user.password))) {
            let loggedUser = {
                uid: user._id,
                username: user.username,
                role: user.role
            };
            let token = await generateJwt(loggedUser);
            return res.status(200).send({ message: `Welcome ${user.name} your role is ${user.role}`, loggedUser, token });
        }
        
        return res.status(401).send({ message: 'Invalid username or password' });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'Error logging in', error });
    }
};


export const deleteStudent = async (req, res) => {
    try {
        let {id} = req.params
        let deleteStudent = await Student.findOne({_id: id})
        if(!deleteStudent.deletedCount == 0) return res.status(404).send({message: 'Student not found, not deleted'})
        return res.send({message: 'Student deleted successfully'})
    } catch (error) {
        console.log(error)
        return res.status(500).send({message: 'Error deleting student', error})
    }
}

export const updateStudent = async (req, res) => {
    try {
        let { id } = req.params;
        let data = req.body;
        let update = checkUpdate(data, false);
        if (!update) return res.status(404).send({ message: 'Student not found, not updated' });
        
        // Extraer los cursos asignados del cuerpo de la solicitud
        const { assignedCourses, ...updateData } = data;

        // Actualizar al estudiante
        let updateStudent = await Student.findOneAndUpdate({ _id: id }, updateData, {
            new: true,
        }).populate('assignedCourses', ['name', 'teacher']);

        // Verificar si el estudiante fue encontrado y actualizado correctamente
        if (!updateStudent) return res.status(401).send({ message: 'Student not found and not updated' });

        // Actualizar los cursos asignados si se proporcionaron en la solicitud
        if (assignedCourses !== undefined) {
            updateStudent.assignedCourses = assignedCourses;
            await updateStudent.save();
        }

        return res.send({ message: 'Student updated successfully', updateStudent });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'Error updating student', error });
    }
};

export const addCourseToStudent = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { courseId } = req.body;
        // Encuentra al estudiante por su ID
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        // Verifica si el estudiante ya tiene asignados 3 cursos
        if (student.assignedCourses.length >= 3) {
            return res.status(400).json({ message: 'Student already has 3 courses assigned' });
        }
        // Verifica si el curso ya está asignado al estudiante
        if (student.assignedCourses.includes(courseId)) {
            return res.status(400).json({ message: 'Student already has this course assigned' });
        }
        // Agrega el ID del curso a la lista de cursos asignados
        student.assignedCourses.push(courseId);
        await student.save();
        res.status(200).json({ message: 'Course added to student successfully', student });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding course to student', error });
    }
};

export const dataStudents = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Buscar al estudiante por su ID
        const student = await Student.findById(id).populate('assignedCourses');
        
        // Verificar si el estudiante existe
        if (!student) {
            return res.status(404).send({ message: 'Student not found' });
        }
        
        // Obtener el nombre del estudiante
        const studentName = student.name;
        
        // Obtener los detalles de los cursos asignados (título y descripción)
        const courses = await Promise.all(student.assignedCourses.map(async courseId => {
            const course = await Course.findById(courseId);
            return course ? { title: course.title, description: course.description } : null;
        }));
        
        // Crear un mensaje que incluya el nombre del estudiante y los detalles de los cursos asignados
        const message = courses.map(course => course ? `${course.title}: ${course.description}` : '').join(' | ');

        // Enviar la respuesta con el mensaje formateado
        return res.status(200).send({ message: `Hi ${studentName}, your assigned courses are: ${message}` });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'Error getting student data', error });
    }
};