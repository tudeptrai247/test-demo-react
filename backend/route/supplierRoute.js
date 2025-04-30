import express from 'express';
import cors from 'cors';
const router = express.Router();
import pool from '../connectDB.js';

//Thêm nhà cung cấp
router.post('/',async(req,res) =>{
    const {name,address,number} =req.body;
    try{
        const[result] = await pool.execute(
            'INSERT INTO supplier (name,address,number) VALUES (?,?,?)',[name,address,number]
        );
        res.status(200).json({
            EC:0,
            message:'Supplier Created',
            name:result.id
        });
    }catch(err){
        console.log(err);
        res.status(500).json({
            EC:1,
            error:'Something Wrong'
        })
    }
})

export default router