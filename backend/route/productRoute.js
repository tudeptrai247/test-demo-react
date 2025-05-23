import express from 'express';
import cors from 'cors';
const router = express.Router();
import pool from '../connectDB.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url'; //đổi url thành đường dẫn hệ thống

//Cấu hình multer , để lưu trữ vào folder uploads khi gửi ảnh lên , tạo tên file đặc quyền

const __filename = fileURLToPath(import.meta.url); //import.meta.url trả về URL file hiện tại ,fileURLToPath truyển thành dường dẫn hệ thống vd /home/user/app.js
const __dirname = path.dirname(__filename);//path.dirname(__filename) trả về URL chứa file vd: /home/user

// thiết lập multer để lưu ảnh từ form
const storage = multer.diskStorage({
    destination:(req,file,cb) =>{
        cb(null,path.join(__dirname,'../uploads')) // nối tự mục hiện tại với folder uploads
    },
    filename:(req,file,cb)=>{ // tạo file name với tên duy nhất
        const uniqueSuffix=Date.now() +'-'+Math.round(Math.random()* 1E9);
        cb(null ,uniqueSuffix+ '-'+file.originalname)
    }
});

//xử lý form data , gắn file ảnh từ form data vào biến upload , lưu file ảnh vào mục,tạo thư mục folder nếu chưa có
const upload = multer({storage:storage});
import fs from 'fs';
const uploadDir =path.join(__dirname,'../uploads')
if(!fs.existsSync(uploadDir)){  
    fs.mkdirSync(uploadDir);    // tạo thư mục uploads nếu ko tồn tại
}

