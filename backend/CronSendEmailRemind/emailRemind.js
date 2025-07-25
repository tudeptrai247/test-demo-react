import pool from '../connectDB.js';
import cron from 'node-cron'
import { sendMail } from '../emailService.js';

//gửi email trong 
cron.schedule('*0 9 * * *',async()=>{
    console.log("Email Remind Sent")

const connection =await pool.getConnection(); 

try{
    await connection.beginTransaction()

    const [emailUser] = await connection.execute(`
        SELECT user.email, user.username FROM cart
        JOIN cart_detail ON cart_detail.cart_id = cart.cart_id 
        JOIN user ON cart.user_id = user.id
        WHERE TIMESTAMPDIFF(HOUR,cart.updated_at,NOW())>24
        `)
    if(emailUser.length ===0){
        console.log("User not found ")
        return
    }
    for(const user of emailUser){

    const email =user.email
    const username =user.username

    await sendMail(email,`Hello ${username},It seem you forgot some items in your cart right? Go check out now !!!`)
    
    }

    await connection.commit();

    
    
}catch(err){
    // do chạy ko cần cho fontend nên chỉ cẩn báo log là xong
    console.log("Cart Refresh Fail",err);
    await connection.rollback();   
    }
})