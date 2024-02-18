'use strict'

import {Router} from 'express'
import {register,login, deleteStudent, updateStudent, dataStudents, addCourseToStudent} from './student.controller.js'

const api = Router()
api.post('/register', register)
api.delete('/delete/:id', deleteStudent)
api.put('/update/:id', updateStudent)
api.get('/get/:id', dataStudents)
api.post('/addCourse/:studentId', addCourseToStudent);
api.post('/login', login);
export default api