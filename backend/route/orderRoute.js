import express from 'express';
import cors from 'cors';
const router = express.Router();
import pool from '../connectDB.js';
import _ from 'lodash';

router.post('/',async(req,res) =>{
    const {address,number,payment_method,total,note,user_id,item} =req.body

    const connection =await pool.getConnection(); // chạy nhiều câu truy vấn cần transaction phải tạo 1 connect chạy 1 lần

    try{
        await connection.beginTransaction(); // bắt đầu transaction

        // biến này chứa những sản phẩm bị hết hàng khi khách hàng nhấn thanh toán
        const outOfStockProductCheck =[];

        for(const product of item){

        // phải có for update để khóa lại tránh xung đột giữa 2 người cùng đặt mua
        const [checkQuantity]= await connection.execute(`SELECT product.name, inventory.quantity FROM inventory
            JOIN product ON inventory.product_id = product.id
             WHERE product_id =? AND size_id =?
             FOR UPDATE
             `,[product.product_id, product.size_id])

             if(checkQuantity.length ===0 || product.quantity > checkQuantity[0].quantity)
             {
                const productName = checkQuantity.length >0 ? checkQuantity[0].name : "Unknow";
                outOfStockProductCheck.push(productName)
             }
        }

        if(outOfStockProductCheck.length >0){
            await connection.rollback();
            connection.release()
            return res.status(400).json({
            EC:3,
            message:`These products are not enough in inventory : ${outOfStockProductCheck}`
            })
        }

        const [result] = await connection.execute(`INSERT INTO order_customer (address,number,payment_method,total,note,user_id	) VALUES (?,?,?,?,?,?)`,
        [address,number,payment_method,total,note,user_id]
        ); 

        const order_id = result.insertId;

        for(const product of item){
            // kiểm tra data để vào order_detail
            console.log('detail product add to order_detail',{
                quantity :product.quantity,
                order_id : order_id,
                product_id: product.product_id,
                size_id: product.size_id
            })

            await connection.execute(`INSERT INTO order_detail(quantity, order_id, product_id, size_id) VALUES (?,?,?,?)`,
                [product.quantity,order_id,product.product_id,product.size_id]
            );

            // update trừ sp ở kho luôn để tránh người dùng sau mua
             const [updateInventory] = await connection.execute(`
                UPDATE inventory SET quantity = quantity -? WHERE product_id =? AND size_id=?`,
                [product.quantity,product.product_id,product.size_id])

            if(payment_method ==='cod'){
               
                if(updateInventory.affectedRows === 0){
                    throw new Error(`Out of stock for product ${product.product_id} size ${product.size_id}`)
                }
            await connection.execute("DELETE FROM cart_detail WHERE product_id =? AND size_id =?",
            [product.product_id,product.size_id]
        );
        }

        }   

        await connection.commit();

        res.status(200).json({
            EC:0,
            message:'Order Success',
            orderId :order_id
        })
    }catch(err){
        await connection.rollback();
        console.log(err);
        res.status(500).json({
            EC:1,
            error:'Something Wrong , rollback transaction'
        })
    }finally{
        connection.release();
    }
})
// lấy đơn hàng ở user ko có nhưng đơn hàng đã cancel
router.get('/',async(req,res) =>{
    const {user_id} =req.query
    
    // lấy giá trị page và limit từ querry trên URL , nếu ko có tham số truyền vào mặc định sẽ là 1 và 3
    let page =+req.query.page || 1; //ép kiểu string sang number
    let limit =+req.query.limit || 3;
    let offset = (page -1) * limit ; // vị trí bắt đầu khi lấy dũ liệu , vd trang 1 -1 =0 *3 =0 lấy vị trị 0

    try {
        const [countRow] = await pool.execute(`SELECT COUNT(*) as count FROM order_customer WHERE user_id=?
            AND( 
                (payment_method ='cod' AND payment_status='unpaid')
                OR
                (payment_method ='banking' AND payment_status='paid')
            ) AND status != "canceled"`,[user_id]); // đếm tổng số receipt , countRow là 1 mảng
        const totalOrder = countRow[0].count; //lấy ra tổng số size , dùng để tính phân trang
        const totalPages =Math.ceil(totalOrder/limit)

        //phải tách ra 2 bước , 1 bước lấy id đơn hàng đó và 1 bước lấy chi tiết sản phẩm của đơn hàng đó

        //lấy danh sách theo order_id truy vấn
        const [orderIdRow] = await pool.query(`SELECT order_id FROM order_customer 
            WHERE user_id=?
             AND( 
                (payment_method ='cod' AND payment_status='unpaid')
                OR
                (payment_method ='banking' AND payment_status='paid')
            ) AND status !="canceled"
            ORDER BY order_date DESC
            LIMIT ? OFFSET ?`,
        [user_id,limit,offset])

        //chuyển mảng object thành số vd [43,42,44]
        const orderId =orderIdRow.map(row =>row.order_id)

        // nếu ko có đơn nào trả về rỗng
        if(orderId.length ===0){
            return res.status(200).json({
                EC:0,
                DT:{
                    orderCustomer:[],
                    totalPages
                }
            })
        }

            // lấy chi tiết đơn hàng và sản phẩm và size
        const [rows] =await pool.query(`
            SELECT order_customer.order_id ,order_customer.address ,order_customer.number,order_customer.status,order_customer.order_date,order_customer.total,order_customer.note,order_customer.payment_method,
            order_detail.quantity ,order_detail.order_id ,order_detail.product_id,product.name as name_product , product.price as price_product ,order_detail.size_id ,size.size as size
            FROM order_customer 
            JOIN order_detail ON order_customer.order_id = order_detail.order_id 
            JOIN product ON order_detail.product_id =product.id
            JOIN size ON order_detail.size_id = size.id
            WHERE order_customer.order_id IN (?)
            `,[orderId])

            //sử dụng group by gom sản phẩm theo order id
            const group=_.groupBy(rows,'order_id');

            const finalOrder=Object.keys(group).map(orderId=>{ //
                const item =group[orderId]; //danh sách sản phẩm , size thuộc orderId đó
                const first= item[0]; //lấy thông tin của đơn hàng 

                const product= item.map(item =>({  //lấy mảng product để gộp lên cho mảng cha 
                    product_id:item.product_id,
                    name_product:item.name_product,
                    size_id:item.size_id,
                    size:item.size,
                    quantity:item.quantity,
                    price :item.price_product
                }));

                return{
                    order_id :first.order_id,
                    address :first.address,
                    number :first.number,
                    status :first.status,
                    order_date :first.order_date,
                    total :first.total,
                    note :first.note,
                    payment_method :first.payment_method,
                    product
                };
            })

        res.status(200).json({
            EC:0,
            DT:{
                orderCustomer:finalOrder, //trả về danh sách order
                totalPages // trả về tổng số trang
            }
        });
    }catch(err){
        console.log(err);
        res.status(500).json({
            EC:1,
            message :'Something Wrong'
        })
    }
})

