import { Modal } from "react-bootstrap"
import {FiEdit} from "react-icons/fi"

const ModalShowRuleDiscount =(props) =>{

    const {show, setShow}= props;

    const handleClose =()=>{
        setShow(false)
    }
    return(
        <>
        <Modal
        show ={show}
        onHide={handleClose}
        size="sm"
        backdrop="static"
        className="modal-rule-discount"
        >
            <Modal.Header closeButton style={{fontSize: '30px' , fontWeight:"bold"}}>Rule Discount</Modal.Header>
            <Modal.Title></Modal.Title>
            <Modal.Body>
                <FiEdit /> Discounts based on order total:
                     500,000 VND → 10,000 VND off
                     1,000,000 VND → 20,000 VND off
                     2,000,000 VND → 30,000 VND off
            </Modal.Body>
        </Modal>
        </>
    )
}
export default ModalShowRuleDiscount