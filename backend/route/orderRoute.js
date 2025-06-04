import express from 'express';
import cors from 'cors';
const router = express.Router();
import pool from '../connectDB.js';

router.post('/',async(req,res) =>{
    const {address,number,payment_method,total,note,user_id,item} =req.body

    const connection =await pool.getConnection(); // chạy nhiều câu truy vấn cần transaction phải tạo 1 connect chạy 1 lần

    try{
        await connection.beginTransaction(); // bắt đầu transaction

        const [result] = await connection.execute(`INSERT INTO order_customer (address,number,payment_method,total,note,user_id	) VALUES (?,?,?,?,?,?)`,
        [address,number,payment_method,total,note,user_id]
        ); 

        const order_id = result.insertId;

        for(const product of item){
            // kiểm tra data để vào order_detail
            console.log('detail product add to order_detail',{
                quantity :product.quantity,
                order_id : order_id,
                product_id: product.product_id,
                size_id: product.size_id
            })

            await connection.execute(`INSERT INTO order_detail(quantity, order_id, product_id, size_id) VALUES (?,?,?,?)`,
                [product.quantity,order_id,product.product_id,product.size_id]
            );

            await connection.execute("DELETE FROM cart_detail WHERE product_id =?",
            [product.product_id]
        );

        }   

        await connection.commit();

        res.status(200).json({
            EC:0,
            message:'Order Success',
            orderId :order_id
        })
    }catch(err){
        await connection.rollback();
        console.log(err);
        res.status(500).json({
            EC:1,
            error:'Something Wrong , rollback transaction'
        })
    }finally{
        connection.release();
    }
})

router.get('/',async(req,res) =>{
    const {user_id} =req.query
    // lấy giá trị page và limit từ querry trên URL , nếu ko có tham số truyền vào mặc định sẽ là 1 và 3
    let page =+req.query.page || 1; //ép kiểu string sang number
    let limit =+req.query.limit || 3;
    let offset = (page -1) * limit ; // vị trí bắt đầu khi lấy dũ liệu , vd trang 1 -1 =0 *3 =0 lấy vị trị 0

    try {
        const [countRow] = await pool.execute(`SELECT COUNT(*) as count FROM order_customer WHERE user_id=?
            AND( 
                (payment_method ='cod' AND payment_status='unpaid')
                OR
                (payment_method ='banking' AND payment_status='paid')
            )`,[user_id]); // đếm tổng số receipt , countRow là 1 mảng
        const totalOrder = countRow[0].count; //lấy ra tổng số size , dùng để tính phân trang
        const totalPages =Math.ceil(totalOrder/limit)

        const [rows] =await pool.query(`SELECT order_customer.order_id ,order_customer.address ,order_customer.number,order_customer.status,order_customer.order_date,order_customer.total,order_customer.note,order_customer.payment_method,
            order_detail.quantity ,order_detail.order_id ,order_detail.product_id,product.name as name_product ,order_detail.size_id ,size.size as size
            FROM order_customer 
            JOIN order_detail ON order_customer.order_id = order_detail.order_id 
            JOIN product ON order_detail.product_id =product.id
            JOIN size ON order_detail.size_id = size.id
            WHERE order_customer.user_id =?
             AND( 
                (payment_method ='cod' AND payment_status='unpaid')
                OR
                (payment_method ='banking' AND payment_status='paid')
            )
            LIMIT ? OFFSET ?`,[user_id,limit,offset])

        res.status(200).json({
            EC:0,
            DT:{
                orderCustomer:rows, //trả về danh sách size hiện tại 
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

export default router