import { useEffect, useState } from "react";
import {getOrderListAdminCanceledWithPaginate} from "../../../service/apiService"
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import"./OrderManage.scss"
const TableCanceledOrder =() =>{

    const LIMIT_ORDER=8;

    const [pageCount,setPageCount]=useState(0)
    const [currentPage,setCurrentPage]=useState(1)
    const [listOrder ,setListOrder]=useState([])

    const navigate =useNavigate()

     useEffect(()=>{
            fetchOrderCanceledWithPaginate(1)
        },[])

    const fetchOrderCanceledWithPaginate =async(page) =>{
        let res = await getOrderListAdminCanceledWithPaginate(page,LIMIT_ORDER)
        console.log("res data order" ,res)
        setListOrder(res.DT.orderCustomer)
        setPageCount(res.DT.totalPages)
    }

    const handleClickToOrder =()=>{
        navigate("../manage-order")
    }


    return(
        <>
            <div className="table-canceled-order-container">
                 <div className="btn-to-order">
                    <Button onClick={()=>handleClickToOrder()}>Back To Order List</Button>
                </div>
                <div className="table-canceled-order">
                    <table className="table table-hover table-bordered">
                <thead>
                    <tr>
                        <th scope="col">Order Id</th>
                        <th scope="col">User Name</th>
                        <th scope="col">Address</th>
                        <th scope="col">Phone Number</th>
                        <th scope="col">Order Date</th>
                        <th scope="col">Payment Method</th>
                        <th scope="col">Total</th>
                        <th scope="col">Status</th>
                        <th scope="col">Status Payment</th>
                    </tr>
                </thead>
            
            <tbody>
                {listOrder && listOrder.length >0 &&
            
            listOrder.map((item,index)=>{
                   const date = new Date(item.order_date)    
                const vietnamTime = date.toLocaleDateString("vi-VN",{timeZone:"Asia/Ho_Chi_Minh"})  
                return(
                    <tr key={`table-order-${index}`}>
                        <th>{item.order_id}</th>
                        <td>{item.username}</td>
                        <td>{item.address}</td>
                        <td>{item.number}</td>
                        <td>{vietnamTime}</td>
                        <td>{item.payment_method}</td>
                        <td>{item.payment_status}</td>
                        <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.total)}</td>
                        <td>{item.status}</td>
                        <td>
                        </td>
                    </tr>
                )
            })
            }
            {listOrder && listOrder.length ==0 &&
            <tr>
                <td colSpan={'4'}>Not Found Data</td>
            </tr>
            }
            
            </tbody>
        </table>
                </div>
            </div>
        </>
    )
}
export default TableCanceledOrder