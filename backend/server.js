import express from 'express';
import cors from 'cors';
import userRoute from './route/userRoute.js';
import authRoute from './route/authRoute.js';
import supplierRoute from './route/supplierRoute.js';
import sizeRoute from './route/sizeRoute.js';
import brandRoute from './route/brandRoute.js'
import categoryRoute from './route/categoryRoute.js'

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


//chạy server
app.listen(PORT ,()=>{
    console.log(`Server Running On http://localhost:${PORT}`);
})