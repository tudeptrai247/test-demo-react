import { Modal } from "react-bootstrap"
import Button from 'react-bootstrap/Button';
import {deleteBrand} from '../../../../service/apiService'
import { toast } from "react-toastify";


const ModalDeleteBrand =(props) =>{

    const {show ,setShow, dataUpdate} = props;

    const handleClose =() =>{
        setShow(false)
    }

    const handleSubmitDeleteSize=async() =>{
        let data = await deleteBrand(dataUpdate.id);
        if(data && data.EC ===0){
            toast.success(data.message)
            handleClose()
            props.setCurrentPage(1)
            await props.fetchListBrandWithPaginate(1)
        }
        if(data && data.EC !=0)
        {
            toast.error("ERROR")
        }
    }

    return(
        <>
    <Modal
         show={show}
         onHide={handleClose}
         backdrop="static"
        >
        <Modal.Header closeButton>
            <Modal.Title>Confirm Delete Brand ?</Modal.Title>
        </Modal.Header> 
        <Modal.Body>Are you sure to delete this Brand
            <b> {dataUpdate && dataUpdate.brand ? dataUpdate.brand : " "}</b>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() =>handleSubmitDeleteSize()}>
            Confirm
          </Button>
        </Modal.Footer>
    </Modal>
        </>
    )
}
export default ModalDeleteBrand