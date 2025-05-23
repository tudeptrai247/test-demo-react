import { Modal } from "react-bootstrap"
import Button from 'react-bootstrap/Button';
import { toast } from "react-toastify";
import {restoreReceipt} from "../../../../service/apiService";


const ModalRestoreReceipt =(props) =>{

    const {show ,setShow ,dataUpdate} =props

    const handleClose =() =>{
        setShow(false)
    }

    const handleSubmitRestoreReceipt =async()=>{
        const changeStatus = dataUpdate.status ===1 ?0 : 1;
        let data = await restoreReceipt(dataUpdate.receipt_id,changeStatus)
        if(data && data.EC ===0){
                toast.success(data.message)
                handleClose()
                props.fetchListDeleteReceiptWithPaginate(1)
                props.setCurrentPage(props.currentPage)
                
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
                <Modal.Title>Confirm Restore Receipt ?</Modal.Title>
            </Modal.Header>     
             <Modal.Body>Are you sure to restore this Receipt
                <b> {dataUpdate && dataUpdate.receipt_id ? dataUpdate.receipt_id : " "}</b>
            </Modal.Body>
             <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={() =>handleSubmitRestoreReceipt()}>
                    Confirm
                </Button>
            </Modal.Footer>
            </Modal>
        </>
    )
}
export default ModalRestoreReceipt