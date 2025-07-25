import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { putUpdateCategory } from '../../../../service/apiService';
import { toast } from 'react-toastify';
import _ from 'lodash';

const ModalUpdateCategory =(props) =>{

   

    const {show , setShow,dataUpdate} =props
    const[category,setCategory] =useState("")

    const handleClose =() =>{
        setShow(false);
    }

    useEffect(()=>{
        if(!_.isEmpty(dataUpdate)){
            setCategory(dataUpdate.category)
        }
    },[dataUpdate])

    const handleSubmitUpdateCategory =async() =>{
         if(!category){
            toast.warning("Category empty , Please Input a value")
            return
        }
        let data = await putUpdateCategory(dataUpdate.id,category);
        if(data && data.EC === 0){
            toast.success(data.message)
            handleClose();
            await props.fetchListCategoryWithPaginate(props.currentPage) //fetch lại trang đang hiện tại
            
        }
        if(data && data.EC != 0){
            toast.error("ERROR")
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
          <Modal.Title>Update Category Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form className="row g-3">
            <div className="col-md-6">
                <label  className="form-label">Categoty</label>
                <input type="text" className="form-control" value={category} onChange={(event) =>setCategory(event.target.value)} />
            </div>
        </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() =>handleSubmitUpdateCategory()}>
            Save
          </Button>
        </Modal.Footer>  
            </Modal>
        </>
    )
}
export default ModalUpdateCategory