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

        const [rows] =await pool.query(`SELECT product.id,product.name,brand.brand,category.category ,product.price,product.description,product.image,product.status
             FROM product
              JOIN brand ON product.idbrand=brand.id 
              JOIN category ON product.idcategory=category.id 
              ORDER BY product.id DESC
               LIMIT ? OFFSET ?`,[limit,offset])

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

    const connection = await pool.getConnection();
    try{
        await connection.beginTransaction();
        const [checkProductInInventory] = await connection.execute(`
                SELECT * FROM inventory WHERE product_id=?
            `,[productId])
            if(checkProductInInventory.length >0){
            await connection.rollback();
            return res.status(400).json({
                EC:2,
                message:"Cant not delete this Product , This Product has been in inventory"
            })
        }

        const [result] = await pool.execute(
            'DELETE FROM product WHERE id= ?',[productId]
        );
        await connection.commit()
        res.status(200).json({
            EC:0, // error code =0 là success , khác 0 là lỗi
            message:'Delete Product Success',
            name:result.id});
    }catch(err){
        await connection.rollback()
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
    console.log("id product change status",id,"status",status)
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

// lấy 8 sản phẩm
router.get('/4item',async(req,res) =>{
    try{
        // truy vấn join inventory để lấy những sản phẩm có trong kho
        const [rows] = await pool.query(`SELECT  product.id,product.name,product.price,product.image ,brand.brand,category.category ,product.price,product.description,product.status ,JSON_ARRAYAGG(JSON_OBJECT('size_id',size.id,'size',size.size ,'quantity',inventory.quantity)) AS size_quantity from product
            JOIN inventory on product.id = inventory.product_id
            JOIN size on inventory.size_id =size.id
            JOIN brand ON product.idbrand=brand.id 
            JOIN category ON product.idcategory=category.id
            WHERE status=1
            GROUP BY product.id
            ORDER BY product.id DESC LIMIT 8`)

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
        (`SELECT  product.id,product.name,product.price,product.image ,brand.brand,category.category ,product.price,product.description ,product.status,JSON_ARRAYAGG(JSON_OBJECT('size_id',size.id,'size',size.size ,'quantity',inventory.quantity)) AS size_quantity from product
            JOIN inventory on product.id = inventory.product_id
            JOIN size on inventory.size_id =size.id
            JOIN brand ON product.idbrand=brand.id 
            JOIN category ON product.idcategory=category.id
             WHERE brand="Nike" AND status=1
             GROUP BY product.id
             ORDER BY product.id DESC LIMIT 4`)

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
        (`SELECT  product.id,product.name,product.price,product.image ,brand.brand,category.category ,product.price,product.description ,product.status,JSON_ARRAYAGG(JSON_OBJECT('size_id',size.id,'size',size.size ,'quantity',inventory.quantity)) AS size_quantity from product
            JOIN inventory on product.id = inventory.product_id
            JOIN size on inventory.size_id =size.id
            JOIN brand ON product.idbrand=brand.id 
            JOIN category ON product.idcategory=category.id
            WHERE brand="Adidas" AND status=1 
            GROUP BY product.id  
            ORDER BY product.id DESC LIMIT 4`)

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

        const [rows] =await pool.query(`SELECT product.id,product.name,brand.brand,category.category ,product.price,product.description,product.image,product.status,JSON_ARRAYAGG(JSON_OBJECT('size_id',size.id,'size',size.size ,'quantity',inventory.quantity)) AS size_quantity 
            FROM product 
            JOIN brand ON product.idbrand=brand.id 
            JOIN category ON product.idcategory=category.id 
            JOIN inventory on product.id = inventory.product_id
            JOIN size on inventory.size_id =size.id
            WHERE product.status=1
            GROUP BY product.id      
            LIMIT ? OFFSET ?`,[limit,offset])
                    // phải có group by product.id để biết được gom size của sản phẩm nào , do dùng inner join nên chỉ lấy các sản phẩm có trong inventory
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
    const {brand,category,keyword} = req.query  // req.querry là để gửi dữ liệu tù URL 
    try {
        // lấy size và số lượng của sản phẩm đó gom thành 1 mảng
        let querry =`SELECT product.id,product.name,brand.brand,category.category ,product.price,product.description,product.image,JSON_ARRAYAGG(JSON_OBJECT('size_id',size.id,'size',size.size ,'quantity',inventory.quantity)) AS size_quantity 
             FROM product
              JOIN brand ON product.idbrand=brand.id 
              JOIN category ON product.idcategory=category.id 
              JOIN inventory on product.id = inventory.product_id
              JOIN size on inventory.size_id =size.id
              WHERE product.status=1
               `;

        let querryParams =[];

        if(brand){
            querry +=" AND product.idbrand =?";
            querryParams.push(brand)
        }

         if(category){
            querry +=" AND product.idcategory =?";
            querryParams.push(category)
        }
        if(keyword){
           querry += ` AND product.name LIKE ?`;
            querryParams.push(`%${keyword}%`);
        }
            
        //group by để gom size và số lượng theo id sản phẩm đó 
        querry+="GROUP BY product.id"

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
        let searchQuerry =`SELECT product.id,product.name,brand.brand,category.category ,product.price,product.description,product.status,product.image,JSON_ARRAYAGG(size.size) AS size
             FROM product
              JOIN brand ON product.idbrand=brand.id 
              JOIN category ON product.idcategory=category.id 
              JOIN inventory on product.id = inventory.product_id
              JOIN size on inventory.size_id =size.id
              WHERE product.status=1 AND product.name LIKE ?
              GROUP BY product.id`;

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