import _ from "lodash"
import { useEffect, useState } from "react"
import { Button, Modal } from "react-bootstrap"
import {getAllSize,getAllProduct} from "../../../../service/apiService";


const ModalViewReceiptDetail =(props) =>{

    const {show , setShow ,dataReceiptDetail} =props

    const [listProduct,setListProduct]=useState([])
    const [listSize , setListSize]=useState([])

    useEffect(()=>{
        fetchData();
    },[])

    const fetchData =async()=>{
        const resProduct = await getAllProduct();
            if(resProduct.EC ===0) setListProduct(resProduct.product)
         const resSize = await getAllSize();
            if(resSize.EC ===0) setListSize(resSize.size)
    }

    const handleClose =() =>{
        setShow(false)
    }

    return(
        <>
            <Modal
            show={show}
            onHide={handleClose}
            size="xl"
            backdrop="static"
            className='modal-add-receipt'
            >
                <Modal.Header closeButton>
                    <Modal.Title>View Receipt Detail</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                   <table className="table table-hover table-bordered">
            <thead>
            <tr>
                <th scope="col">Product</th>
                <th scope="col">Size</th>
                <th scope="col">Quantity</th>
                <th scope="col">Unit Price</th>
            </tr>
            </thead>
        
        <tbody>
        {
        dataReceiptDetail.map((item,index)=>{
            return(
                <tr key={`table-receipt-${index}`}>
                        <th>{item.name}</th>
                        <td>{item.size}</td>
                        <td>{item.quantity}</td>
                        <td>{item.unit_price}</td>
                        <td>
                        </td>
                </tr>
            )
        })
        }
        </tbody>
        </table>
                </Modal.Body>
            </Modal>
        </>
    )
}
export default ModalViewReceiptDetail