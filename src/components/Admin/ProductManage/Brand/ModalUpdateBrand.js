import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import _ from 'lodash';
import {putUpdateBrand} from '../../../../service/apiService';
import { toast } from 'react-toastify';


const ModalUpdateBrand =(props) =>{

    const {show ,setShow ,dataUpdate} =props
    const [brand , setBrand] = useState("")

    useEffect(()=>{
        if(!_.isEmpty(dataUpdate)){
            setBrand(dataUpdate.brand)
        }
    },[dataUpdate])

    const handleClose =() =>{
        setShow(false)
    }

    const handleSubmitUpdateBrand =async() =>{
         if(!brand){
            toast.warning("Brand name empty , Please Input a value")
            return
        }
        let data = await putUpdateBrand(dataUpdate.id,brand);
        if(data && data.EC === 0){
            toast.success(data.message)
            handleClose();
            await props.fetchListBrandWithPaginate(props.currentPage) //fetch lại trang đang hiện tại
            
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
          <Modal.Title>Update Brand Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form className="row g-3">
            <div className="col-md-6">
                <label  className="form-label">Brand</label>
                <input type="text" className="form-control" value={brand} onChange={(event) =>setBrand(event.target.value)} />
            </div>
        </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() =>handleSubmitUpdateBrand()}>
            Save
          </Button>
        </Modal.Footer>  
            </Modal>
        </>
    )
}
export default ModalUpdateBrand