import express from 'express';
import cors from 'cors';
const router = express.Router();
import pool from '../connectDB.js'

//thêm sản phẩm vào giỏ hàng
router.post('/',async(req,res) =>{
    const {product_id,unit_price,size_id,quantity,user_id} =req.body;

    const connection =await pool.getConnection(); 

    try{

        await connection.beginTransaction(); // bắt đầu transaction

        //Kiểm tra cart có tồn tại chưa , nếu chưa có thì tạo

        const [existCartRows] = await connection.execute(`SELECT cart_id FROM cart WHERE user_id =? AND status="unpaid"`,
            [user_id]
        );

        let cart_id; // lưu id giỏ hàng được dùng

        if(existCartRows.length>0){  //nếu trả về kết quả lớn hơn 1 thì xài cái id của giỏ hàng đó
            cart_id = existCartRows[0].cart_id
        }else{ 
            const [cart]= await connection.execute('INSERT INTO cart (user_id) VALUES (?)',
                [user_id]
            )
            cart_id = cart.insertId // lấy id của cart
        }

        // tạo 1 biến để kiểm tra số lượng sản phẩm của size và sản phẩm đó có trong giỏ hàng chưa , chưa có thì thêm 1 dòng mới , còn có rồi thì tăng số lượng ,
        //  phải kiểm tra cả cart_id để tránh ko bị lẫn giỏ hàng mới hoặc giỏ hàng cũ
        const [existItemRows] = await connection.execute(`SELECT quantity FROM cart_detail WHERE cart_id=? AND product_id=? AND size_id=? `,
            [cart_id,product_id,size_id]
        )

        const [stockRow]= await connection.execute(`SELECT quantity FROM inventory WHERE product_id=? AND size_id=?`,
            [product_id,size_id]
        )
        if(stockRow.length === 0 || stockRow[0].quantity<quantity){
            return res.status(400).json({
                EC:2,
                message:"Out Of Stock , Sorry :("
            })
        }

        if(existItemRows.length >0){
            await connection.execute(`UPDATE cart_detail SET quantity = quantity + ? WHERE cart_id=? AND product_id=? AND size_id=?`,
                [quantity,cart_id,product_id,size_id]
            )
        }else{
            await connection.execute(`INSERT INTO cart_detail (cart_id, product_id, size_id, unit_price ,quantity) VALUES (?,?,?,?,?)`,
            [cart_id,product_id,size_id,unit_price,quantity]
        );
    }

    await connection.execute('UPDATE inventory SET quantity = quantity - ? WHERE product_id=? AND size_id=?',
        [quantity,product_id,size_id]
    )

    await connection.commit()

        res.status(200).json({
            EC:0,
            message:'Cart Created Success',
            id:cart_id
        });
    }catch(err){
        await connection.rollback(); // lỗi sẽ rollback lại
        console.log("transation error" ,err)
        console.log(err);
        res.status(500).json({
            EC:1,
            error:'Something Wrong'
        })
    } finally{
        connection.release();
    }
})



//phân trang danh sách sản phẩm trong giỏ hàng

