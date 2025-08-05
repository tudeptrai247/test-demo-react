import _ from 'lodash';
import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import {getSizeProduct ,putUpdateCartItem} from "../../../service/apiService"
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';

const ModalUpdateCart =(props) =>{

    

    const {show , setShow, dataUpdate} =props

    const [name,setName]=useState("")
    const [size,setSize]=useState("")
    const [quantity,setQuantity]=useState("")

    const [listSize , setListSize]=useState([])
    const [currentStock , setCurrentStock] =useState("") // currentStock là số lượng tồn kho của size đó
    const [selectSize , setSelectSize]=useState(null) //khởi tạo object rỗng

    useEffect(()=>{
        if(!_.isEmpty(dataUpdate)){
            setName(dataUpdate.name)
            setSize(dataUpdate.size_id)
            setQuantity(dataUpdate.quantity)

            // truyền product_id và size_id để xử lý dữ liệu khi render
            fetchDataSizeAndQuantity(dataUpdate.product_id,dataUpdate.size_id)
        }
        
        
    },[dataUpdate])

    const fetchDataSizeAndQuantity =async(product_id,selectedSizeId)=>{  //lấy ra size và số lượng của product_id hiện tại
        const resSize = await getSizeProduct(product_id);
        if(resSize.EC ===0) {setListSize(resSize.size)}
        const selectedSizeObj = resSize.size.find(item => item.size_id === selectedSizeId ) // lấy resSize.size , size là lấy trong row của BE
        setSelectSize(selectedSizeObj)
        setCurrentStock(selectedSizeObj?.quantity)        
    }

    const handleClose = () => {
    setShow(false)
    
  };

  const handleSizeChange =(selectedSizeId) =>{
        const selectedSizeObj = listSize.find(item =>item.size_id === parseInt(selectedSizeId)) // tìm trong listSize sao cho selectedSizeId của người dụng chọn bằng với size_id của object
        setSize(selectedSizeId)
        setSelectSize(selectedSizeObj) // lưu object gồm có size và số lượng của product đó vào selectSize để lấy ra hiện thị cho người dùng
        setCurrentStock(selectedSizeObj?.quantity) //lưu số lượng của sản phẩm đó
        setQuantity(1)
  }

  const handleQuantityChange =(value)=>{
    const inPutQty = parseInt(value)
    // nếu nhập ko đúng thì sẽ để trống
    if(inPutQty <0 || isNaN(inPutQty)){
        setQuantity("")
        return
    }

    // oldQUantity là số lượng SP người dùng đã đặt trong giỏ 
    const oldQuantity = parseInt(dataUpdate.quantity)

        // nếu số lượng update nhiều hơn tồn kho thì chặn lại , cập nhật lại setQuantity là số lượng trong giỏ cũ
    if(inPutQty > currentStock)
    {
        toast.warning(`Only ${currentStock} is available`)
        setQuantity(oldQuantity)

        // còn nếu số lượng không vượt mức thì setQUantity thành số lượng mới 
    }else{
        setQuantity(inPutQty)
    }
  }

  const handleSubmitUpdateCartItem =async() =>{
        if(!quantity || parseInt(quantity) <= 0 || isNaN(quantity)) {
            toast.error("Please Choose Your Quantity More 0")
            return
        }
        

        let data = await putUpdateCartItem(parseInt(dataUpdate.cart_detail_id),quantity,parseInt(size))
        if(data && data.EC ===3){
            toast.warning(data.message)
            return
        }
        if(data&& data.EC ===4){
            toast.warning(data.message)
            return
        }
        if(data&& data.EC ===5){
            toast.warning(data.message)
            return
        }
        if(data && data.EC === 0){
            toast.success(data.message)
            handleClose()
            await props.fetchListCartWithPaginate(props.currentPage)
            await props.getSumTotalCart()
        }

  }



    return(
        <>
        <Modal
        show={show} 
        onHide={handleClose} 
        size="sm"
        backdrop="static"
        className='modal-update-cart'
        >
            <Modal.Header closeButton>
          <Modal.Title className='title'>Update Cart Item</Modal.Title>
            </Modal.Header>
                <Modal.Body>
                    <div className="col-md-6">
                        <label  className="form-label">Name Product</label>
                        <input type="text" className="form-control" value={name} onChange={(event) =>setName(event.target.value)} disabled/>
                    </div>

                    <div className="col-md-2">
                        <label  className="form-label">Size</label>
                        <select className="form-control" value={size} onChange={(event) =>handleSizeChange(event.target.value)}>
                            {listSize.map((item,index)=>{
                               return <option key={index} value={item.size_id}>{item.size}</option>
                            })}
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label  className="form-label">Quantity</label>
                         <input type='number' placeholder='Enter Quantity'value={quantity}
                         onChange={(event)=>handleQuantityChange(event.target.value)}  min={1}/>
                         {/* nếu selected size tồn tại thì hiện thị */}
                         {selectSize &&(
                          <p>
                            Stock Available : <strong>{currentStock}</strong> For Size : <strong>{selectSize.size}</strong>
                        </p>)}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={()=>handleSubmitUpdateCartItem()}>
                            Save
                    </Button>
                </Modal.Footer>
        </Modal>
        </>
    )
}
export default ModalUpdateCart