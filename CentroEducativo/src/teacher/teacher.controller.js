'use strict'
import { encrypt} from "../utils/validator.js";
import Teacher from './teacher.model.js'

export const addTeacher = async (req, res)=>{
    try {
        let data = req.body
        data.password = await encrypt(data.password)
        let teacher = new Teacher(data)
        await teacher.save()
        return res.send({message: 'Teacher is saved successfully'})
    } catch (error) {
        console.log(error)
        return res.status(500).send({message: 'Error in saving Teacher'})
    }
}

export const deleteTeacher = async (req, res)=>{
    try {
        let {id} = req.params
        let deleteTeacher = await Teacher.deleteOne({_id: id})
        if (!deleteTeacher.deletedCount == 0) return res.status(404).send({message: 'Teacher not found, not deleted'})
        return res.send({message: 'Teacher deleted successfully'})
    } catch (error) {
        console.log(error)
        return res.status(500).send({message: 'Error in deleting Teacher'})
    }
}

export const updateTeacher = async (req, res)=>{
    try {
        let {id} = req.params
        let data = req.body
        let updateTeacher = await Teacher.findOneAndUpdate({_id:id}, data,{
            new: true
        })
        if (!updateTeacher) return res.status(401).send({message: 'Teacher not found and not update'})
        return res.send({message: 'Teacher updated successfully', updateTeacher})
    } catch (error) {
        console.log(error)
        return res.status(500).send({message: 'Error in updating Teacher'})
    }
}

export const dataTeachers = async (req, res)=>{
    try {
        let teacher = await Teacher.find()
        if (!teacher.length === 0) return res.status(404).send({message: 'Teacher not found'})
        return res.status(200).send({teacher})
    } catch (error) {
        console.log(error)
        return res.status(500).send({message: 'Error in getting teachers', error})
    }
}