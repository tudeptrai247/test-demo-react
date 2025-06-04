import Modal from 'react-bootstrap/Modal';

const ModalOrderDetail =(props) =>{

    const {show ,setShow,dataUpdate} =props

    const handleClose =() =>{
        setShow(false)
    }
    return(
        <>
            <Modal
              show={show} 
              onHide={handleClose} 
              size="xl"
              backdrop="static"
              className='modal-order-detail'
            >
                <Modal.Header closeButton>
                <Modal.Title>Order Detail</Modal.Title>
                </Modal.Header>
            </Modal>
        </>
    )
}
export default ModalOrderDetail