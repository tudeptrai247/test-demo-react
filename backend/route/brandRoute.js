import express from 'express';
import cors from 'cors';
const router = express.Router();
import pool from '../connectDB.js';

//Thêm brand
router.post('/',async(req,res) =>{
    const {brand} =req.body;
    try{
        const[result] = await pool.execute(
            'INSERT INTO brand (brand) VALUES (?)',[brand]
        );
        res.status(200).json({
            EC:0,
            message:'Brand Created',
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

//phân trang danh sách brand
router.get('/',async(req,res) =>{
    // lấy giá trị page và limit từ querry trên URL , nếu ko có tham số truyền vào mặc định sẽ là 1 và 3
    let page =+req.query.page || 1; //ép kiểu string sang number
    let limit =+req.query.limit || 3;
    let offset = (page -1) * limit ; // vị trí bắt đầu khi lấy dũ liệu , vd trang 1 -1 =0 *3 =0 lấy vị trị 0

    try {
        const [countRow] = await pool.execute(`SELECT COUNT(*) as count FROM brand`); // đếm tổng số size , countRow là 1 mảng
        const totalBrand = countRow[0].count; //lấy ra tổng số size , dùng để tính phân trang
        const totalPages =Math.ceil(totalBrand/limit)

        const [rows] =await pool.query(`SELECT * FROM brand LIMIT ? OFFSET ?`,[limit,offset])

        res.status(200).json({
            EC:0,
            DT:{
                brand:rows, //trả về danh sách brand hiện tại
                totalPages:totalPages// trả về tổng số trang
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

// xóa size
router.delete('/:id',async(req,res) =>{
    const brandId = req.params.id;
    console.log(req.params.id)
    try{
        const [result] = await pool.execute(
            'DELETE FROM brand WHERE id= ?',[brandId]
        );
        res.status(200).json({
            EC:0, // error code =0 là success , khác 0 là lỗi
            message:'Delete Brand Success',
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
    const brandId = req.params.id;
    const {brand} = req.body;
    try{
        const [result] = await pool.execute(
            'UPDATE brand set brand = ? WHERE id =? ',[brand,brandId]
        );
        res.status(200).json({
            EC:0, // error code =0 là success , khác 0 là lỗi
            message:'Brand Update Success',
            name:result.id});
    }catch(err){
        console.error(err);
        res.status(500).json({
            EC:1,
            error:'Something Wrong '})
    }
}) 

//Tất cả brand

router.get('/all',async(req,res) =>{
    try{
        const [rows] = await pool.query('SELECT * FROM brand')

        res.status(200).json({
            EC:0,
            brand:rows
        })
    } catch(err){
        console.log(err);
        res.status(500).json({
            EC:1,
            message :'Something Wrong'
        })
    }
})

export default router