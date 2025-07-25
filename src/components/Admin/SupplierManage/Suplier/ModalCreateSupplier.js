import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { postCreateNewSupplier } from '../../../../service/apiService';



const ModalCreateSupplier =(props) =>{
    const {show , setShow} = props;

    const handleClose =() =>{
        setShow(false);
        setName("");
        setAddress("");
        setNumber("")
    };

    const [name , setName] = useState("");
    const [address , setAddress] = useState("");
    const [number , setNumber] = useState("");

    const handleSubmitCreateSupplier = async() =>{
        if(!name || !address || !number){
            toast.warning("Please Fill All Information")
            return
        }
      let data = await postCreateNewSupplier(name,address,number);
      console.log('<<res supplier', data)
      if(data?.EC === 0){
        toast.success(data.message);
        handleClose();
        props.setCurrentPage(1)
        await props.fetchListSuppliersWithPaginate(1)
      }
      if(data && data.EC != 0){
        toast.error("Error");
       
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
          <Modal.Title>Add New Supplier</Modal.Title>
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
          <Button variant="primary" onClick={() =>handleSubmitCreateSupplier()}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
        </>
    )
}
export default ModalCreateSupplier