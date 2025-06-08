import express from 'express';
import cors from 'cors';
const router = express.Router();
import pool from '../connectDB.js';

// lấy số lượng đơn hàng theo trạng thái
router.get('/orderStatus', async (req ,res) =>{
    const [rows] =await pool.execute(`SELECT status ,COUNT(*) AS count FROM order_customer GROUP BY status `);

    res.json(rows)
})

export default router