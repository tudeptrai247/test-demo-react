import express from 'express';
import cors from 'cors';
const router = express.Router();
import pool from '../connectDB.js';
import { connect } from 'react-redux';

//Thêm Receipt
router.post('/',async(req,res) =>{
    const {supplier_id,note,item} =req.body;

    
    const connection =await pool.getConnection(); // chạy nhiều câu truy vấn cần transaction phải tạo 1 connect chạy 1 lần

    try{
        await connection.beginTransaction(); // bắt đầu transaction

        const[result] = await connection.execute(
            'INSERT INTO receipt (note,supplier_id) VALUES (?,?)',
            [note,supplier_id]
        );

        const id_receipt_detail =result.insertId;

        for(const product of item){
            console.log('insert receipt detail',{
               quantity: product.quantity, 
               unit_price: product.unit_price, 
               id_receipt_detail: id_receipt_detail, 
               product: product.product_id, 
               size: product.size_id
            })
            await connection.execute(
                 `INSERT INTO receipt_detail (quantity, unit_price, receipt_id, product_id, size_id) VALUES (?,?,?,?,?)`,
            [product.quantity, product.unit_price, id_receipt_detail, product.product_id, product.size_id]
            )

            await connection.execute(
            `INSERT INTO inventory (product_id,size_id,quantity) VALUES (?,?,?) ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
            [product.product_id,product.size_id,product.quantity]
        );
    }
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

        const [rows] =await pool.query(`SELECT receipt.receipt_id ,receipt.receipt_date,note,supplier.name,receipt.status FROM receipt JOIN supplier on receipt.supplier_id = supplier.id WHERE status=1 LIMIT ? OFFSET ?`,[limit,offset])

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
        const [rows] = await pool.query(`SELECT receipt_detail.receipt_detail_id ,receipt_detail.quantity,receipt_detail.unit_price,receipt_detail.receipt_id ,product.name,size.size
            FROM receipt_detail JOIN product
            ON receipt_detail.product_id = product.id
            JOIN size
            ON receipt_detail.size_id =size.id
             where receipt_detail.receipt_id=?`,
            [receipt_id]
        );
        res.status(200).json({
            EC:0,
            receipt_detail:rows
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

    const connection =await pool.getConnection();
    try{
        await connection.beginTransaction(); // bắt đầu transaction

        if(status === 0){


           const [detail]= await connection.execute(`SELECT product_id ,size_id,quantity FROM receipt_detail WHERE receipt_id=?`, // lấy sản phẩm , size và số lượng  sản phẩm của phiếu nhập muốn xóa cần xóa
            [receiptId]
        );

        for(const item of detail){
            // kiểm tra trong order có sản phẩm bán chưa
            const [soldCheck] = await connection.execute(`SELECT SUM(quantity) as sumQty FROM order_detail WHERE product_id =? AND size_id=?`,
                [item.product_id,item.size_id]
            )

            // truy cập vào symQty của soldCheck ở hàm trên
            const soldQuantity =soldCheck[0]?.sumQty || 0;

            if(soldQuantity >0){
                await connection.rollback();
                return res.status(400).json({
                    EC:2,
                    message:"Cannot Delete This Receipt , Some Product from receipt have been sold"
                })
            }

            // nếu chưa có sản phẩm bán thì update tồn kho
            await connection.execute(`UPDATE inventory SET quantity = quantity - ? WHERE product_id =? AND size_id =?`,
                [item.quantity, item.product_id ,item.size_id])
        }
    }

        const [result] = await connection.execute(
            'UPDATE receipt set status = ? WHERE receipt_id =? ',[status,receiptId]
        );
        
        await connection.commit(); // commit sau khi thành công

        res.status(200).json({
            EC:0, // error code =0 là success , khác 0 là lỗi
            message:'Receipt Delete Success',
            name:result.id});
    }catch(err){
        await connection.rollback() // rollback nếu lỗi
        console.error(err);
        res.status(500).json({
            EC:1,
            error:'Something Wrong '})
    }
}) 

export default router