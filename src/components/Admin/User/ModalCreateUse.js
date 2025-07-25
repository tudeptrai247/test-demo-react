import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FiPlus } from "react-icons/fi";

import { toast } from 'react-toastify';
import { postCreateNewUser } from '../../../service/apiService';

const ModalCreateUser =(props) => {
  const {show , setShow} = props;

  const handleClose = () => {
    setShow(false)
    setEmail("")
    setPassword("")
    setRole("USER")
   
  };
  const handleShow = () => setShow(true);

  const [email , setEmail]=useState("");
  const [password , setPassword]=useState("");
  const [username ,setUsername]=useState("");
  const [role , setRole] =useState("USER");

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmitCreateUser = async() =>{
    const isValidEmail = validateEmail(email);
    if(!isValidEmail ||!password ||!username||!role){
      toast.error('Please Fill All Information')
      return;
    }
  
   

   let data = await postCreateNewUser(email,password,username,role);
   console.log('<< component res :' , data)
   if(data?.EC === 0){ // ? dùng để kiểm tra data có tồn tại ko trước khi truy cập EC
    toast.success(data.message);
    handleClose();
    // await props.fetchListUsers();
    props.setCurrentPage(1)
    await props.fetchListUsersWithPaginate(1); // lấy lại danh sách người dùng mới 
   }

   if(data && data.EC != 0){
    toast.error("Error");
   }
  }

  return (
    <>
      {/* <Button variant="primary"
      onClick={handleShow}
      
      >
        Launch demo modal
      </Button> */}

      <Modal 
      show={show} 
      onHide={handleClose} 
      size="xl"
      backdrop="static"
      className='modal-add-user'
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>

        <Modal.Body>
        <form className="row g-3">
  <div className="col-md-6">
    <label  className="form-label">Email</label>
    <input type="email" className="form-control" value={email} onChange={(event)=>setEmail(event.target.value)} />
  </div>
  <div className="col-md-6">
    <label  className="form-label">Password</label>
    <input type="password" className="form-control" value={password} onChange={(event)=>setPassword(event.target.value)}/>
  </div>
 
  <div className="col-md-6">
    <label  className="form-label">UserName</label>
    <input type="text" className="form-control" value={username} onChange={(event)=>setUsername(event.target.value)}/>
  </div>
  <div className="col-md-4">
    <label  className="form-label">Role</label>
    <select className="form-select" onChange={(event)=>setRole(event.target.value)}>
      <option  value="USER">User</option>
      <option  value="ADMIN">Admin</option>
    </select>
  </div>
</form>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleSubmitCreateUser()}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalCreateUser;