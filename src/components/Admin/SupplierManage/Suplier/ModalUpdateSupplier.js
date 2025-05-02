import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import _ from 'lodash';
import { putUpdateSupplier } from '../../../../service/apiService';
import { toast } from 'react-toastify';


const ModalUpdateSupplier =(props) =>{

    const {show , setShow , dataUpdate} = props

    const handleClose =() =>{
        setShow(false);
        setName("");
        setAddress("");
        setNumber("")
        props.resertUpdateData("")
    };

    useEffect(() =>{
        if(!_.isEmpty(dataUpdate)){
            setName(dataUpdate.name);
            setAddress(dataUpdate.address);
            setNumber(dataUpdate.number);
        }
    } ,[dataUpdate]);

    const [name , setName] = useState("");
    const [address , setAddress] = useState("");
    const [number , setNumber] = useState("");


    const handleSubmitUpdateSupplier = async() =>{
        let data = await putUpdateSupplier(dataUpdate.id,name,address,number);
        console.log('data update' ,data)
        toast.success(data.message);
        handleClose();
        await props.fetchListSuppliersWithPaginate(props.setCurrentPage);

    if(data && data.EC !=0){
        toast.error(data.EM)
    }
}
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
          <Modal.Title>Update Supplier Information</Modal.Title>
        </Modal.Header>

        <Modal.Body>
        <form className="row g-3">
  <div className="col-md-6">
    <label  className="form-label">Name Supplier</label>
    <input type="text" className="form-control" value={name} onChange={(event) =>setName(event.target.value)} />
  </div>
  <div className="col-md-6">
    <label  className="form-label">Address</label>
    <input type="text" className="form-control" value={address} onChange={(event) =>setAddress(event.target.value)} />
  </div>
 
  <div className="col-md-6">
    <label  className="form-label">Phone Number</label>
    <input type="text" className="form-control" value={number} onChange={(event) =>setNumber(event.target.value)}/>
  </div>
</form>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() =>handleSubmitUpdateSupplier()}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
        </>
    )
}
export default ModalUpdateSupplier