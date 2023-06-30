import { Router } from "express"; 
import { studentModel } from "../dao/models/student.model.js";

const router = Router();

router.get('/', async (req,res)=>{
    try{
        let users = await studentModel.find();
        res.send({result:"success",payload:users})
    }
    catch(error){
        console.log("Cannot get users with mongoose: " + error);
    }
})

router.post('/insertMany', async (req,res)=>{

    let {first_name,last_name,age,dni,course,note} = req.body;
    if(!first_name || !last_name || !age || !dni || !course || !note) return res.status(400).send({status:"error",payload: "No se enviaron todos los campos"});
    if(await studentModel.findOne({dni:dni})) return res.status(400).send({status:"error",payload: "Ya existe un registro con el dni ingresadi"});
    let result = await studentModel.create({
        first_name,
        last_name,
        age,
        dni,
        course,
        note
    });
    res.send({status:"success",payload: result});
})

router.post('/', async (req,res)=>{

    let {first_name,last_name,age,dni,course,note} = req.body;
    if(!first_name || !last_name || !age || !dni || !course || !note) return res.status(400).send({status:"error",payload: "No se enviaron todos los campos"});
    if(await studentModel.findOne({dni:dni})) return res.status(400).send({status:"error",payload: "Ya existe un registro con el dni ingresadi"});
    let result = await studentModel.create({
        first_name,
        last_name,
        age,
        dni,
        course,
        note
    });
    res.send({status:"success",payload: result});
})

router.put('/:uid', async (req,res)=>{
    console.log(req);
    let {uid} = req.params;
    let userToReplace = req.body
    if(!userToReplace.first_name || !userToReplace.last_name || !userToReplace.age || !userToReplace.dni || !userToReplace.course || !userToReplace.note) 
        return res.status(400).send({status:"error",payload: "No se enviaron todos los campos"});

    let result = await studentModel.updateOne({_id:uid}, userToReplace)
    res.send({status:"success",payload: result});
})

router.delete('/:uid', async (req,res)=>{
    let {uid} = req.params;
    let result = await studentModel.deleteOne({_id:uid})
    res.send({status:"success",payload: result});
})


export default router;