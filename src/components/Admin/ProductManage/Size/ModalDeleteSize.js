import { Modal } from "react-bootstrap"
import Button from 'react-bootstrap/Button';
import {deleteSize} from '../../../../service/apiService'
import { toast } from "react-toastify";

const ModalDeleteSize = (props) =>{

    const {show , setShow , dataUpdate} = props

    const handleClose =() =>{setShow(false)}

    const handleSubmitDeleteSize =async() =>{
        let data = await deleteSize(dataUpdate.id);

        if(data && data.EC ===2){
            toast.warning(data.message)
            handleClose()
            return
        }
        
        if(data && data.EC ===0){
            toast.success(data.message)
            handleClose()
            props.setCurrentPage(1)
            await props.fetchListSizeWithPaginate(1)
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
            <Modal.Title>Confirm Delete Size ?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure to delete this Size
            <b> {dataUpdate && dataUpdate.size ? dataUpdate.size : " "}</b>
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
export default ModalDeleteSize