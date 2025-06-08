import { useState } from "react"
import { Modal } from "react-bootstrap";
import {putUpdateStatusOrder} from "../../../service/apiService"
import Button from 'react-bootstrap/Button';
import { toast } from "react-toastify";


const ModalUpdateStatus =(props) =>{

    const {show , setShow , dataUpdate } = props

    const [status ,setStatus] =useState("processing")

    const statusAllow =['processing', 'shipping', 'delivered'];

     const handleClose =() =>{
        setShow(false)
        setStatus("processing")
    }

    const handleUpdateStatus =async()=>{
        let data = await putUpdateStatusOrder(dataUpdate.order_id,status)
        if(data && data.EC ===0){
            toast.success(data.message)
            handleClose()
            props.fetchOrderWithPaginate(props.currentPage)
        }
    }
    return(
        <>
            <Modal
             show={show} 
            onHide={handleClose} 
            size="sm"
            backdrop="static"
            className='modal-Update-status-order'>
                <Modal.Header closeButton>
                <Modal.Title>Update Status Order</Modal.Title>
                </Modal.Header>
                    <Modal.Body>
                        <form className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Status</label>
                                
                                    <select className="form-control" value={status} onChange={(event)=>setStatus(event.target.value)}>
                                            {statusAllow.map((item,index) =>{
                                                return<option key={index} value={item}>{item}</option>
                                            })}
                                    </select>
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={() =>handleUpdateStatus()}>
                            Save
                        </Button>
                        </Modal.Footer> 
            </Modal>
        </>
    )
}
export default ModalUpdateStatus