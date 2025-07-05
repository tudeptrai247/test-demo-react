import { Modal } from "react-bootstrap"
import Button from 'react-bootstrap/Button';
import {deleteCategory} from '../../../../service/apiService'
import { toast } from "react-toastify";


const ModalDeleteCategory =(props) =>{

    const {show ,setShow , dataUpdate} =props;

    const handleClose =() =>{
        setShow(false)
    }

    const handleSubmitDeleteCategory =async() =>{
        let data = await deleteCategory(dataUpdate.id);
        if(data && data.EC ===2){
            toast.warning(data.message)
            handleClose()
            return
        }
        if(data && data.EC ===0){
            toast.success(data.message)
            handleClose()
            props.setCurrentPage(1)
            await props.fetchListCategoryWithPaginate(1)
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
                <Modal.Title>Confirm Delete Category ?</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure to delete this Category
                <b> {dataUpdate && dataUpdate.category ? dataUpdate.category : " "}</b>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={() =>handleSubmitDeleteCategory()}>
                    Confirm
                </Button>
            </Modal.Footer>
            </Modal>
        </>
    )
}
export default ModalDeleteCategory