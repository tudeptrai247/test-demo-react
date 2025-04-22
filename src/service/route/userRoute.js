import express from 'express';
import cors from 'cors';
const router = express.Router();

router.post('/',async(req,res) =>{
    const {email,password,username,role} = req.body;
    try{
        const [result] = await pool.execute(
            'INSERT INTO user (email,password,username,role) VALUES (?,?,?,?)'[email,password,username,role]
        );
        res.status(200).json({message:'User created',name:result.username});
    }catch(err){
        res.status(500).json({error:'Something Wrong '})
    }
}) 

export default router