import { Button, Modal } from "react-bootstrap"
import {deleteOrder} from "../../../service/apiService"
import { toast } from "react-toastify"

const ModalDeleteOrder =(props) =>{

    const {dataUpdate , show ,setShow}=props

    const handleClose =()=>{
        setShow(false)
    }

    const handleDeleteOrder =async()=>{
        let data = await deleteOrder(dataUpdate.order_id);
        console.log("delete" ,data)
        toast.success(data.message)
        handleClose()
        await props.fetchOrderWithPaginate(props.currentPage)
    }

    return(
        <>
                <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            >
            <Modal.Header closeButton>
                <Modal.Title>Confirm Delete Order ?</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure to delete this Order , Please contact our staff to confirm and process your refund.
                <b> {dataUpdate && dataUpdate.order_id ? dataUpdate.size : " "}</b>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Cancel
            </Button>
            <Button variant="primary" onClick={() =>handleDeleteOrder()}>
                Confirm
            </Button>
            </Modal.Footer>
        </Modal>
        </>
    )
}
export default ModalDeleteOrder