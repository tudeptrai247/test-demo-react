import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import {postCreateNewCategory} from '../../../../service/apiService'
import { toast } from 'react-toastify';


const ModalCreateCategory =(props) =>{
    
    const{show ,setShow} = props

    const [category , setCategory] =useState("")

    const handleClose =() =>{
        setCategory("")
        setShow(false)
    }

    const handleSubmitCreateCategory =async() =>{
        let data = await postCreateNewCategory(category)
        if(data && data.EC === 0) {
            toast.success(data.message)
            handleClose();
            props.setCurrentPage(1)
            await props.fetchListCategoryWithPaginate(1)
        }
        if(data && data.EC !=0){
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
           className='modal-add-brand'
        >
            <Modal.Header closeButton>
                    <Modal.Title>Add New Category</Modal.Title>
            </Modal.Header>
            <Modal.Body>
        <form className="row g-3">
                <div className="col-md-6">
                    <label  className="form-label">Category Name</label>
                    <input type="text" className="form-control" value={category} onChange={(event) =>setCategory(event.target.value)} />
                </div>
                </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() =>handleSubmitCreateCategory()} >
            Save
          </Button>
        </Modal.Footer>
        </Modal>
        </>
    )
}
export default ModalCreateCategory