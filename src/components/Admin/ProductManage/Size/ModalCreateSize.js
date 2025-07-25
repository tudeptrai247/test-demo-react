import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import {postCreateNewSize} from '../../../../service/apiService';
import { toast } from 'react-toastify';


const ModalCreateSize =(props) =>{

    const {show , setShow} = props;
   
    
    const handleClose =() =>{
        setShow(false)
        setSize("")
    }

    const [size , setSize] = useState("");

    const handleSubmitCreateSize =async() =>{
        if(!size){
            toast.warning("Size empty , Please Input a value")
            return
        }

        let data = await postCreateNewSize(size);
        console.log("data của size" , data)
        if(data && data.EC ==0){
        toast.success(data.message);
        handleClose();
        props.setCurrentPage(1);
        await props.fetchListSizeWithPaginate(1)
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
            className='modal-add-size'
            >
             <Modal.Header closeButton>
                <Modal.Title>Add New Size</Modal.Title>
            </Modal.Header>
            <Modal.Body>
        <form className="row g-3">
                <div className="col-md-6">
                    <label  className="form-label">Size Code</label>
                    <input type="text" className="form-control" value={size} onChange={(event) =>setSize(event.target.value)} />
                </div>
                </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() =>handleSubmitCreateSize()} >
            Save
          </Button>
        </Modal.Footer>
            </Modal>
        </>
    )
}
export default ModalCreateSize