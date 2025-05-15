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

//phân trang danh sách nhà cung cấp
router.get('/',async(req,res) =>{
     // lấy giá trị page và limit từ querry trên URL , nếu ko có tham số truyền vào mặc định sẽ là 1 và 3
     let page =+req.query.page || 1; //ép kiểu string sang number
     let limit =+req.query.limit || 3;
     let offset = (page -1) * limit ; // vị trí bắt đầu khi lấy dũ liệu , vd trang 1 -1 =0 *3 =0 lấy vị trị 0
 
     try {
         const [countRow] = await pool.execute(`SELECT COUNT(*) as count FROM supplier`); // đếm tổng số supplier , countRow là 1 mảng
         const totalSupplier = countRow[0].count; //lấy ra tổng số supplier dùng để tính phân trang
         const totalPages =Math.ceil(totalSupplier/limit)
 
         const [rows] =await pool.query(`SELECT * FROM supplier LIMIT ? OFFSET ?`,[limit,offset])
 
         res.status(200).json({
             EC:0,
             DT:{
                 supplier:rows, //trả về danh sách người dùng hiện tại
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
// xóa nhà cung
router.delete('/:id',async(req,res) =>{
    const supplierId = req.params.id;
    console.log(req.params.id)
    try{
        const [result] = await pool.execute(
            'DELETE FROM supplier WHERE id= ?',[supplierId]
        );
        res.status(200).json({
            EC:0, // error code =0 là success , khác 0 là lỗi
            message:'Delete Supplier Success',
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
    const supplierId = req.params.id;
    const {name,address,number} = req.body;
    try{
        const [result] = await pool.execute(
            'UPDATE supplier set name = ? ,address = ?,number = ? WHERE id =? ',[name,address,number,supplierId]
        );
        res.status(200).json({
            EC:0, // error code =0 là success , khác 0 là lỗi
            message:'Supplier Update Success',
            name:result.id});
    }catch(err){
        console.error(err);
        res.status(500).json({
            EC:1,
            error:'Something Wrong '})
    }
}) 

// lấy tất cả nhà cung
router.get('/all',async(req,res) =>{
    try{
        const [rows] = await pool.query('SELECT * FROM supplier')

        res.status(200).json({
            EC:0,
            supplier:rows
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