import express from 'express';
import cors from 'cors';
const router = express.Router();
import pool from '../connectDB.js';
import axios from 'axios';
import crypto from 'crypto'
import { json } from 'stream/consumers';

router.use(express.json());
router.use(express.urlencoded({extended:true}))

router.post("/payment",async(req,res) =>{
    
    const {total,user_id, order_id,cart_id} = req.body;
    console.log("total :",total ,"user_id :" ,user_id,"order_id ",order_id,"cart_id",cart_id)
    
    var accessKey = 'F8BBA842ECF85';
    var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    var orderInfo = 'pay with MoMo';
    var partnerCode = 'MOMO';
    var redirectUrl = 'https://f7c2-2402-800-63a6-f40d-f049-4166-16de-ed65.ngrok-free.app/momo-return';
    var ipnUrl = 'https://0284-2402-800-63a6-f40d-f049-4166-16de-ed65.ngrok-free.app/api/v1/momo/callback';
    var requestType = "payWithMethod";
    var amount = total;
    var orderId = partnerCode + new Date().getTime();
    var requestId = orderId;
    var extraData =Buffer.from(JSON.stringify({user_id ,order_id,cart_id})).toString('base64');
    var orderGroupId ='';
    var autoCapture =true;
    var lang = 'vi';

    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
    //puts raw signature
    console.log("--------------------RAW SIGNATURE----------------")
    console.log(rawSignature)
    //signature
    var signature = crypto.createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');
    console.log("--------------------SIGNATURE----------------")
    console.log(signature)

    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
        partnerCode : partnerCode,
        partnerName : "Test",
        storeId : "MomoTestStore",
        requestId : requestId,
        amount : amount,
        orderId : orderId,
        orderInfo : orderInfo,
        redirectUrl : redirectUrl,
        ipnUrl : ipnUrl,
        lang : lang,
        requestType: requestType,
        autoCapture: autoCapture,
        extraData : extraData,
        orderGroupId: orderGroupId,
        signature : signature
    });
    //axios

    const option ={
        method: "POST",
        url: "https://test-payment.momo.vn/v2/gateway/api/create",
        headers :{
            'Content-Type': 'application/json',
        },
        data:requestBody
    }

    let result;
    try{
        result = await axios(option);
        return res.status(200).json(result.data);
    }catch(error){
         console.error("MoMo error:", error?.response?.data || error.message);
    return res.status(500).json({
        statusCode:500,
        message: "MoMo request failed",
        error: error?.response?.data || error.message
    });
    }
})

router.post("/callback",async(req,res) =>{
    console.log(req.body);
     const {resultCode ,extraData} = req.body

     if(resultCode ===0){
        // giải mã về chuỗi bth
        const decode =Buffer.from(extraData,'base64').toString('utf-8')
        const {order_id ,cart_id}=JSON.parse(decode);
        const connection = await pool.getConnection()
       
        console.log("cart_id",cart_id,"order id" ,order_id)
        try{
            await connection.beginTransaction()

             await connection.query(`UPDATE order_customer SET payment_status="paid" WHERE order_id= ? `,
            [order_id])

            // xóa cart_detail khi đã trả về callback thanh toán thành công
            await connection.query(`DELETE FROM cart_detail WHERE cart_id =?`,[cart_id])

            await connection.commit()
            return res.status(200).json({message:"Callback Recived"});
        }catch(err){    
            console.log("Update Failed")
            await connection.rollback()
            return res.status(500).json({message:'server error'})
        } finally{
            connection.release();
        }
     }else{
        return res.status(400).json({message:"Payment failed or canceled"})
     }
    
})
export default router