// xóa order nếu vẫn còn đang processing

router.delete('/:id',async(req,res) =>{
    const orderId = req.params.id;
    console.log(orderId)

    const connection = await pool.getConnection()
    try{

        await connection.beginTransaction();

        //check trạng thái đơn , for updated để khóa lại xử lý xong thì request khác mới đc xử lý            
        const [orderRow] = await connection.execute(`SELECT status FROM order_customer 
            WHERE order_id =? FOR UPDATE`,[orderId])

        const status = orderRow[0].status

        if(status != "processing"){
            return res.status(400).json({ EC:1 , message:"Only Processing can delete order"})
        }

        // lấy chi tiết sản phẩm của đơn hàng đó ra
        const [orderDetail] = await connection.execute(`SELECT * from order_detail WHERE order_id=?`,
            [orderId]
        )
        
        // hoàn sản phẩm vào tồn kho
        for(const item of orderDetail){
            console.log(item.quantity ,item.product_id ,item.size_id)
            await connection.execute(`UPDATE inventory SET quantity = quantity +? WHERE product_id =? AND size_id=?`,
                [item.quantity ,item.product_id ,item.size_id]
            )
        }

        // cập nhật trạng thái lại
        await connection.execute("UPDATE order_customer SET status ='canceled' WHERE order_id=?",
            [orderId]
        )

        await connection.commit();

        res.status(200).json({
            EC:0, // error code =0 là success , khác 0 là lỗi
            message:'Delete Order Success',
            order_id:orderDetail.order_id
            });
    }catch(err){
        await connection.rollback();
        console.error(err);
        res.status(500).json({
            EC:1,
            error:'Something Wrong '})
    }finally{
        connection.release();
    }
}) 

