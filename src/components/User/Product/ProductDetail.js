import { Button } from 'react-bootstrap';
import { FiPlus } from "react-icons/fi";
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import {  useState } from 'react';
import { toast } from "react-toastify";
import {postCreateNewCart} from "../../../service/apiService"
import { useNavigate } from 'react-router-dom';



const ProductDetail =(props) =>{


    const {show , setShow ,detailProduct} = props

    const [selectSize , setSelectSize]=useState(null) //khởi tạo object rỗng
    const [selectQuantity ,setSelectQuantity] =useState("")
    const [currentStock , setCurrentStock] =useState("") // currentStock là số lượng tồn kho của size đó

    const navigate =useNavigate()

    const handleClose =() =>{
        setShow(false)
        setSelectSize("")
        setCurrentStock("")
        setSelectQuantity("")
    }

    const handleSetSelectSize =(sizeObj)=>{
        setSelectSize(sizeObj)  // sẽ lưu cả size , id size và quantity
        setCurrentStock(sizeObj.quantity) // lấy số lượng của size đang chọn
    }

    const handleAddCart =async()=>{
        const storedAccount =localStorage.getItem("account");
        const user =JSON.parse(storedAccount) // lấy account từ trong redux ra


        const itemAdd ={
            product_id:detailProduct.id,   //id là idproduct
            unit_price:detailProduct.price,
            size_id:selectSize.size_id,
            quantity:parseInt(selectQuantity),
            user_id:user?.id
        }
        if(!user){
                toast.error("Plese Login Before Add To Cart")
                return;
            }
    let res = await postCreateNewCart(itemAdd)
    if(res.EC ===2){
        toast.error(res.message)
        return;
    }
    
    if(res && res.EC ===0){
        toast.success("Add To Cart")
        navigate("/cart")
        handleClose()
    }
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
                    {selectSize && selectSize.size &&(
                        <p>
                            Stock Available : <strong>{currentStock} Product</strong> For Size : <strong>{selectSize.size}</strong>
                        </p>
                    )}
                    
                    <p>Price:{detailProduct.price}</p>
                     <p>Description:{detailProduct.description}</p>
                     <div className='content-size-quantity'>
                      <Dropdown >
                            <Dropdown.Toggle variant="info" id="dropdown-basic" className='btn-sm custom-dropdown'>
                                {selectSize ? selectSize.size : "Choosen Size"}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {detailProduct.size_quantity && detailProduct.size_quantity.map((item,index) =>(
                                    <Dropdown.Item key={index}  onClick={()=>handleSetSelectSize(item)}>{item.size}</Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                        {
                         selectSize ?
                        <input type='number' placeholder='Enter Quantity'value={selectQuantity}
                         onChange={(event)=>setSelectQuantity(event.target.value)} 
                         min="1" max={currentStock}
                         /> :""
                         }
                        </div>
                    <br/>
                    <Button className='mx-2' onClick={handleAddCart}><FiPlus />Add To Cart</Button>
                </div>
                
            </Modal.Body>
        </Modal>
        </>
    )
}
export default ProductDetail