import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FiPlus } from "react-icons/fi";
import { toast } from 'react-toastify';
import { putUpdateUser } from '../../../service/apiService';
import _ from 'lodash';


const ModalUpdateUser =(props) => {
  const {show , setShow , dataUpdate} = props;

  const handleClose = () => {
    setShow(false)
    setEmail("")
    setPassword("")
    setRole("USER")
    props.resertUpdateData("")
  };

  useEffect(() =>{ //cập nhật state mỗi khi render lần đầu , nếu ko có sẽ ko hiện thông tin ở trong form được
    
    if(!_.isEmpty(dataUpdate)){
      setEmail(dataUpdate.email);
      setUsername(dataUpdate.username);
      setRole(dataUpdate.role);
    }
        //update state

  }, [dataUpdate]);
  const handleShow = () => setShow(true);

  const [email , setEmail]=useState("");
  const [password , setPassword]=useState("");
  const [username ,setUsername]=useState("");
  const [role , setRole] =useState("USER");

  const handleSubmitUpdateUser = async() =>{
     if(!username ||!role){
      toast.error('Please Fill All Information')
      return;
     }
  
   let data = await putUpdateUser(dataUpdate.id,username,role);
  //  console.log('<< component res :' , data)
   if(data && data.EC === 0){
    toast.success(data.message);
    handleClose();
    // await props.fetchListUsers();
    // props.setCurrentPage(1)
    await props.fetchListUsersWithPaginate(props.currentPage);
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
          <Modal.Title>Update User</Modal.Title>
        </Modal.Header>

        <Modal.Body>
        <form className="row g-3">
  <div className="col-md-6">
    <label  className="form-label">Email</label>
    <input type="email" className="form-control" value={email} disabled onChange={(event)=>setEmail(event.target.value)} />
  </div>
  <div className="col-md-6">
    <label  className="form-label">Password</label>
    <input type="password" className="form-control" value={password} disabled onChange={(event)=>setPassword(event.target.value)}/>
  </div>
 
  <div className="col-md-6">
    <label  className="form-label">UserName</label>
    <input type="text" className="form-control" value={username} onChange={(event)=>setUsername(event.target.value)}/>
  </div>
  <div className="col-md-4">
    <label  className="form-label">Role</label>
    <select className="form-select" value={role} onChange={(event)=>setRole(event.target.value)}>
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
          <Button variant="primary" onClick={() => handleSubmitUpdateUser()}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalUpdateUser;