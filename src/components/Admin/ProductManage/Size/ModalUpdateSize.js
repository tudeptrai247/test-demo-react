import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import _, { set } from 'lodash';
import { putUpdateSize } from '../../../../service/apiService';
import { toast } from 'react-toastify';


const ModalUpdateSize =(props) =>{

    const {show , setShow , dataUpdate } = props
    const [size , setSize] = useState("")

    const handleClose =() =>{
        setShow(false)
        setSize("")
        props.resertUpdateData()
    }

    useEffect(() =>{
        if(!_.isEmpty(dataUpdate)){
            setSize(dataUpdate.size)
        }
    }, [dataUpdate]) //phải có [dataUpdate] để useEffect theo dõi thay đổi

    const handleSubmitUpdateSize =async() =>{
        let data = await putUpdateSize(dataUpdate.id,size);
        if(data && data.EC === 0){
            toast.success(data.message)
            handleClose();
            await props.fetchListSizeWithPaginate(props.CurrentPage) //fetch lại trang đang hiện tại
            
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
            size="xl"
            backdrop="static"
            className='modal-add-supplier'
            >
        <Modal.Header closeButton>
          <Modal.Title>Update Size Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form className="row g-3">
            <div className="col-md-6">
                <label  className="form-label">Size</label>
                <input type="text" className="form-control" value={size} onChange={(event) =>setSize(event.target.value)} />
            </div>
            </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() =>handleSubmitUpdateSize()}>
            Save
          </Button>
        </Modal.Footer>
            </Modal>
        </>
    )
}
export default ModalUpdateSize