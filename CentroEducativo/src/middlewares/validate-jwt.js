'use strict'

import jwt from 'jsonwebtoken'
import Student from '../student/student.model.js'

export const validateJwt = async (req, res, next) => {
    try {
        let secretKey = process.env.SECRET_KEY
        let { token } = req.headers
        if (!token) return res.status(401).send({ message: 'Unauthorized' })
        let {uid} = jwt.verify(token, secretKey)
    
        let user = await Student.findOne({_id: uid})
        if (!user) return res.status(401).send({ message: 'User not found - Unauthorized' })
        req.user = user
        next()
    } catch (error) {
        console.log(error)
        return res.status(401).send({ message: 'Invalid token or expired'})
    }
}

export const idTeacher = async (req, res, next) => {
    try {
        let {role, username} = req.user
        if (!role || role !== 'TEACHER_ROLE') return res.status(401).send({ message: `You dont have acces | username: ${username}` })
        next()
    } catch (error) {
        console.log(error)
        return res.status(401).send({ message: 'Error verification role'})
    }
}