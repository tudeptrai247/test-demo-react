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
    setImage("")
    setPreviewImage("")
  };
  const handleShow = () => setShow(true);

  const [email , setEmail]=useState(" ");
  const [password , setPassword]=useState(" ");
  const [username ,setUsername]=useState(" ");
  const [role , setRole] =useState("USER");
  const [image ,setImage]=useState(" ");
  const [previewImage ,setPreviewImage] =useState("");

  const handleUploadImage = (event) =>{
    if(event.target && event.target.value && event.target.files[0])
    {
      setPreviewImage(URL.createObjectURL(event.target.files[0]))
      setImage(event.target.files[0])
    }
  }

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmitCreateUser = async() =>{
    //validate
    // const isValidEmail = validateEmail(email);
    // if(!isValidEmail){
    //   toast.error('invalid email')
    //   // toast.error()
    //   // toast.error()
      
    //   return;
    // }
    if(!password){
      toast.error('invalid password') 
      return;
    }
   

   let data = await postCreateNewUser(email,password,username,role,image);
   console.log('<< component res :' , data)
   if(data && data.EC === 0){
    toast.success(data.EM);
    handleClose();
    await props.fetchListUsers();
   }

   if(data && data.EC != 0){
    toast.error(data.EM);
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
    <div className='col-md-12'>
      
        <label  className="form-label lable-upload" htmlFor='lableUpload'>
          <FiPlus /> Upload File Image</label>
        <input type='file' hidden id='lableUpload' onChange={(event) => handleUploadImage(event)}/>
    </div>
    <div className='col-md-12 img-preview'>
      {previewImage ?
      <img src={previewImage}/>
      :
      <span>Preview Image</span>
    }
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