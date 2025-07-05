import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { deleteUser } from '../../../service/apiService';
import { toast } from 'react-toastify';

const ModalDeleteUser =(props) => {
  const {show, setShow ,dataDelete} = props;

  const handleClose = () => setShow(false); // khi set là false , sẽ đóng lại modal đó
  
  const handleSubmitDeleteUser = async () =>{
    let data = await deleteUser(dataDelete.id);

    if(data && data.EC ===2){
      toast.warning(data.message)
      handleClose()
      return
    }

    if(data && data.EC === 0){
     toast.success(data.message);
     handleClose();
    //  await props.fetchListUsers();
    props.setCurrentPage(1)
    await props.fetchListUsersWithPaginate(1);
    }
  }

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