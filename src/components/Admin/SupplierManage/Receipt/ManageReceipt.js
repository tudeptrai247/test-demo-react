import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import ModalCreateReceipt from "./ModalCreateReceipt";
import TableReceiptPaginate from "./TableReceiptPaginate";
import {getReceiptWithPaginate ,getReceiptDetail} from "../../../../service/apiService"
import './ManageReceipt.scss'
import ModalViewReceiptDetail from "./ModalViewReceiptDetail";
import ModalDeleteSoftReceipt from "./ModalDeleteSoftReceipt";


const ManageReceipt =() =>{

    const LIMIT_RECEIPT =3;

    const [showModalCreateReceipt,setShowModalCreateReceipt]= useState(false)
    const [listReceipt , setListReceipt]=useState("")
    const [pageCount,setPageCount]=useState(0)
    const [currentPage,setCurrentPage]=useState(1)
    const [showModalViewReceiptDetail ,setShowModalViewReceiptDetail]=useState(false)
    const [dataReceiptDetail,setDataReceiptDetail]=useState([])
    const [showModalDeleteSoftReceipt,setShowModalDeleteSoftReceipt] =useState(false)
    const [dataReceipt ,setDataReceipt]=useState([])
    useEffect(()=>{ 
        fetchListReceiptWithPaginate(1);
    },[])

    const fetchListReceiptWithPaginate =async(page) =>{
        let res = await getReceiptWithPaginate(page,LIMIT_RECEIPT);
        if(res.EC===0){
            console.log('res data', res)
            setListReceipt(res.DT.receipt)
            setPageCount(res.DT.totalPages)
        }
    }

    const handleClickBtnView = async(receipt) =>{
        const id =receipt.receipt_id
        
        let res = await getReceiptDetail(id)
        console.log('data receipt detail' ,res)
        if(res && res.EC===0){
            console.log('res data ',res)
            setShowModalViewReceiptDetail(true)
            setDataReceiptDetail(res.receipt_detail)
        }
    }

    const handleClickBtnDeleteSoft = (receipt) =>{
        setShowModalDeleteSoftReceipt(true)
        setDataReceipt(receipt)
        console.log('res data delete',receipt)
    }

    

    return(
        <div>
            <div className="manage-container">
                <div className="title">
                    Manage Receipt
                </div>
                <div className="content">
                    <div className="btn-add-new">
                        <button className="btn btn-primary" onClick={()=>setShowModalCreateReceipt(true)}><FiPlus />Add New Receipt</button>
                    </div>
                <div className="table-receipt-container">
                    <TableReceiptPaginate
                        fetchListReceiptWithPaginate={fetchListReceiptWithPaginate}
                        listReceipt={listReceipt}
                        setCurrentPage={setCurrentPage}
                        pageCount={pageCount}
                        currentPage={currentPage}
                        handleClickBtnView={handleClickBtnView}
                        handleClickBtnDeleteSoft={handleClickBtnDeleteSoft}
                    />
                    <ModalCreateReceipt
                        show={showModalCreateReceipt}
                        setShow={setShowModalCreateReceipt}
                        fetchListReceiptWithPaginate={fetchListReceiptWithPaginate}
                        setCurrentPage={setCurrentPage}
                    />
                    <ModalViewReceiptDetail 
                        show={showModalViewReceiptDetail}
                        setShow={setShowModalViewReceiptDetail}
                        dataReceiptDetail={dataReceiptDetail}
                    />
                    <ModalDeleteSoftReceipt
                        show={showModalDeleteSoftReceipt}
                        setShow={setShowModalDeleteSoftReceipt}
                        dataReceipt={dataReceipt}
                        fetchListReceiptWithPaginate={fetchListReceiptWithPaginate}
                        setCurrentPage={setCurrentPage}
                    />
                </div> 
                </div>
            </div>
        </div>
    )
}
export default ManageReceipt