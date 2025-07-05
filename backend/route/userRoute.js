import express from 'express';
import cors from 'cors';
const router = express.Router();
import pool from '../connectDB.js';
import { sendMail } from '../emailService.js';

// thêm người dùng
router.post('/',async(req,res) =>{
    const {email,password,username,role} = req.body;
    try{
        const [result] = await pool.execute(
            'INSERT INTO user (email, password, username, role) VALUES (?, ?, ?, ?)',[email, password, username, role]
        );
        res.status(200).json({
            EC:0, // error code =0 là success , khác 0 là lỗi
            message:'User created',
            name:result.id});
    }catch(err){
        console.error(err);
        res.status(500).json({
            EC:1,
            error:'Something Wrong '})
    }
}) 

// lấy danh sách người dùng phân trang
router.get('/',async(req,res) =>{
    // lấy giá trị page và limit từ querry trên URL , nếu ko có tham số truyền vào mặc định sẽ là 1 và 3
    let page =+req.query.page || 1; //ép kiểu string sang number
    let limit =+req.query.limit || 3;
    let offset = (page -1) * limit ; // vị trí bắt đầu khi lấy dũ liệu , vd trang 1 -1 =0 *3 =0 lấy vị trị 0

    try {
        const [countRow] = await pool.execute(`SELECT COUNT(*) as count FROM user`); // đếm tổng số user , countRow là 1 mảng
        const totalUsers = countRow[0].count; //lấy ra tổng số user dùng để tính phân trang
        const totalPages =Math.ceil(totalUsers/limit)

        const [rows] =await pool.query(`SELECT * FROM user LIMIT ? OFFSET ?`,[limit,offset])

        res.status(200).json({
            EC:0,
            DT:{
                user:rows, //trả về danh sách người dùng hiện t
                totalPages:totalPages
            }
        });
    }catch(err){
        console.log(err);
        res.status(500).json({
            EC:1,
            message :'Something Wrong'
        })
    }
})

// xóa người dùng
router.delete('/:id',async(req,res) =>{
    const userId = req.params.id;
    console.log(req.params.id)

    const connection = await pool.getConnection();
    try{
        await connection.beginTransaction();

        const [checkUserInOrder] = await connection.execute(`SELECT * FROM order_customer WHERE user_id=?`,[userId])
        if(checkUserInOrder.length >0){
            await connection.rollback();
            return res.status(400).json({
                EC:2,
                message:"Cant not delete this user , This user has been buy some items in order"
            })
        }
        const [result] = await pool.execute(
            'DELETE FROM user WHERE id= ?',[userId]
        );

        await connection.commit()
        res.status(200).json({
            EC:0, // error code =0 là success , khác 0 là lỗi
            message:'Delete User Success',
            name:result.id});
    }catch(err){
        await connection.rollback()
        console.error(err);
        res.status(500).json({
            EC:1,
            error:'Something Wrong '})
    }
}) 
// cập nhật
router.put('/:id',async(req,res) =>{
    const userId = req.params.id;
    const {username,role} = req.body;
    try{
        const [result] = await pool.execute(
            'UPDATE user set username = ? ,role = ? WHERE id =? ',[username, role,userId]
        );
        res.status(200).json({
            EC:0, // error code =0 là success , khác 0 là lỗi
            message:'User Update Success',
            name:result.id});
    }catch(err){
        console.error(err);
        res.status(500).json({
            EC:1,
            error:'Something Wrong '})
    }
}) 

//kiểm tra mật khẩu hiện tại có đúng với email đang xài ko và gửi mã code
router.post('/send-code-change-password-profile' ,async(req,res) =>{
    const {email,password} = req.body;
    // kiểm tra mật khẩu có đúng ko
    const [rows] = await pool.execute(`SELECT * FROM user WHERE email =? AND password=?`,[email,password])

    if(rows.length ===0){
        return res.status(400).json({EC:1 , message:"Wrong Password"})
    }

    return res.status(200).json({EC:0 ,message:"Confirm Success"})
})






export default router