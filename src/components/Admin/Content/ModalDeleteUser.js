import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { deleteUser } from '../../../service/apiService';
import { toast } from 'react-toastify';

const ModalDeleteUser =(props) => {
  const {show, setShow ,dataDelete} = props;

  const handleClose = () => setShow(false); // khi nhấn đóng ,sẽ cập nhật lại setShow là false để đóng đi
  
  const handleSubmitDeleteUser = async () =>{
    let data = await deleteUser(dataDelete.id);
    if(data && data.EC === 0){
     toast.success(data.EM);
     handleClose();
     await props.fetchListUsers();
    }
  }

  console.log("datadelete" ,props.dataDelete)
  return (
    <>
      <Modal  
      show={show} 
      onHide={handleClose}
      backdrop="static"  //click ra ngoài sẽ ko đóng lại
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete User ?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure to delete this user 
            <b> {dataDelete && dataDelete.email ? dataDelete.email : " "}</b>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() =>handleSubmitDeleteUser()}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalDeleteUser;