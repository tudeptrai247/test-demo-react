import { Modal } from "react-bootstrap"
import Button from 'react-bootstrap/Button';
import { deleteSoftReceipt } from "../../../../service/apiService";
import { toast } from "react-toastify";


const ModalDeleteSoftReceipt =(props) =>{

    const {show ,setShow ,dataReceipt}= props

    const handleClose =() =>{
        setShow(false)
    }
    

    const handleSubmitDeleteReceipt =async() =>{
        const changeStatus = dataReceipt.status ===1 ?0 : 1;
        let data =await deleteSoftReceipt(dataReceipt.receipt_id,changeStatus)
        if(data && data.EC===0){
            toast.success(data.message)
            handleClose()
            props.fetchListReceiptWithPaginate(1)
            props.setCurrentPage(1)
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
                <Modal.Title>Confirm Delete Receipt ?</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure to delete this Receipt
                <b> {dataReceipt && dataReceipt.receipt_id ? dataReceipt.receipt_id : " "}</b>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={() =>handleSubmitDeleteReceipt()}>
                    Confirm
                </Button>
            </Modal.Footer>
            </Modal>
        </>
    )
}
export default ModalDeleteSoftReceipt