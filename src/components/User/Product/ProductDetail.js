import { Button } from 'react-bootstrap';
import { FiPlus } from "react-icons/fi";

import Modal from 'react-bootstrap/Modal';

const ProductDetail =(props) =>{

    const {show , setShow ,detailProduct} = props

    const handleClose =() =>{
        setShow(false)
    }

    return(
        <>
        <Modal
        show={show}
        onHide={handleClose}
        size='xl'
        backdrop="static"
        className='modal-detail-product'
        >   
            <Modal.Header closeButton >
                <Modal.Title>Detail Product</Modal.Title>
            </Modal.Header>
            <Modal.Body >
                <div className='product-image'>
                    <img src={`http://localhost:8081/uploads/${detailProduct.image}`}  />
                </div>
                <div className='product-infor'>
                    <h5>{detailProduct.name}</h5>
                    <p>Brand :{detailProduct.brand}</p>
                    <p>Category :{detailProduct.category}</p>
                    <p>Price:{detailProduct.price}</p>
                     <p>Description:{detailProduct.description}</p>
                    
                    <Button className='mx-2'><FiPlus />Add To Cart</Button>
                </div>
                
            </Modal.Body>
        </Modal>
        </>
    )
}
export default ProductDetail