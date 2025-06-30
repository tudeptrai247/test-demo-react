import express from 'express';
import cors from 'cors';
import userRoute from './route/userRoute.js';
import authRoute from './route/authRoute.js';
import supplierRoute from './route/supplierRoute.js';
import sizeRoute from './route/sizeRoute.js';
import brandRoute from './route/brandRoute.js';
import categoryRoute from './route/categoryRoute.js';
import productRoute from './route/productRoute.js';
import receiptRoute from './route/receiptRoute.js';
import restoreReceiptRoute from './route/restoreReceiptRoute.js'
import inventoryRoute from './route/inventoryRoute.js'
import cartRoute from './route/cartRoute.js'
import orderRoute from './route/orderRoute.js'
import momoRoute from './route/momoRoute.js'
import dashboardRoute from './route/dashboardRoute.js'
import chatbotRouter from './route/chatbotRoute.js'

import dotenv from 'dotenv'
dotenv.config();


import path from 'path'
import { fileURLToPath } from 'url';

//đọc file trong .env sau đó gắn vào process.env vd như process.env.API_KEY === "123"

const app = express();
const PORT =8081;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true }));

//khai báo route 
app.use('/api/v1/user' , userRoute)
app.use('/api/v1/auth' , authRoute)
app.use('/api/v1/supplier' , supplierRoute)
app.use('/api/v1/size' , sizeRoute)
app.use('/api/v1/brand' , brandRoute)
app.use('/api/v1/category' , categoryRoute)
app.use('/api/v1/product' , productRoute)
app.use('/api/v1/receipt' , receiptRoute)
app.use('/api/v1/restorereceipt' , restoreReceiptRoute)
app.use('/api/v1/inventory' , inventoryRoute)
app.use('/api/v1/cart' , cartRoute)
app.use('/api/v1/order',orderRoute)
app.use('/api/v1/momo',momoRoute)
app.use('/api/v1/dashboard',dashboardRoute)
app.use('/api/v1/chatbot',chatbotRouter)


// đưa thư mục uploads để public trên host
const __dirname=path.resolve()
app.use('/uploads',express.static(path.join(__dirname,'uploads')));

//import để refresh lại giỏ hàng sau thời gian cố định
import './CronRefreshCart/cartRefresh.js'

//chạy server
app.listen(PORT ,()=>{
    console.log(`Server Running On http://localhost:${PORT}`);
})