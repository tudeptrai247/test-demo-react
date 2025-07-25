import express from 'express';
import cors from 'cors';
const router = express.Router();
import pool from '../connectDB.js';
import jwt from 'jsonwebtoken';
import { sendMail } from '../emailService.js';


// Đăng ký người dùng , lưu tạm vào bảng email_verfication để luu thông tin
router.post('/requestRegister',async(req,res) =>{
    const {username,email,password} = req.body;
    try{

        const [checkMail] = await pool.execute(`SELECT email FROM user WHERE email=?`,[email])

        if(checkMail.length>0){
            return res.status(404).json({
                EC:1,
                message:'This email has been used'
            })
        }

        // tạo mã ngẫu nhiên có 6 chữ số
    const code = Math.floor(100000 +Math.random()*900000)
    //thời hạn sử dụng code 5 phút , chuyển sang kiểu bigint để có thể dễ so sánh
    const expired_at = Date.now()+5*60*1000;

    const [existing] = await pool.execute(`SELECT * FROM email_verfication WHERE email =?`,[email])

    //nếu tài khoản đó đã có sẳn thì update code mới
    if(existing.length >0){
        await pool.execute(`UPDATE email_verfication SET code =? ,expired_at =? ,updated_at =CURRENT_TIMESTAMP WHERE email =?`,
            [code,expired_at,email]
        )
    }else{
        await pool.execute(`INSERT INTO email_verfication (email,password,username,code,expired_at) VALUES (?,?,?,?,?)`,
                [email,password,username,code,expired_at]
            )
    }

    await sendMail(email ,"Your confirm code account",`Your confirm code is :${code}`);


        res.status(200).json({
            EC:0, // error code =0 là success , khác 0 là lỗi
            message:'We have send the code to confirm, please check your email ',
            });
    }catch(err){
        console.error(err);
        res.status(500).json({
            EC:1,
            error:'Something Wrong '})
    }
}) 

router.post('/resend-code-register',async(req,res) =>{
    const {email} = req.body;
    try{

        const [checkMail] = await pool.execute(`SELECT email FROM user WHERE email=?`,[email])

        if(checkMail.length>0){
            return res.status(404).json({
                EC:1,
                message:'This email has been used'
            })
        }

        // tạo mã ngẫu nhiên có 6 chữ số
    const code = Math.floor(100000 +Math.random()*900000)
    //thời hạn sử dụng code 5 phút , chuyển sang kiểu bigint để có thể dễ so sánh
    const expired_at = Date.now()+5*60*1000;

    const [existing] = await pool.execute(`SELECT * FROM email_verfication WHERE email =?`,[email])

    //nếu tài khoản đó đã có sẳn thì update code mới
    if(existing.length >0){
        await pool.execute(`UPDATE email_verfication SET code =? ,expired_at =? ,updated_at =CURRENT_TIMESTAMP WHERE email =?`,
            [code,expired_at,email]
        )
    }

    await sendMail(email ,"Your confirm code account",`Your confirm code is :${code}`);


        res.status(200).json({
            EC:0, // error code =0 là success , khác 0 là lỗi
            message:'We have send the code to confirm, please check your email ',
            });
    }catch(err){
        console.error(err);
        res.status(500).json({
            EC:1,
            error:'Something Wrong '})
    }
}) 


router.post('/confirm-code-register' ,async(req,res) =>{
    const {code ,email} = req.body

    const connection = await pool.getConnection()

    try{
        await connection.beginTransaction(); // bắt đầu transaction
    
    const [row] = await pool.execute(`SELECT * FROM email_verfication WHERE code =? AND email=?`,[code,email])

    //existing là mảng nên là phải sử dụng .length để ktra
    if(row.length ===0){
        await connection.rollback();
            connection.release();
         return res.status(200).json({EC:1,message:"Code Invalid"})
    }

    const record =row[0];

    if(record.expired_at < Date.now()){
        await connection.rollback();
            connection.release();
        return res.status(200).json({EC:1,message:"Code has expired"})
    }

    const username =row[0].username
    const password =row[0].password

    await connection.execute(`INSERT INTO user(email,password,username) VALUES(?,?,?)`,[email,username,password])

    await connection.execute(`DELETE FROM email_verfication WHERE email =?`,[email])

    await connection.commit();
        connection.release();

    return res.status(200).json({EC:0,message:"Verification Code Successful"})
    }catch(err){
        await connection.rollback();
        connection.release();
        console.error(err);
        return res.status(500).json({ EC: 2, message: "Something Wrong" });
    }
    }
)


