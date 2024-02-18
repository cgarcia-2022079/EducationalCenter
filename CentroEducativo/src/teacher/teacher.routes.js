'use strict'

import {Router} from 'express'
import {addTeacher, deleteTeacher, updateTeacher, dataTeachers} from './teacher.controller.js'

const api = Router()
api.post('/save', addTeacher)
api.delete('/delete/:id', deleteTeacher)
api.put('/update/:id', updateTeacher)
api.get('/get', dataTeachers)
export default api