import mysql from "mysql2/promise"

// sử dụng pool để lấy truy vấn nhanh hơn , pool có thể hoạt động nhiều connection cùng lúc
const pool = mysql.createPool({
        host:'localhost',
        user:'root',
        password:'',
        database:'luanvan',
        waitForConnections:true,
        connectionLimit:10,
        queueLimit:0
    })


export default pool