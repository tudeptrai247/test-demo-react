import { Modal } from "react-bootstrap"
import Button from 'react-bootstrap/Button';
import {deleteProduct} from '../../../../service/apiService'
import { toast } from "react-toastify";

const ModalDeleteProduct =(props) =>{

    const {show,setShow,dataUpdate} =props

    const handleClose =() =>{
        setShow(false)
    }

    const handleSubmitDeleteProduct =async()=>{
        let data = await deleteProduct(dataUpdate.id);
        if(data && data.EC ===2){
            toast.warning(data.message)
            handleClose()
            return
        }
        if(data && data.EC ===0){
            toast.success(data.message)
            handleClose()
            props.fetchListProductWithPaginate(1);
            props.setCurrentPage(1)

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
        backdrop="static"
        >
        <Modal.Header closeButton>
            <Modal.Title>Comfirm Delete Product ?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure to delete this Product 
            <b> {dataUpdate && dataUpdate.name ? dataUpdate.name:""}</b>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                    Cancel
            </Button>
            <Button variant="primary" onClick={()=>handleSubmitDeleteProduct()}>
                    Delete
            </Button>
        </Modal.Footer>
        </Modal>
        </>
    )
}   
export default ModalDeleteProduct