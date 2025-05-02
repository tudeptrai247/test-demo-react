import Modal from 'react-bootstrap/Modal';
import { useEffect, useState } from 'react';
import _ from 'lodash';


const ModalViewSupplier =(props) =>{

    const {show , setShow ,dataUpdate} = props;
    
    const [name , setName] = useState("");
    const [address , setAddress] = useState("");
    const [number , setNumber] = useState("");

    const handleClose =() =>{
        setShow(false)
        setName("");
        setAddress("");
        setNumber("")
        props.resertUpdateData("")
    }

    useEffect(() =>{
        if(!_.isEmpty(dataUpdate)){
            setName(dataUpdate.name);
            setAddress(dataUpdate.address);
            setNumber(dataUpdate.number);
        }
    } , [dataUpdate])

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
        <label  className="form-label">Name Supplier</label>
        <input type="text" className="form-control" disabled value={name} onChange={(event) =>setName(event.target.value)} />
  </div>
        <div className="col-md-6">
        <label  className="form-label">Address</label>
        <input type="text" className="form-control" disabled value={address} onChange={(event) =>setAddress(event.target.value)} />
  </div>
 
  <div className="col-md-6">
        <label  className="form-label">Phone Number</label>
        <input type="text" className="form-control" disabled value={number} onChange={(event) =>setNumber(event.target.value)}/>
  </div>
</form>

        </Modal.Body>
            </Modal>
        </>
    )
}
export default ModalViewSupplier