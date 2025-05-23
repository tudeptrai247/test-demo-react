import express from 'express';
import cors from 'cors';
const router = express.Router();
import pool from '../connectDB.js';

//phân trang danh sách delete receipt
router.get('/',async(req,res) =>{
    // lấy giá trị page và limit từ querry trên URL , nếu ko có tham số truyền vào mặc định sẽ là 1 và 3
    let page =+req.query.page || 1; //ép kiểu string sang number
    let limit =+req.query.limit || 3;
    let offset = (page -1) * limit ; // vị trí bắt đầu khi lấy dũ liệu , vd trang 1 -1 =0 *3 =0 lấy vị trị 0

    try {
        const [countRow] = await pool.execute(`SELECT COUNT(*) as count FROM receipt where status=0`); // đếm tổng số receipt , countRow là 1 mảng
        const totalDeleteReceipt = countRow[0].count; //lấy ra tổng số size , dùng để tính phân trang
        const totalPages =Math.ceil(totalDeleteReceipt/limit)

        const [rows] =await pool.query(`SELECT * FROM receipt WHERE status=0 LIMIT ? OFFSET ?`,[limit,offset])

        res.status(200).json({
            EC:0,
            DT:{
                deletereceipt:rows, //trả về danh sách size hiện tại 
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

//khôi phục phiếu nhập

router.put('/:id',async(req,res) =>{
    const receiptId = req.params.id;
    const {status} = req.body;
    try{
        const [result] = await pool.execute(
            'UPDATE receipt set status = ? WHERE receipt_id =? ',[status,receiptId]
        );
        res.status(200).json({
            EC:0, // error code =0 là success , khác 0 là lỗi
            message:'Receipt Restore Success',
            name:result.id});
    }catch(err){
        console.error(err);
        res.status(500).json({
            EC:1,
            error:'Something Wrong '})
    }
}) 

export default router