import _ from "lodash"
import { useEffect, useState } from "react"
import { Button, Modal } from "react-bootstrap"


const ModalViewReceiptDetail =(props) =>{

    const {show , setShow ,dataReceiptDetail} =props

    const [quantity,setQuantity]=useState("")
    const [unitprice,setUnitprice]=useState("")
    const [receipt,setReceipt] =useState("")
    const [product,setProduct]=useState("")
    const [size ,setSize]=useState("")

    useEffect(()=>{
        if(!_.isEmpty(dataReceiptDetail)){
            setQuantity(dataReceiptDetail.quantity)
            setUnitprice(dataReceiptDetail.unit_price)
            setReceipt(dataReceiptDetail.receipt_id)
            setProduct(dataReceiptDetail.product_id)
            setSize(dataReceiptDetail.size_id)
        }
    },[dataReceiptDetail])

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
                    <form className="row g-3">
                        <div className="col-md-3">
                            <label className="form-lable">Quantity</label>
                            <input type="text" className="form-control" disabled value={quantity} onChange={(event)=>setQuantity(event.target.value)}></input>
                        </div>
                        <div className="col-md-3">
                            <label className="form-lable">Unit Price</label>
                            <input type="text" className="form-control" disabled value={unitprice} onChange={(event)=>setUnitprice(event.target.value)}></input>
                        </div>
                        <div className="col-md-3">
                            <label className="form-lable">Receipt ID</label>
                            <input type="text" className="form-control" disabled value={receipt} onChange={(event)=>setReceipt(event.target.value)}></input>
                        </div>
                        <div className="col-md-3">
                            <label className="form-lable">Product ID</label>
                            <input type="text" className="form-control" disabled value={product} onChange={(event)=>setProduct(event.target.value)}></input>
                        </div>
                        <div className="col-md-3">
                            <label className="form-lable">Size ID</label>
                            <input type="text" className="form-control" disabled value={size} onChange={(event)=>setSize(event.target.value)}></input>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    )
}
export default ModalViewReceiptDetail