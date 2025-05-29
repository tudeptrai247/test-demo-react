import express from 'express';
import cors from 'cors';
const router = express.Router();
import pool from '../connectDB.js';


//phân trang danh sách inventory
router.get('/',async(req,res) =>{
    // lấy giá trị page và limit từ querry trên URL , nếu ko có tham số truyền vào mặc định sẽ là 1 và 3
    let page =+req.query.page || 1; //ép kiểu string sang number
    let limit =+req.query.limit || 3;
    let offset = (page -1) * limit ; // vị trí bắt đầu khi lấy dũ liệu , vd trang 1 -1 =0 *3 =0 lấy vị trị 0

    try {
        const [countRow] = await pool.execute(`SELECT COUNT(*) as count FROM inventory`); // đếm tổng số receipt , countRow là 1 mảng
        const totalInventory = countRow[0].count; //lấy ra tổng số size , dùng để tính phân trang
        const totalPages =Math.ceil(totalInventory/limit)

        const [rows] =await pool.query(`SELECT inventory.inventory_id,product.name,size.size,inventory.quantity FROM inventory 
            JOIN product ON inventory.product_id = product.id 
            JOIN size ON inventory.size_id =size.id LIMIT ? OFFSET ?`,[limit,offset])

        res.status(200).json({
            EC:0,
            DT:{
                inventory:rows, //trả về danh sách size hiện tại 
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

// lấy size của sản phẩm trong kho
router.get('/allsizeproduct',async(req,res) =>{
    const {product_id}=req.query
    try{

        const [rows] = await pool.query(`SELECT inventory.size_id ,size.size,inventory.product_id,inventory.quantity FROM inventory
            JOIN size ON inventory.size_id =size.id
            WHERE product_id=?`,
            [product_id]
        )

        res.status(200).json({
            EC:0,
            size:rows
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