// List order cho admin trả về tất cả các order của user
router.get('/adminOrderList',async(req,res) =>{
    // lấy giá trị page và limit từ querry trên URL , nếu ko có tham số truyền vào mặc định sẽ là 1 và 3
    let page =+req.query.page || 1; //ép kiểu string sang number
    let limit =+req.query.limit || 3;
    let offset = (page -1) * limit ; // vị trí bắt đầu khi lấy dũ liệu , vd trang 1 -1 =0 *3 =0 lấy vị trị 0

    try {
        const [countRow] = await pool.execute(`SELECT COUNT(*) as count FROM order_customer
            WHERE( 
                (payment_method ='cod' AND payment_status='unpaid')
                OR
                (payment_method ='banking' AND payment_status='paid')
            )
                AND status !="canceled"`); // đếm tổng số receipt , countRow là 1 mảng
        const totalOrder = countRow[0].count; //lấy ra tổng số size , dùng để tính phân trang
        const totalPages =Math.ceil(totalOrder/limit)

        //phải tách ra 2 bước , 1 bước lấy id đơn hàng đó và 1 bước lấy chi tiết sản phẩm của đơn hàng đó

        //lấy danh sách theo order_id truy vấn
        const [orderIdRow] = await pool.query(`SELECT order_id FROM order_customer 
             WHERE( 
                (payment_method ='cod' AND payment_status='unpaid')
                OR
                (payment_method ='banking' AND payment_status='paid')
            )
            AND status !="canceled"
            ORDER BY order_date DESC
            LIMIT ? OFFSET ?`,
        [limit,offset])

        //chuyển mảng object thành số vd [43,42,44]
        const orderId =orderIdRow.map(row =>row.order_id)

        // nếu ko có đơn nào trả về rỗng
        if(orderId.length ===0){
            return res.status(200).json({
                EC:0,
                DT:{
                    orderCustomer:[],
                    totalPages
                }
            })
        }

            // lấy sản phẩm và size của đơn hàng đdat
        const [rows] =await pool.query(`
            SELECT order_customer.order_id ,order_customer.address ,order_customer.number,order_customer.status,order_customer.order_date,order_customer.total,order_customer.note,order_customer.payment_method,order_customer.payment_status,
            order_detail.quantity ,order_detail.order_id ,order_detail.product_id,product.name as name_product , product.price as price_product ,order_detail.size_id ,size.size as size,
            user.username
            FROM order_customer 
            JOIN user ON order_customer.user_id = user.id
            JOIN order_detail ON order_customer.order_id = order_detail.order_id 
            JOIN product ON order_detail.product_id =product.id
            JOIN size ON order_detail.size_id = size.id
            
            WHERE order_customer.order_id IN (?)
            `,[orderId])

            //sử dụng group by gom sản phẩm theo order id
            const group=_.groupBy(rows,'order_id');

            const finalOrder=Object.keys(group).map(orderId=>{ //
                const item =group[orderId]; //danh sách sản phẩm , size thuộc orderId đó
                const first= item[0]; //lấy thông tin của đơn hàng 

                const product= item.map(item =>({  //lấy mảng product để gộp lên cho mảng cha 
                    product_id:item.product_id,
                    name_product:item.name_product,
                    size_id:item.size_id,
                    size:item.size,
                    quantity:item.quantity,
                    price :item.price_product
                }));

                return{
                    order_id :first.order_id,
                    username:first.username,
                    address :first.address,
                    number :first.number,
                    status :first.status,
                    order_date :first.order_date,
                    total :first.total,
                    note :first.note,
                    payment_method :first.payment_method,
                    payment_status :first.payment_status,

                    product
                };
            })

        res.status(200).json({
            EC:0,
            DT:{
                orderCustomer:finalOrder, //trả về danh sách order
                totalPages // trả về tổng số trang
            }
        });
    }catch(err){
        console.log(err);
        res.status(500).json({
            EC:1,
            message :'Something Wrong'
        })
    }
})