// Đăng Nhập
router.post('/login',async(req,res) =>{
    const {email,password} = req.body;
    try{
        const [result] = await pool.execute(
            'SELECT * FROM user WHERE email = ? AND password =?',[email, password]
        );

        if(result.length===0){
           return res.status(404).json
           ({
                EC:2,
                message: 'Invailid Email or Password'
           }) 
        }

        const user =result[0];  // gán user là kết quả đầu tiên
        // tạo access và refreshToken để lưu trữ lại thông tin người dùng 
        const accessToken =jwt.sign({id:user.id ,email:user.email ,role:user.role,login_type:user.login_type},'yourAccessSecret',{expiresIn:'15m'});
        const refreshToken =jwt.sign({id:user.id},'yourRefreshSecret',{expiresIn:'7d'});


        res.status(200).json({
            EC:0, // error code =0 là success , khác 0 là lỗi
            message:'Login Success',
            DT:{
                id:user.id,
                access_token:accessToken,
                refresh_token:refreshToken,
                username:user.username,
                email:user.email,
                role:user.role,
                login_type:user.login_type

            }
        });
    }catch(err){
        console.error(err);
        res.status(500).json({
            EC:1,
            error:'Something Wrong '})
    }
}) 

//đăng nhập google account
router.post('/login-google',async(req,res) =>{
    const {email,username} = req.body;
        if(!email){
            return res.status(404).json({
                EC:1,
                message:"Invailid Login Google"
            })
        }
    try{
        const [existing] = await pool.execute(
            'SELECT * FROM user WHERE email = ?',[email]
        );

       // gán user là kết quả đầu tiên
        let user =existing[0];
        if(!user){
            await pool.execute(`INSERT INTO user (email,password,username,login_type) VALUES (?,?,?,?)`,[email,null,username,'google']);

            // trả lại thông tin user đã được thêm , gán giá trị đầu cho user
            const [newUser] = await pool.execute(`SELECT * from user WHERE email =?`,[email])
            user= newUser[0]
        }

        

        // tạo access và refreshToken để lưu trữ lại thông tin người dùng 
        const accessToken =jwt.sign({id:user.id ,email:user.email ,role:user.role},'yourAccessSecret',{expiresIn:'15m'});
        const refreshToken =jwt.sign({id:user.id},'yourRefreshSecret',{expiresIn:'7d'});


        res.status(200).json({
            EC:0, // error code =0 là success , khác 0 là lỗi
            message:'Login Success',
            DT:{
                id:user.id,
                access_token:accessToken,
                refresh_token:refreshToken,
                username:user.username,
                email:user.email,
                role:user.role,
                login_type:user.login_type
            }
        });
    }catch(err){
        console.error(err);
        res.status(500).json({
            EC:1,
            error:'Something Wrong '})
    }
}) 

router.post('/send-reset-password-code' ,async(req,res) =>{
    const {email} = req.body;
    // kiểm tra gmail đó có tồn tại trong gmail của database user ko
    const [rows] = await pool.execute(`SELECT * FROM user WHERE email =?`,[email])

    if(rows.length ===0){
        return res.status(400).json({EC:1 , message:"Email Not Found"})
    }
    // tạo mã ngẫu nhiên có 6 chữ số
    const code = Math.floor(100000 +Math.random()*900000)
    //thời hạn sử dụng code 5 phút , chuyển sang kiểu bigint để có thể dễ so sánh
    const expired_at = Date.now()+5*60*1000;

    const [existing] = await pool.execute(`SELECT * FROM password_reset WHERE email =?`,[email])

    //nếu tài khoản đó đã có sẳn thì update code mới
    if(existing.length >0){
        await pool.execute(`UPDATE password_reset SET code =? ,expired_at =? ,updated_at =CURRENT_TIMESTAMP WHERE email =?`,
            [code,expired_at,email]
        )
    }else{
        await pool.execute(`INSERT INTO password_reset (email,code,expired_at) VALUES (?,?,?)`,
                [email,code,expired_at]
            )
    }

    await sendMail(email ,"Your resert code",`Your resert code is :${code}`);

    return res.status(200).json({EC:0 ,message:"code sent to email"})
})

router.post('/confirm-code-reset' ,async(req,res) =>{
    const {code ,email} = req.body
    
    const [row] = await pool.execute(`SELECT * FROM password_reset WHERE code =? AND email=?`,[code,email])

    //existing là mảng nên là phải sử dụng .length để ktra
    if(row.length ===0){
         return res.status(200).json({EC:1,message:"Code Invalid"})
        
    }

    const record =row[0];

    if(record.expired_at < Date.now()){
        return res.status(200).json({EC:1,message:"Code has expired"})
    }

    return res.status(200).json({EC:0,message:"Verification Code successful"})
})

router.put('/new-password' ,async(req,res) =>{
    const {password,email} = req.body
    console.log("password",password ,"email",email )
    
    try{
    const [result] = await pool.execute(`UPDATE user set password =? WHERE email=?`,
        [password,email])
         res.status(200).json({
            EC:0,
            message:'Update Your Password Success ',
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

export default router