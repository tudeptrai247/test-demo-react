import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { deleteSupplier } from '../../../../service/apiService';
import { toast } from 'react-toastify';


const ModalDeleteSupplier =(props) =>{

    const {show , setShow ,dataDelete} = props;

    const handleClose =() =>{setShow(false)};

    const handleSubmitDeleteSupplier = async() =>{
        let data =await deleteSupplier(dataDelete.id);
        if(data && data.EC ===2){
          toast.warning(data.message)
          handleClose()
          return
        }

        if(data && data.EC ===0){
            toast.success(data.message);
            handleClose();
            props.setCurrentPage(1); //khi xóa xong set về trang 1
            await props.fetchListSuppliersWithPaginate(1)
        }
    }

    return(
        <>
            <Modal
            show={show} 
            onHide={handleClose}
            backdrop="static"  //click ra ngoài sẽ ko đóng lại
            >
            <Modal.Header closeButton>
          <Modal.Title>Confirm Delete Supplier ?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure to delete this Supplier
            <b> {dataDelete && dataDelete.name ? dataDelete.name : " "}</b>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() =>handleSubmitDeleteSupplier()}>
            Confirm
          </Button>
        </Modal.Footer>
            </Modal>
        </>
    )
}
export default ModalDeleteSupplier