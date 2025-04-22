import express from 'express'
import cors from 'cors'
import userRoute from './route/userRoute.js'

const app = express();
const PORT =8081;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true }));

//khai báo route 
app.use('/api/v1/user' , userRoute)

//chạy server
app.listen(PORT ,()=>{
    console.log(`Server Running On http://localhost:${PORT}`);
})