router.get('/',async(req,res) =>{
    // lấy giá trị page và limit từ querry trên URL , nếu ko có tham số truyền vào mặc định sẽ là 1 và 3
    let page =+req.query.page || 1; //ép kiểu string sang number
    let limit =+req.query.limit || 3;
    let offset = (page -1) * limit ; // vị trí bắt đầu khi lấy dũ liệu , vd trang 1 -1 =0 *3 =0 lấy vị trị 0
    let user_id =req.query.user_id

    try {
        //tìm cart chưa thanh toán mới nhất của user
        const [cartRow] = await pool.execute(`SELECT cart_id FROM cart WHERE user_id =? AND status='unpaid' ORDER BY user_id DESC LIMIT 1 `,
            [user_id]
        );
        // nếu ko có giỏ hàng nào thì trả về mảng là rỗng ,vd như khi khách hàng chưa thêm sản phẩm nào vào giỏ hàng
        if(cartRow.length ===0){
            res.status(200).json({
                EC:0,
                DT:{
                    cart:[],
                    totalPages:0
                }
            })
        }

        const cart_id=cartRow[0].cart_id;

        // đém có bao nhiêu item của giỏ hàng
        const [countRow]= await pool.query(`SELECT COUNT(*) as count FROM cart_detail WHERE cart_id=?`,
            [cart_id]
        )

        const totalItemCart = countRow[0].count; //lấy ra tổng số sản phẩm giỏ hàng , dùng để tính phân trang
        const totalPages =Math.ceil(totalItemCart/limit)

        // Lấy sản phẩm trong giỏ hàng để phân trang
        const [rows] =await pool.query(`SELECT cart_detail.cart_detail_id, cart_detail.cart_id, product.name, product.id as product_id, size.size, size.id as size_id,cart_detail.unit_price ,cart_detail.quantity,product.image
             FROM cart_detail
             JOIN product ON cart_detail.product_id =product.id
             JOIN size ON cart_detail.size_id = size.id
             WHERE cart_id=? LIMIT ? OFFSET ?`,
            [cart_id,limit,offset])

        res.status(200).json({
            EC:0,
            DT:{
                cart:rows, //trả về danh sách size hiện tại 
                totalPages:totalPages // trả về tổng số trang
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

// Xóa sản phẩm trong giỏ hàng

router.delete('/:id',async(req,res) =>{
    const cart_detail_id = req.params.id;
    const {quantity ,product_id,size_id} =req.query

    const connection =await pool.getConnection(); // chạy nhiều câu truy vấn cần transaction phải tạo 1 connect chạy 1 lần

    try{

        await connection.beginTransaction(); // bắt đầu transaction 

        const [result] = await connection.execute(
            'DELETE FROM cart_detail WHERE cart_detail_id= ?',[cart_detail_id]
        );

       await connection.execute('UPDATE inventory SET quantity = quantity + ? WHERE product_id=? AND size_id=?',
        [quantity,product_id,size_id]
    )

        await connection.commit()

        res.status(200).json({
            EC:0, // error code =0 là success , khác 0 là lỗi
            message:'Delete Item From Cart Success',
            name:result.id});
    }catch(err){
        await connection.rollback();
        console.error(err);
        res.status(500).json({
            EC:1,
            error:'Something Wrong '})
    }
}) 

//Update item trong cart

router.put('/:id',async(req,res) =>{
    const cart_detail_id = req.params.id;
    const {quantity ,new_size_id} = req.body;

        const connection =await pool.getConnection(); // chạy nhiều câu truy vấn cần transaction phải tạo 1 connect chạy 1 lần

    try{
        await connection.beginTransaction(); // bắt đầu transaction 

        // lấy thông tin số lượng , size , sản phẩm của giỏ hàng cũ
        const [row] = await connection.execute(
            `SELECT quantity ,size_id,product_id FROM cart_detail WHERE cart_detail_id =?`,
            [cart_detail_id]
        )

        const detailRowCart = row[0] // lấy giá trị đầu tiên

        if(!detailRowCart){
            await connection.rollback();
            return res.status(404).json({
                EC:1,
                message:'Cart Item Not Found'
            })
        }

        const oldQuantity =detailRowCart.quantity;
        const size_id =detailRowCart.size_id;
        const product_id=detailRowCart.product_id

        // kiểm tra chênh lệch , nếu quantityChange mà lớn hơn 0 là người dùng mua thêm thì trừ kho , bé hơn 0 thì cộng thêm vào kho
        const quantityChange =quantity - oldQuantity;

        //ĐỔI SIZE

        // nếu đổi size thì hoàn số lượng size cũ vào trong kho lại ,vd đang size 38 5c đổi lại size 39 thì size 38 quantity +5
        if(new_size_id != size_id)
        {
            await connection.execute(`UPDATE inventory SET quantity = quantity + ? WHERE product_id=? AND size_id=?`,
                [oldQuantity,product_id,size_id]
            )
        
        // kiểm tra tồn kho của size mới đó
        const [inventoryRow] = await connection.execute(
             `SELECT quantity FROM inventory WHERE size_id=? AND product_id=?`,
            [new_size_id,product_id]
        )

        const inventoryQuantity = inventoryRow[0]

        if(!inventoryQuantity || inventoryQuantity<0){
            return res.status(404).json({
                EC:3,
                message:'Out Of Stock For New Size , Sorry '
            })
        }
            // trừ số lượng hàng đi khi lấy size mới
        await connection.execute(
            `UPDATE inventory SET quantity = quantity -? WHERE product_id=? AND size_id=?`,
            [quantity,product_id,new_size_id]
        )

        // Kiểm tra cart đã có size và sản phẩm đó trong cart chưa , nếu có rồi thì gộp vào khi đổi size  , phải có cả where cart_detail_id !=? để nó tìm những dòng khác để gộp vào mà ko tìm chính id của mình để gộp

        const [existing] = await connection.execute(`SELECT cart_detail_id , quantity FROM cart_detail WHERE
             size_id= ? AND product_id=? AND cart_detail_id !=?`,
        [new_size_id,product_id,cart_detail_id]
        )

        console.log("Found existing rows:", existing.length);

            // nếu tồn tại 1 dòng khác có cùng size và product
        if(existing.length >0){
            const existingRow = existing[0];
            const newTotalQuantity =parseInt(existingRow.quantity)+ parseInt(quantity)  //số lượng của dòng được gộp chung vào có cùng size và product

            console.log("Old quantity:", oldQuantity);
            console.log("New quantity:", quantity);
            console.log("Existing quantity:", existingRow.quantity);
            console.log("Total quantity after merge:", newTotalQuantity);

            //cập nhật số lượng mới đã đc gộp vào cart_item_id khác mà có cùng size ,product
            await connection.execute(`UPDATE cart_detail SET quantity = ? WHERE cart_detail_id=?`,
                [newTotalQuantity,existingRow.cart_detail_id]
            )

            //xóa dòng cũ đi
            await connection.execute(`DELETE FROM cart_detail WHERE cart_detail_id=?`,
                [cart_detail_id]
            );
        }else{

                //Nếu ko phải đổi size sang 1 size và product đã có, thì Cập nhật giỏ hàng lại khi đổi lại size với và số lượng cũng sẽ cập nhật
            await connection.execute(
                `UPDATE cart_detail set quantity = ? , size_id =? WHERE cart_detail_id =? `
                ,[quantity,new_size_id,cart_detail_id]
            );
        }


    }

        //KO ĐỔI SIZE

        // Nếu ko đổi size thì chỉ kiểm tra và thay đổi số lượng,tăng số lượng thì kiểm tra quantity xem có còn đủ ko , lấy số lượng quantity trong kho so sánh
        else{
            const [inventoryRow] = await connection.execute(
                `SELECT quantity FROM inventory WHERE size_id =? AND product_id=?`,
                [size_id,product_id]
            )

            const inventoryQuantity = inventoryRow[0]

            //Nếu Người dùng tăng số lượng thì giảm số lượng kho
            if(quantityChange >0){

                if(inventoryQuantity <quantityChange){
                    await connection.rollback();
                    return res.status(404).json({
                        EC:2,
                        message:"Not Enough Item :( Sorry "
                    })
            }
            
            await connection.execute(`UPDATE inventory SET quantity = quantity - ? WHERE product_id=? AND size_id=?`,
                [quantityChange,product_id,size_id]
            )
        }
            // nếu trừ bớt sản phẩm trong giỏ hàng thì hoàn lại vào kho
        else if(quantityChange <0){
             await connection.execute(`UPDATE inventory SET quantity = quantity + ? WHERE product_id=? AND size_id=?`,
                [-quantityChange,product_id,size_id]
            )
        }
    }

    
        // cập nhật lại số lượng trong giỏ hàng với size cũ
        const [result] = await connection.execute(
            'UPDATE cart_detail set quantity = ? WHERE cart_detail_id =? ',[quantity,cart_detail_id]
        );
    
    
        
        await connection.commit()

        res.status(200).json({
            EC:0, // error code =0 là success , khác 0 là lỗi
            message:'Cart Update Sucess',
            name:result.cart_detail_id});
    }catch(err){
        console.error(err);
        await connection.rollback();
        res.status(500).json({
            EC:1,
            error:'Something Wrong '})
    }
}) 

export default router