import './ManageDeleteReceipt.scss'
import TableDeleteReceiptPaginate from './TableDeleteReciptPaginta'
import {getDeleteReceiptWithPaginate} from "../../../../service/apiService"
import { useEffect, useState } from 'react'
import ModalRestoreReceipt from './ModalRestoreReceipt'

const ManageRestoreReceipt =() =>{

    const LIMIT_DELETERECEIPT=3

    const [dataUpdate ,setDataUpdate]=useState([])
    const [lisDeleteReceipt ,setListDeleteReceipt]=useState([])
    const [pageCount ,setPageCount]=useState(0)
    const [currentPage,setCurrentPage]=useState(1)
    const [showModalRestoreReceipt ,setShowModalRestoreReceipt]=useState(false)

    useEffect(()=>{
        fetchListDeleteReceiptWithPaginate(1)
    },[])

    const fetchListDeleteReceiptWithPaginate =async(page) =>{
        let res = await getDeleteReceiptWithPaginate(page,LIMIT_DELETERECEIPT)
        console.log('res data fet' ,res)
        setListDeleteReceipt(res.DT.deletereceipt)
        setPageCount(res.DT.totalPages)
    }

    const handleClickBtnRestore =(deletereceipt)=>{
        setShowModalRestoreReceipt(true)
        setDataUpdate(deletereceipt)
        
    }

    return(
        <div className="manage-container">
            <div className="title">
                Manage Delete Receipt Record
            </div>
            <div className='table-delete-receipt-container'>
                <TableDeleteReceiptPaginate
                    fetchListDeleteReceiptWithPaginate={fetchListDeleteReceiptWithPaginate}
                    lisDeleteReceipt={lisDeleteReceipt}
                    setPageCount={setPageCount}
                    pageCount={pageCount}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    handleClickBtnRestore={handleClickBtnRestore}
                />
                <ModalRestoreReceipt
                    show={showModalRestoreReceipt}
                    setShow={setShowModalRestoreReceipt}
                    dataUpdate={dataUpdate}
                    fetchListDeleteReceiptWithPaginate={fetchListDeleteReceiptWithPaginate}
                    setCurrentPage={setCurrentPage}
                    currentPage={currentPage}
                />
            </div>
        </div>
    )
}
export default ManageRestoreReceipt