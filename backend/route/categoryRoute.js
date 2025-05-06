import express from 'express';
import cors from 'cors';
const router = express.Router();
import pool from '../connectDB.js';

//Thêm category
router.post('/',async(req,res) =>{
    const {category} =req.body;
    try{
        const[result] = await pool.execute(
            'INSERT INTO category (category) VALUES (?)',[category]
        );
        res.status(200).json({
            EC:0,
            message:'Category Created',
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

//phân trang danh sách category
router.get('/',async(req,res) =>{
    // lấy giá trị page và limit từ querry trên URL , nếu ko có tham số truyền vào mặc định sẽ là 1 và 3
    let page =+req.query.page || 1; //ép kiểu string sang number
    let limit =+req.query.limit || 3;
    let offset = (page -1) * limit ; // vị trí bắt đầu khi lấy dũ liệu , vd trang 1 -1 =0 *3 =0 lấy vị trị 0

    try {
        const [countRow] = await pool.execute(`SELECT COUNT(*) as count FROM category`); // đếm tổng số size , countRow là 1 mảng
        const totalCategory = countRow[0].count; //lấy ra tổng số size , dùng để tính phân trang
        const totalPages =Math.ceil(totalCategory/limit)

        const [rows] =await pool.query(`SELECT * FROM category LIMIT ? OFFSET ?`,[limit,offset])

        res.status(200).json({
            EC:0,
            DT:{
                category:rows, //trả về danh sách size hiện tại
                totalPages:totalPages // trả về tổng số trang
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

// xóa 
router.delete('/:id',async(req,res) =>{
    const categoryId = req.params.id;
    console.log(req.params.id)
    try{
        const [result] = await pool.execute(
            'DELETE FROM category WHERE id= ?',[categoryId]
        );
        res.status(200).json({
            EC:0, // error code =0 là success , khác 0 là lỗi
            message:'Delete Category Success',
            name:result.id});
    }catch(err){
        console.error(err);
        res.status(500).json({
            EC:1,
            error:'Something Wrong '})
    }
}) 

//update
router.put('/:id',async(req,res) =>{
    const categoryId = req.params.id;
    const {category} = req.body;
    try{
        const [result] = await pool.execute(
            'UPDATE category set category = ? WHERE id =? ',[category,categoryId]
        );
        res.status(200).json({
            EC:0, // error code =0 là success , khác 0 là lỗi
            message:'Category Update Success',
            name:result.id});
    }catch(err){
        console.error(err);
        res.status(500).json({
            EC:1,
            error:'Something Wrong '})
    }
}) 

export default router