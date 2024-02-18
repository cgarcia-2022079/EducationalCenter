import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';
import courseRoutes from '../src/course/course.routes.js';
import studentRoutes from '../src/student/student.routes.js';
import teacherRoutes from '../src/teacher/teacher.routes.js';
import Teacher from '../src/teacher/teacher.model.js';

const server = express();
config();
const port = process.env.PORT || 3200;

// Creación automática de un profesor al inicio
const createInitialTeacher = async () => {
    try {
        // Verificar si ya hay un profesor creado
        const existingTeacher = await Teacher.findOne();
        if (!existingTeacher) {
            // Si no hay ningún profesor, crea uno nuevo
            const newTeacher = new Teacher({
                name: 'Josué Noj',
                username: 'jnoj',
                password: 'admin',
            });
            await newTeacher.save();
            console.log('New teacher created:', newTeacher);
        }
    } catch (error) {
        console.error('Error creating initial teacher:', error);
    }
};

// Configurar el servidor de express
server.use(express.urlencoded({ extended: false }));
server.use(express.json());
server.use(cors());
server.use(helmet());
server.use(morgan('dev'));

server.use('/student', studentRoutes);
server.use('/course', courseRoutes);
server.use('/teacher', teacherRoutes);

// Levantar el servidor
export const initServer = () => {
    // Crea el profesor inicial antes de iniciar el servidor
    createInitialTeacher();

    server.listen(port);
    console.log(`Server HTTP runing in port ${port}`);
};