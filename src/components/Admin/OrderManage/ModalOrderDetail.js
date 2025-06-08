import { Modal } from "react-bootstrap"

const ModalOrderDetail =(props)=>{
     const {show ,setShow,dataUpdate} =props

    const handleClose =() =>{
        setShow(false)
    }
    return(
       <>
            <Modal
              show={show} 
              onHide={handleClose} 
              size=""
              backdrop="static"
              className='modal-order-detail'
            >
                <Modal.Header closeButton>
                <Modal.Title>Order Detail</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                     <table className="table table-hover table-bordered" >
            <thead>
                <tr>
                    <th scope="col">No</th>
                    <th scope="col">Product Name</th>
                    <th scope="col">Size</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Price</th>
                </tr>
            </thead>
        <tbody>
            
            {dataUpdate.product && dataUpdate.product.length >0 &&
            
            dataUpdate.product.map((item,index)=>{
                return(
                    <tr key={`table-size-${index}`}>
                        <th>{index +1}</th>
                        <td>{item.name_product}</td>
                        <td>{item.size}</td>
                        <td>{item.quantity}</td>
                        <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</td>

                    </tr>
                )
            })
            }
            {dataUpdate.product && dataUpdate.product.length ==0 &&
            <tr>
                <td colSpan={'4'}>Not Found Data</td>
            </tr>
            }
            </tbody>
        </table>
                </Modal.Body>
            </Modal>
            
        </>
    )
}
export default ModalOrderDetail