import express from 'express';
import cors from 'cors';
const router = express.Router();
import pool from '../connectDB.js';
import jwt from 'jsonwebtoken';


// Đăng ký người dùng
router.post('/register',async(req,res) =>{
    const {username,email,password} = req.body;
    const role = "USER" ;
    try{
        const [result] = await pool.execute(
            'INSERT INTO user (email, password, username, role) VALUES (?, ?, ?, ?)',[email, password, username, role]
        );
        res.status(200).json({
            EC:0, // error code =0 là success , khác 0 là lỗi
            message:'User Register Success',
            name:result.id});
    }catch(err){
        console.error(err);
        res.status(500).json({
            EC:1,
            error:'Something Wrong '})
    }
}) 

// Đăng Nhập
router.post('/login',async(req,res) =>{
    const {email,password} = req.body;
    try{
        const [result] = await pool.execute(
            'SELECT * FROM user WHERE email = ? AND password =?',[email, password]
        );

        if(result.length===0){
           return res.status(404).json
           ({
                EC:2,
                message: 'User Not Found'
           }) 
        }

        const user =result[0];  // gán user là kết quả đầu tiên
        // tạo access và refreshToken để lưu trữ lại thông tin người dùng 
        const accessToken =jwt.sign({id:user.id ,email:user.email ,role:user.role},'yourAccessSecret',{expiresIn:'15m'});
        const refreshToken =jwt.sign({id:user.id},'yourRefreshSecret',{expiresIn:'7d'});


        res.status(200).json({
            EC:0, // error code =0 là success , khác 0 là lỗi
            message:'Login Success',
            DT:{
                id:user.id,
                access_token:accessToken,
                refresh_token:refreshToken,
                username:user.username,
                email:user.email,
                role:user.role
            }
        });
    }catch(err){
        console.error(err);
        res.status(500).json({
            EC:1,
            error:'Something Wrong '})
    }
}) 

export default router