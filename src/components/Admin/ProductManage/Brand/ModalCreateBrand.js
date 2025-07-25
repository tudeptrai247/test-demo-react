import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import {postCreateNewBrand} from '../../../../service/apiService';
import { toast } from 'react-toastify';


const ModalCreateBrand =(props) =>{

    const {show , setShow} = props;
    const [brand , setBrand] = useState("")

    const handleClose =() =>{
        setBrand("")
        setShow(false)
    }

    const handleSubmitCreateBrand =async() =>{
         if(!brand){
            toast.warning("Brand name empty , Please Input a value")
            return
        }
        let data = await postCreateNewBrand(brand)
        if(data && data.EC === 0) {
            toast.success(data.message)
            handleClose();
            props.setCurrentPage(1)
            await props.fetchListBrandWithPaginate(1)
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
                    <Modal.Title>Add New Brand</Modal.Title>
                </Modal.Header>
                <Modal.Body>
        <form className="row g-3">
                <div className="col-md-6">
                    <label  className="form-label">Brand Name</label>
                    <input type="text" className="form-control" value={brand} onChange={(event) =>setBrand(event.target.value)} />
                </div>
                </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() =>handleSubmitCreateBrand()} >
            Save
          </Button>
        </Modal.Footer>
            </Modal>
        </>
    )
}
export default ModalCreateBrand