// đổi trạng thái giao hàng cho khách hàng
router.put('/:id',async(req,res) =>{
    const orderId = req.params.id;
    const {status} = req.body;
    try{
        const [result] = await pool.execute(
            'UPDATE order_customer set status = ? WHERE order_id =? ',[status,orderId]
        );
        res.status(200).json({
            EC:0, // error code =0 là success , khác 0 là lỗi
            message:'Status Update Success',
            id:result.order_id});
    }catch(err){
        console.error(err);
        res.status(500).json({
            EC:1,
            error:'Something Wrong '})
    }
}) 

// Lấy những order mà canceled

// List order cho admin trả về tất cả các order của user
router.get('/adminOrderListCanceled',async(req,res) =>{
    // lấy giá trị page và limit từ querry trên URL , nếu ko có tham số truyền vào mặc định sẽ là 1 và 3
    let page =+req.query.page || 1; //ép kiểu string sang number
    let limit =+req.query.limit || 3;
    let offset = (page -1) * limit ; // vị trí bắt đầu khi lấy dũ liệu , vd trang 1 -1 =0 *3 =0 lấy vị trị 0

    try {
        const [countRow] = await pool.execute(`SELECT COUNT(*) as count FROM order_customer
            WHERE( 
                (payment_method ='cod' AND payment_status='unpaid')
                OR
                (payment_method ='banking' AND payment_status='paid')
            )
                AND status ='canceled'`); // đếm tổng số receipt , countRow là 1 mảng
        const totalOrder = countRow[0].count; //lấy ra tổng số size , dùng để tính phân trang
        const totalPages =Math.ceil(totalOrder/limit)

        //phải tách ra 2 bước , 1 bước lấy id đơn hàng đó và 1 bước lấy chi tiết sản phẩm của đơn hàng đó

        //lấy danh sách theo order_id truy vấn
        const [orderIdRow] = await pool.query(`SELECT order_id FROM order_customer 
             WHERE( 
                (payment_method ='cod' AND payment_status='unpaid')
                OR
                (payment_method ='banking' AND payment_status='paid')
            )
            AND status ='canceled'
            ORDER BY order_date DESC
            LIMIT ? OFFSET ?`,
        [limit,offset])

        //chuyển mảng object thành số vd [43,42,44]
        const orderId =orderIdRow.map(row =>row.order_id)

        // nếu ko có đơn nào trả về rỗng
        if(orderId.length ===0){
            return res.status(200).json({
                EC:0,
                DT:{
                    orderCustomer:[],
                    totalPages
                }
            })
        }

            // lấy chi tiết đơn hàng và sản phẩm và size
        const [rows] =await pool.query(`
            SELECT order_customer.order_id ,order_customer.address ,order_customer.number,order_customer.status,order_customer.order_date,order_customer.total,order_customer.note,order_customer.payment_method,order_customer.payment_status,
            order_detail.quantity ,order_detail.order_id ,order_detail.product_id,product.name as name_product , product.price as price_product ,order_detail.size_id ,size.size as size,
            user.username
            FROM order_customer 
            JOIN user ON order_customer.user_id = user.id
            JOIN order_detail ON order_customer.order_id = order_detail.order_id 
            JOIN product ON order_detail.product_id =product.id
            JOIN size ON order_detail.size_id = size.id
            
            WHERE order_customer.order_id IN (?)
            `,[orderId])

            //sử dụng group by gom sản phẩm theo order id
            const group=_.groupBy(rows,'order_id');

            const finalOrder=Object.keys(group).map(orderId=>{ //
                const item =group[orderId]; //danh sách sản phẩm , size thuộc orderId đó
                const first= item[0]; //lấy thông tin của đơn hàng 

                const product= item.map(item =>({  //lấy mảng product để gộp lên cho mảng cha 
                    product_id:item.product_id,
                    name_product:item.name_product,
                    size_id:item.size_id,
                    size:item.size,
                    quantity:item.quantity,
                    price :item.price_product
                }));

                return{
                    order_id :first.order_id,
                    username:first.username,
                    address :first.address,
                    number :first.number,
                    status :first.status,
                    order_date :first.order_date,
                    total :first.total,
                    note :first.note,
                    payment_method :first.payment_method,
                    payment_status :first.payment_status,

                    product
                };
            })

        res.status(200).json({
            EC:0,
            DT:{
                orderCustomer:finalOrder, //trả về danh sách order
                totalPages // trả về tổng số trang
            }
        });
    }catch(err){
        console.log(err);
        res.status(500).json({
            EC:1,
            message :'Something Wrong'
        })
    }
})

export default router