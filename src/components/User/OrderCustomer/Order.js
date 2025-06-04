import OrderTablePaginate from "./OrderTablePaginate"
import {getOrderWithPaginate} from "../../../service/apiService"
import { useEffect, useState } from "react";
import './Order.scss'
import ModalOrderDetail from "./ModalOrderDetail";

const Order =() =>{

    const LIMIT_ORDER=6;
    const [pageCount,setPageCount]=useState(0)
    const [currentPage,setCurrentPage]=useState(1)
    const [listOrder ,setListOrder]=useState([])
    const [dataUpdate ,setDataUpdate]=useState("")

    const [showModalOrderDetail ,setShowModalOrderDetail]=useState(false)

    const storedAccount =localStorage.getItem("account");
     const user =JSON.parse(storedAccount)
     const user_id =user?.id;

    useEffect(()=>{
        fetchOrderWithPaginate(1)
    },[])

    const fetchOrderWithPaginate =async(page) =>{
        let res = await getOrderWithPaginate(page,LIMIT_ORDER,user_id)
        console.log("res data order" ,res)
        setListOrder(res.DT.orderCustomer)
        setPageCount(res.DT.totalPages)
    }

    const handleClickOrderDetail =(item)=>{
       setShowModalOrderDetail(true)
       setDataUpdate(item)
    }
    return(
        <>
            <div className="order-manage-container">
                <div className="title">
                    Order History
                </div>
                <div className="table-order-container">
                    <OrderTablePaginate
                        fetchOrderWithPaginate={fetchOrderWithPaginate}
                        listOrder={listOrder}
                        pageCount={pageCount}
                        currentPage={currentPage}
                        handleClickOrderDetail={handleClickOrderDetail}
                    />
                    <ModalOrderDetail 
                        show={showModalOrderDetail}
                        setShow={setShowModalOrderDetail}
                        dataUpdate={dataUpdate}
                    />
                </div>

            </div>
        </>
    )
}
export default Order