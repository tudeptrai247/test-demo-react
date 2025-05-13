import express from 'express';
import cors from 'cors';
const router = express.Router();
import pool from '../connectDB.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

//Cấu hình multer , để lưu trữ vào folder uploads khi gửi ảnh lên , tạo tên file đặc quyền

//import.meta.url chuyển về đường dẫn chuẩn windows
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//path.join để kết nối đường dẫn giữa dirname và uploads
const storage = multer.diskStorage({
    destination:(req,file,cb) =>{
        cb(null,path.join(__dirname,'../uploads'))
    },
    filename:(req,file,cb)=>{
        const uniqueSuffix=Date.now() +'-'+Math.round(Math.random()* 1E9);
        cb(null ,uniqueSuffix+ '-'+file.originalname)
    }
});

//xử lý form data , gắn file ảnh từ form data vào biến upload , lưu file ảnh vào mục,tạo thư mục folder nếu chưa có
const upload = multer({storage:storage});
import fs from 'fs';
const uploadDir =path.join(__dirname,'../uploads')
if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

//Thêm product
router.post('/',upload.single('image'),async(req,res) =>{
    const {name,size,brand,category,price,description} =req.body;
    const image = req.file ?req.file.filename :null;
    try{
        const[result] = await pool.execute(
            'INSERT INTO product (name,idsize,idbrand,idcategory,price,description,image) VALUES (?,?,?,?,?,?,?)',
            [name,size,brand,category,price,description,image]
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


//phân trang danh sách product
router.get('/',async(req,res) =>{
    // lấy giá trị page và limit từ querry trên URL , nếu ko có tham số truyền vào mặc định sẽ là 1 và 3
    let page =+req.query.page || 1; //ép kiểu string sang number
    let limit =+req.query.limit || 5;
    let offset = (page -1) * limit ; // vị trí bắt đầu khi lấy dũ liệu , vd trang 1 -1 =0 *3 =0 lấy vị trị 0

    try {
        const [countRow] = await pool.execute(`SELECT COUNT(*) as count FROM product`); // đếm tổng số size , countRow là 1 mảng
        const totalProduct = countRow[0].count; //lấy ra tổng số size , dùng để tính phân trang
        const totalPages =Math.ceil(totalProduct/limit)

        const [rows] =await pool.query(`SELECT * FROM product LIMIT ? OFFSET ?`,[limit,offset])

        res.status(200).json({
            EC:0,
            DT:{
                product:rows, //trả về danh sách product hiện tại
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