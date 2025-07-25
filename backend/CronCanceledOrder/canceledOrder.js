import pool from '../connectDB.js';
import cron from 'node-cron'

// gửi email
cron.schedule('*/15 * * * *',async()=>{
    console.log("Back Product To Inventory")

const connection =await pool.getConnection(); 

try{
    await connection.beginTransaction()

    // lấy order quá thời gian cho phép
    const [orderNotPayment] = await connection.execute(`
        SELECT order_id FROM order_customer WHERE payment_status = 'unpaid' AND payment_method ='banking'
        AND TIMESTAMPDIFF(MINUTE,order_date,NOW())>15
        `)
        console.log("order not payment" ,orderNotPayment)

        // là mảng nên phải có .length
    if(orderNotPayment.length ===0){
        console.log("Order not found to clear")
        await connection.commit();
        return
    }
    
    // lấy sản phẩm của giỏ hàng ra để trả lại cho kho
    for(let order of orderNotPayment){
        const order_id= order.order_id

        const [itemOrderNotPayment] = await connection.execute(`
            SELECT product_id,size_id,quantity FROM order_detail WHERE order_id= ?
            `,[order_id])

        console.log("sản phẩm trong cart",itemOrderNotPayment)

        for(let item of itemOrderNotPayment ){
            await connection.execute(`
                UPDATE inventory SET quantity = quantity + ? WHERE product_id=? AND size_id=?
                `,[item.quantity,item.product_id,item.size_id])
        }

        //xóa luôn những đơn hàng bank mà ko thanh toán
        await connection.execute(`DELETE FROM order_detail WHERE order_id =?`,[order_id])
        await connection.execute(`DELETE FROM order_customer WHERE order_id=?`,[order_id])

        await connection.commit();

    }
    
}catch(err){
    // do chạy ko cần cho fontend nên chỉ cẩn báo log là xong
    console.log("Cart Refresh Fail",err);
    await connection.rollback();   
    }
})