//Thêm product
router.post('/',upload.single('image'),async(req,res) =>{
    const {name,brand,category,price,description} =req.body;
    const image = req.file ?req.file.filename :null;
    try{
        const[result] = await pool.execute(
            'INSERT INTO product (name,idbrand,idcategory,price,description,image) VALUES (?,?,?,?,?,?)',
            [name,brand,category,price,description,image]
        );
        res.status(200).json({
            EC:0,
            message:'Product Created',
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

// xóa 
router.delete('/:id',async(req,res) =>{
    const productId = req.params.id;
    console.log(req.params.id)
    try{
        const [result] = await pool.execute(
            'DELETE FROM product WHERE id= ?',[productId]
        );
        res.status(200).json({
            EC:0, // error code =0 là success , khác 0 là lỗi
            message:'Delete Product Success',
            name:result.id});
    }catch(err){
        console.error(err);
        res.status(500).json({
            EC:1,
            error:'Something Wrong '})
    }
}) 

//update phải có upload.single để parse multi/form data tạo file ảnh vào uploads
router.put('/:id',upload.single('image'),async(req,res) =>{
    const productId = req.params.id;
    const {name,idbrand,idcategory,price,description,oldImage} = req.body;

    const image = req.file ?req.file.filename :oldImage;  // sd req.file để multer bắt ảnh , xét xem có file ko , nếu có thì req.file.filename mới , còn ko thì lấy cái oldImage

    console.log("body",req.body)
    console.log("file",req.file)
    try{
        const [result] = await pool.execute(
            'UPDATE product set name = ? ,idbrand=?,idcategory=?,price=?,description=?,image=? WHERE id =? ',[name,idbrand,idcategory,price,description,image,productId]
        );
        res.status(200).json({
            EC:0, // error code =0 là success , khác 0 là lỗi
            message:'Product Update Success',
            name:result.id
            });
    }catch(err){
        console.error(err);
        res.status(500).json({
            EC:1,
            error:'Something Wrong '})
    }
}) 

// cập nhật show hide
router.put('/:id/status',async(req,res) =>{
    const id =req.params.id;
    const {status} =req.body;
    try{
        const [result] = await pool.execute(
            'UPDATE product SET status = ? WHERE id=?',[status,id]
        );
        res.status(200).json({
            EC:0,
            message:'Change Show/Hide Product Success',
            name:result.id
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            EC:1,
            error:'something wrong'
        })
    }
})

// lấy tất cả sản phẩm
router.get('/all',async(req,res) =>{
    try{
        const [rows] = await pool.query('SELECT * FROM product')

        res.status(200).json({
            EC:0,
            product:rows
        })
    } catch(err){
        console.log(err);
        res.status(500).json({
            EC:1,
            message :'Something Wrong'
        })
    }
})

// lấy 4 sản phẩm
router.get('/4item',async(req,res) =>{
    try{
        const [rows] = await pool.query('SELECT * FROM product WHERE status=1 ORDER BY product.id DESC LIMIT 8')

        res.status(200).json({
                EC:0,
                product:rows
        })
    } catch(err){
        console.log(err);
        res.status(500).json({
            EC:1,
            message :'Something Wrong'
        })
    }
})

// 4 item nike
router.get('/nikeitem',async(req,res) =>{
    try{
        const [rows] = await pool.query
        ('SELECT product.name,product.price,product.image FROM product join brand on product.idbrand =brand.id WHERE brand="Nike" AND status=1 ORDER BY product.id DESC LIMIT 4')

        res.status(200).json({
                EC:0,
                product:rows
        })
    } catch(err){
        console.log(err);
        res.status(500).json({
            EC:1,
            message :'Something Wrong'
        })
    }
})

//4 item adidas
router.get('/adidasitem',async(req,res) =>{
    try{
        const [rows] = await pool.query
        ('SELECT product.name,product.price,product.image FROM product join brand on product.idbrand =brand.id WHERE brand="Adidas" AND status=1 ORDER BY product.id DESC LIMIT 4')

        res.status(200).json({
                EC:0,
                product:rows
        })
    } catch(err){
        console.log(err);
        res.status(500).json({
            EC:1,
            message :'Something Wrong'
        })
    }
})

//phân trang list product của user
router.get('/productuser',async(req,res) =>{
    // lấy giá trị page và limit từ querry trên URL , nếu ko có tham số truyền vào mặc định sẽ là 1 và 3
    let page =+req.query.page || 1; //ép kiểu string sang number
    let limit =+req.query.limit || 5;
    let offset = (page -1) * limit ; // vị trí bắt đầu khi lấy dũ liệu , vd trang 1 -1 =0 *3 =0 lấy vị trị 0

    try {
        const [countRow] = await pool.execute(`SELECT COUNT(*) as count FROM product`); // đếm tổng số size , countRow là 1 mảng
        const totalProduct = countRow[0].count; //lấy ra tổng số size , dùng để tính phân trang
        const totalPages =Math.ceil(totalProduct/limit)

        const [rows] =await pool.query(`SELECT product.id,product.name,brand.brand,category.category ,product.price,product.description,product.image FROM product JOIN brand ON product.idbrand=brand.id JOIN category ON product.idcategory=category.id WHERE product.status=1 LIMIT ? OFFSET ?`,[limit,offset])

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

// filter lọc sản phẩm
router.get('/filter',async(req,res) =>{
    const {brand , category} = req.query  // req.querry là để gửi dữ liệu tù URL 
    try {
        let querry =`SELECT product.id,product.name,brand.brand,category.category ,product.price,product.description,product.image
             FROM product
              JOIN brand ON product.idbrand=brand.id 
              JOIN category ON product.idcategory=category.id 
              WHERE product.status=1`;

        let querryParams =[];

        if(brand){
            querry +=" AND product.idbrand =?";
            querryParams.push(brand)
        }

         if(category){
            querry +=" AND product.idcategory =?";
            querryParams.push(category)
        }

        const [rows] = await pool.query(querry,querryParams)
         

        res.status(200).json({
            EC:0,
            DT:{
                product:rows, //trả về danh sách product hiện tại
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

//tìm kiếm sản phẩm

router.get('/search',async(req,res) =>{
    const {keyword} = req.query  // req.querry là để gửi dữ liệu tù URL 
    try {
        let searchQuerry =`SELECT product.id,product.name,brand.brand,category.category ,product.price,product.description,product.image
             FROM product
              JOIN brand ON product.idbrand=brand.id 
              JOIN category ON product.idcategory=category.id 
              WHERE product.status=1 AND product.name LIKE ?`;

        const [rows] = await pool.query(searchQuerry,[`%${keyword}%`]) // dùng %% trả về tìm kiếm mờ
         

        res.status(200).json({
            EC:0,
            DT:{
                product:rows, //trả về danh sách product hiện tại
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