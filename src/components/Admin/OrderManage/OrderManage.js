import { useEffect, useState } from "react";
import TableAdminOrderPaginate from "./TableAdminOrderPaginate"
import {getOrderListAdminWithPaginate} from "../../../service/apiService"
import ModalUpdateStatus from './ModalUpdateStatus'
import ModalOrderDetail from "./ModalOrderDetail";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./OrderManage.scss"

const OrderManage =() =>{

    const navigate =useNavigate()

     const LIMIT_ORDER=8;
        const [pageCount,setPageCount]=useState(0)
        const [currentPage,setCurrentPage]=useState(1)
        const [listOrder ,setListOrder]=useState([])
        const [dataUpdate ,setDataUpdate]=useState("")
    
        const [showModalUpdateStatus ,setShowModalUpdateStatus]=useState(false)
        const [showModalDetail ,setShowModalDetail]=useState(false)
    
        useEffect(()=>{
        fetchOrderWithPaginate(1)
    },[])

    const fetchOrderWithPaginate =async(page) =>{
        let res = await getOrderListAdminWithPaginate(page,LIMIT_ORDER)
        console.log("res data order" ,res)
        setListOrder(res.DT.orderCustomer)
        setPageCount(res.DT.totalPages)
    }

    const handleUpdateStatus =(item) =>{
        setShowModalUpdateStatus(true)
        setDataUpdate(item)
    }

    const handleOrderDetail =(item) =>{
        setShowModalDetail(true)
        setDataUpdate(item)
    }
    const handleClickToOrderDelete =()=>{
        navigate("../order-canceled")
    }
    return(
        <>
            <div className="order-manage-container">
                <div className="title">
                        Order Manage
                </div>
                <div className="btn-canceled-order">
                    <Button onClick={()=>handleClickToOrderDelete()}>Delete Order List</Button>
                </div>
                <div className="table-order-container">
                    <TableAdminOrderPaginate
                        fetchOrderWithPaginate={fetchOrderWithPaginate}
                        listOrder={listOrder}
                        pageCount={pageCount}
                        setCurrentPage={setCurrentPage}
                        currentPage={currentPage}
                        handleUpdateStatus={handleUpdateStatus}
                        handleOrderDetail ={handleOrderDetail}
                    />
                    <ModalUpdateStatus 
                        dataUpdate={dataUpdate}
                        show={showModalUpdateStatus}
                        setShow ={setShowModalUpdateStatus}
                        currentPage={currentPage}
                        fetchOrderWithPaginate={fetchOrderWithPaginate}
                    />
                    <ModalOrderDetail
                    show={showModalDetail}
                    setShow={setShowModalDetail}
                    dataUpdate={dataUpdate}
                    />
                </div>
            </div>
        </>
    )
}
export default OrderManage