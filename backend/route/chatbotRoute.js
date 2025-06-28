import express from 'express';
const router = express.Router();
import genAI from '../ConfigGemini/gemini.js';
import pool from '../connectDB.js';

console.log("api key",process.env.GEMINI_API_KEY);

router.post('/',async (req ,res) =>{
    const {message} = req.body;

    try{
            const model =  genAI.getGenerativeModel({
                model:'gemini-1.5-flash'
            });
                //gửi nội dung đến gemini , phân loại intent của message
            const intentFind = await model.generateContent({
                contents:[{
                    role:"user" ,
                    parts:[{
                       text: `Phân loại intent của câu : "${message}". Chỉ trả về 1 từ trong:check_stock_size,ask_price,check_stock_shoes,orther,greeting`
                    }]
                }]
            })
            //trim để xóa khoảng trắng khi so sánh tìm cho dễ
            const intent = (await intentFind.response.text()).trim();
            console.log("INTENT :",intent);

            let reply ="";

            switch(intent){
                case "check_stock_size":
                    reply = await handleCheckStockSize(message);
                    break
                case "ask_price":
                    reply = await handleAskPrice(message)
                    break
                case "check_stock_shoes":
                    reply = await handleCheckStockShoes(message)
                    break

                default:
                    const result =await model.generateContent({
                       contents:[{
                                    role:"user" ,
                                    parts:[{ text:message }]
                                }]
                    });
                    //reply đã là 1 chuỗi text phản hồi từ gemini
                    reply = await result.response.text();
            }

            res.json({
                reply
            })

    }catch(err){
        console.log("Gemini Error",err.message)
        res.status(500).json({
            reply:"Error when call Gemini"
        })
    }
})

//hàm truy vấn tìm sản phẩm trong message

const handleCheckStockSize =async(message) =>{
                // tìm cụm size số  (\d+) để bắt số phía sau chữ size còn i thì ko phân biệt chữ hoa hay thường regex sẽ bắt chữ size 43 (\d+) sẽ bắt mỗi số 43
    const sizeMatch =message.match(/size\s?(\d+)/i)
    const size =sizeMatch ? parseInt(sizeMatch[1]):null;

    if(!size)
        return "What Size Do You Want To Looking For"

    const [row] = await pool.execute(
        `SELECT product.name  FROM inventory 
        JOIN product ON inventory.product_id = product.id
        JOIN size on inventory.size_id =size.id 
        WHERE size.size = ? AND inventory.quantity >0 `,
        [size]
    );

    if(row.length === 0){
        return `size ${size} out of stock , no have product with size ${size}`
    }
        //vòng lặp lấy ra sản phẩm của product , join để gộp các phần tử trong 1 mảng thành chuỗi
    const product = row.map(p=>p.name).join(', ');

    return `Product ${product} have size ${size}`
}

//hàm hỏi giá của sản phẩm
const handleAskPrice =async(message) =>{

    const model =  genAI.getGenerativeModel({
                model:'gemini-1.5-flash'
            });
    const shoesBrandFind = await model.generateContent({
                contents:[{
                    role:"user" ,
                    parts:[{
                       text: `Từ câu: "${message}", Hãy trích xuất tất cả các tên sản phẩm rõ ràng trong câu đó , chỉ trả về tên sản phẩm và chuỗi cách nhau bằng dấu phẩy , không giải thích`
                    }]
                }]
            })
    const productListText = (await shoesBrandFind.response.text()).trim();
            //tách mảng thành tên sản phẩm
    const productName =productListText.split(',').map(p=>p.trim())

    if(!productName.length === 0){
        return "What shoes are you looking for ?"
    }

    let result =[]
        for(const product of productName){
            const [row]= await pool.execute(
        `SELECT price FROM product WHERE name =?`,[product]
        )
    
    if(row.length >0){
        const price =parseFloat(row[0].price);
        const formatPrice =price.toLocaleString('vi-VN',{
            style:'currency',
            currency:'VND',
            maximumFractionDigits:0 //loại bỏ số 0 sau số thập phân
        })
        result.push(`The ${product} is ${formatPrice}`)
    }else{
         return ` ${product} out of stock , we will update soon ^^`
    }
}

    return result.join(', and ')
}

const handleCheckStockShoes =async(message)=>{
    const model =  genAI.getGenerativeModel({
                model:'gemini-1.5-flash'
            });
    const shoesBrandFind = await model.generateContent({
                contents:[{
                    role:"user" ,
                    parts:[{
                       text: `Từ câu: "${message}", Hãy trích xuất tất cả các tên sản phẩm rõ ràng trong câu đó , chỉ trả về tên sản phẩm và chuỗi cách nhau bằng dấu phẩy , không giải thích`
                    }]
                }]
            })
    const productListText = (await shoesBrandFind.response.text()).trim();
            //tách mảng thành tên sản phẩm
    const productName =productListText.split(',').map(p=>p.trim())

    if(!productName.length === 0){
        return "What shoes are you looking for ?"
    }

    let result =[]
        for(const product of productName){
            const [row]= await pool.execute(
        `SELECT * FROM product WHERE name =?`,[product]
        )
    
    if(row.length >0){
        result.push(`Yes , We have ${product}`)
    }else{
         return ` ${product} out of stock , we will update soon ^^`
    }
}

    return result.join(', and ')
}

export default router