import express from 'express';
import cors from 'cors';
const router = express.Router();
import pool from '../connectDB.js';

// lấy số lượng đơn hàng theo trạng thái
router.get('/orderStatus', async (req ,res) =>{
    const [rows] =await pool.execute(`SELECT status ,COUNT(*) AS count FROM order_customer  GROUP BY status `);

    res.json(rows)
})

// lấy sản phẩm bán chạy nhất
router.get('/bestSelling', async (req ,res) =>{
    const [rows] =await pool.execute(`SELECT order_detail.product_id , product.name  ,SUM(order_detail.quantity) AS total_sold
         FROM order_detail
         JOIN product ON order_detail.product_id = product.id
         GROUP BY product_id
         ORDER BY total_sold DESC 
         LIMIT 5 `);
    res.json(rows)
})

// tính doanh thu theo tháng
router.get('/revenue/month', async (req ,res) =>{
    const [rows] =await pool.execute(`SELECT DATE_FORMAT(order_date ,'%Y-%m') as month, 
        SUM(total) AS revenue FROM order_customer
        GROUP BY month
        ORDER BY month `); //order by cho sắp xếp theo thứ tự
    res.json(rows)
})

router.get('/orderRate', async (req ,res) =>{
    const [rows] =await pool.execute(`SELECT status ,COUNT(*) AS count FROM order_customer WHERE status IN("canceled" ,"delivered")  GROUP BY status `);

    res.json(rows)
})

export default router