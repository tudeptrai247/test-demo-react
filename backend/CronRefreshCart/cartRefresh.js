import pool from '../connectDB.js';
import cron from 'node-cron'

// xóa trong 60 phút
cron.schedule('*/60 * * * *',async()=>{
    console.log("Refresh Cart")

const connection =await pool.getConnection(); 

try{
    await connection.beginTransaction()

    // lấy giỏ hàng quá thời gian cho phép
    const [cartNotPayment] = await connection.execute(`
        SELECT cart_id FROM cart WHERE status = 'pending' 
        AND TIMESTAMPDIFF(MINUTE,created_at,NOW())>60
        `)
        console.log("id cart" ,cartNotPayment)

        // là mảng nên phải có .length
    if(cartNotPayment.length ===0){
        console.log("Cart Not Found To Clear")
        await connection.commit();
        return
    }

    // lấy sản phẩm của giỏ hàng ra để trả lại cho kho
    for(let cart of cartNotPayment){
        const cart_id = cart.cart_id

        const [itemCartNotPayment] = await connection.execute(`
            SELECT product_id,size_id,quantity FROM cart_detail WHERE cart_id= ?
            `,[cart_id])

        console.log("sản phẩm trong cart",itemCartNotPayment)


        for(let item of itemCartNotPayment ){
            await connection.execute(`
                UPDATE inventory SET quantity = quantity + ? WHERE product_id=? AND size_id=?
                `,[item.quantity,item.product_id,item.size_id])
        }

        // xóa giỏ hàng sau khi tới thời gian đã hẹn ( vẫn phải trong for)

        await connection.execute(`DELETE FROM cart_detail WHERE cart_id =?`,[cart_id])
        await connection.execute(`DELETE FROM cart WHERE cart_id=?`,[cart_id])

        console.log("Delete cart id",cart_id)

        await connection.commit();

    }
    
}catch(err){
    // do chạy ko cần cho fontend nên chỉ cẩn báo log là xong
    console.log("Cart Refresh Fail",err);
    await connection.rollback();   
    }
})