import _ from 'lodash';
import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';


const ModalViewSize =(props) =>{

    const {show , setShow , dataUpdate} = props
    const [size , setSize] =useState("");

    const handleClose =() =>{
        setSize("")
        setShow(false)
        props.resertUpdateData()
    }

    useEffect(() =>{ //sd useEffect để mỗi khi dataUpdate thay đổi cập nhật lại
        if(!_.isEmpty(dataUpdate)){
            setSize(dataUpdate.size)
        }
    },[dataUpdate])

    return(
        <>
        <Modal
            show={show}
            onHide={handleClose} 
            size="xl"
            backdrop="static"
            className='modal-add-supplier'
            >
            <Modal.Header closeButton>
            <Modal.Title>Add New Supplier</Modal.Title>
            </Modal.Header>

            <Modal.Body>
        <form className="row g-3">
        <div className="col-md-6">
        <label  className="form-label">Size</label>
        <input type="text" className="form-control" disabled value={size} onChange={(event) =>setSize(event.target.value)} />
  </div>
       
</form>

        </Modal.Body>
            </Modal>
        </>
    )
}
export default ModalViewSize