import express from 'express';
import cors from 'cors';
const router = express.Router();
import pool from '../connectDB.js';

//Thêm Receipt
router.post('/',async(req,res) =>{
    const {supplier,product,size,quantity,unitprice,note} =req.body;

    const connection =await pool.getConnection(); // chạy nhiều câu truy vấn cần transaction phải tạo 1 connect chạy 1 lần

    try{
        await connection.beginTransaction(); // bắt đầu transaction

        const[result] = await connection.execute(
            'INSERT INTO receipt (note,supplier_id) VALUES (?,?)',
            [note,supplier]
        );

        const id_receipt_detail =result.insertId;

        await connection.execute(
            'INSERT INTO receipt_detail (quantity,unit_price,receipt_id,product_id,size_id) VALUES (?,?,?,?,?)',
            [quantity,unitprice,id_receipt_detail,product,size]
        );

        await connection.commit(); // nếu ko lỗi thì sẽ lưu lại (commit)

        res.status(200).json({
            EC:0,
            message:'Receipt Created Success',
            name:result.id
        });
    }catch(err){
        await connection.rollback(); // lỗi sẽ rollback lại
        console.log("transation error" ,err)
        console.log(err);
        res.status(500).json({
            EC:1,
            error:'Something Wrong , rollback transaction'
        });
    } finally{
        connection.release(); // giải phóng connection
    }
})

//phân trang danh sách receipt
router.get('/',async(req,res) =>{
    // lấy giá trị page và limit từ querry trên URL , nếu ko có tham số truyền vào mặc định sẽ là 1 và 3
    let page =+req.query.page || 1; //ép kiểu string sang number
    let limit =+req.query.limit || 3;
    let offset = (page -1) * limit ; // vị trí bắt đầu khi lấy dũ liệu , vd trang 1 -1 =0 *3 =0 lấy vị trị 0

    try {
        const [countRow] = await pool.execute(`SELECT COUNT(*) as count FROM receipt where status=1`); // đếm tổng số receipt , countRow là 1 mảng
        const totalReceipt = countRow[0].count; //lấy ra tổng số size , dùng để tính phân trang
        const totalPages =Math.ceil(totalReceipt/limit)

        const [rows] =await pool.query(`SELECT * FROM receipt WHERE status=1 LIMIT ? OFFSET ?`,[limit,offset])

        res.status(200).json({
            EC:0,
            DT:{
                receipt:rows, //trả về danh sách size hiện tại
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

// lấy chi tiết phiếu nhập của phiếu nhập đó
router.get('/:id/recieptdetail',async(req,res) =>{
    const receipt_id=req.params.id  //id là 1 chuỗi chứ ko phải object nên ko xài {}
    try{
        const [rows] = await pool.query('SELECT * FROM receipt_detail where receipt_id=?',
            [receipt_id]
        );
        res.status(200).json({
            EC:0,
            receipt_detail:rows[0]
        })
    } catch(err){
        console.log(err);
        res.status(500).json({
            EC:1,
            message :'Something Wrong'
        })
    }
})

//xóa mềm phiếu nhập

router.put('/:id',async(req,res) =>{
    const receiptId = req.params.id;
    const {status} = req.body;
    try{
        const [result] = await pool.execute(
            'UPDATE receipt set status = ? WHERE receipt_id =? ',[status,receiptId]
        );
        res.status(200).json({
            EC:0, // error code =0 là success , khác 0 là lỗi
            message:'Receipt Delete Success',
            name:result.id});
    }catch(err){
        console.error(err);
        res.status(500).json({
            EC:1,
            error:'Something Wrong '})
    }
}) 

export default router