import express, { response } from 'express';
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
                       text: `Phân loại intent của câu : "${message}". Chỉ trả về 1 từ trong:check_stock_size,ask_price,check_stock_shoes,check_status_order,orther,greeting`
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
                case "check_status_order":
                    reply = await handleCheckStatusOrder(message)
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
        console.log("Gemini Error",err)
        res.status(500).json({
            reply:"Error when call Gemini"
        })
    }
})

//hàm truy vấn 

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
                       text:   `Từ câu: "${message}", trích xuất tất cả các **tên sản phẩm cụ thể** nếu có ,bao gồm cả tên hãng , dòng sản phẩm , mô tả màu sắc , phiên bản đặc biệt của đôi giày đó
                                 ví dụ: Nike, Adidas Ultra Boost, Jordan,Nike SB Dunk Green Swoosh,Adidas Ultra Boost 2023 White,Jordan 1 Retro High OG Bred,...  
                                Chỉ trả về danh sách tên sản phẩm, cách nhau bằng dấu phẩy.  
                                Nếu trong câu **không có tên cụ thể**, chỉ trả về chuỗi rỗng chứ không phải là chữ chuỗi rỗng.
                                Không coi từ chung chung như "giày", "shoes", "đôi", "sneaker" là tên sản phẩm.
                                KHÔNG được dùng HTML hoặc bất kỳ ký hiệu định dạng như <br>, <b>, \n, v.v.
                                Không giải thích.`
                    }]
                }]
            })
    const productListText = (await shoesBrandFind.response.text()).trim();
    if (productListText[0]=== "" ||productListText === '""' || productListText === '' || productListText === "''") {
    return "What shoes do you want to know the price ?";
    }
            //tách mảng thành tên sản phẩm
    const productName =productListText.split(','). //tách chuỗi bằng dấu phẩy
                                      map(p=>p.trim()). // xóa khoảng trắng
                                      filter(product => product !== "") // loại bỏ chuỗi trỗng
    console.log("product name AI response", productName)

    if(productName.length === 0){
        return "What shoes do you want to know the price ?"
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
         result.push (` ${product} out of stock , we will update soon ^^`)
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
                       text:    `Từ câu: "${message}", trích xuất tất cả các **tên sản phẩm cụ thể** nếu có ,bao gồm cả tên hãng , dòng sản phẩm , mô tả màu sắc , phiên bản đặc biệt của đôi giày đó
                                 ví dụ: Nike, Adidas Ultra Boost, Jordan,Nike SB Dunk Green Swoosh,Adidas Ultra Boost 2023 White,Jordan 1 Retro High OG Bred,...  
                                Chỉ trả về danh sách tên sản phẩm, cách nhau bằng dấu phẩy.  
                                Nếu trong câu **không có tên cụ thể**, chỉ trả về chuỗi rỗng chứ không phải là chữ chuỗi rỗng.
                                Không coi từ chung chung như "giày", "shoes", "đôi", "sneaker" là tên sản phẩm.
                                KHÔNG được dùng HTML hoặc bất kỳ ký hiệu định dạng như <br>, <b>, \n, v.v.
                                Không giải thích.`
                    }]
                }]
            })
    const productListText = (await shoesBrandFind.response.text()).trim();
    if(productListText.length === 0 || productListText[0]==="" || productListText === ''|| productListText === "" || productListText==='"'){
        return "What shoes are you looking for ?"
    }
            //tách mảng thành tên sản phẩm
    const productName =productListText.split(',').map(p=>p.trim())
    console.log("product name",productName)

    

   
    let response =[];

        for(const product of productName){
            const [row]= await pool.execute(
        `SELECT * FROM product WHERE name =?`,[product]
        )
    
    if(row.length>0){
        response.push(`We still have ${product}`)
    }else{
        response.push(`We out of stock ${product} ,we will update soon`)
    }
     
}
    // thay thế dấu , thành end
    return response.join(', and ')
}

const handleCheckStatusOrder =async(message) =>{
    const model =  genAI.getGenerativeModel({
                model:'gemini-1.5-flash'
            });
    const orderIDFind = await model.generateContent({
                contents:[{
                    role:"user" ,
                    parts:[{
                       text: `Từ câu: "${message}", , hãy trích xuất tất cả các số id đơn hàng, chỉ trả về các số, ngăn cách bằng dấu phẩy, không thêm từ ngữ nào khác, nếu không có thì trả về chuỗi rỗng , không giải thích thêm hay gì cả `
                    }]
                }]
            })
    const orderList = (await orderIDFind.response.text()).trim();
            //tách mảng thành tên sản phẩm
    const orderId =orderList.
            split(',').
            map(p=>p.trim()).
            filter(id => id !== "" && !isNaN(id))
    console.log('order ID' ,orderId)

    if(orderId.length === 0){
        return "Can you send your order id to let we check it ?"
    }

    let response =[]
        for(const orderNumber of orderId){
            const [row]= await pool.execute(
        `SELECT status FROM order_customer WHERE order_id =?`,[orderNumber]
        )
     
    
    if(row.length >0){
        const status =row[0].status
        response.push(`Your order id ${orderNumber} is ${status} `)
    }else{
         response.push(`Sorry i not seen your order id ${orderNumber} in my data , check your order ID again please ^^`)
    }
}

    return response.join(', and ')

}

export default router