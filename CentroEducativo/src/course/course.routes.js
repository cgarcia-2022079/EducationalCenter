'use strict'

import {Router} from 'express'
import { addCourse, deleteCourse, updateCourse, getAllCourses } from './course.controller.js'

const api = Router()
api.post('/save/:id', addCourse)
api.delete('/delete/:id', deleteCourse)
api.put('/update/:id', updateCourse)
api.get('/get/:id', getAllCourses)
export default api