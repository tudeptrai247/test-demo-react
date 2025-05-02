import express from 'express';
import cors from 'cors';
const router = express.Router();
import pool from '../connectDB.js';

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
        const totalUsers = countRow[0].count; //lấy ra tổng số user , countRow[0] lấy object đầu  và .count để lấy tổng số user
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
    try{
        const [result] = await pool.execute(
            'DELETE FROM user WHERE id= ?',[userId]
        );
        res.status(200).json({
            EC:0, // error code =0 là success , khác 0 là lỗi
            message:'Delete User Success',
            name:result.id});
    }catch(err){
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

export default router