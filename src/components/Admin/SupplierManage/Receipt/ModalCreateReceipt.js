import { useEffect, useState } from "react"
import { Button, Modal } from "react-bootstrap"
import {getAllSupplier,getAllSize,getAllProduct,postCreateNewReceipt} from "../../../../service/apiService";
import { toast } from "react-toastify";
import { findIndex } from "lodash";


const ModalCreateReceipt =(props) =>{

    const {show , setShow} = props

    const [item ,setItem]=useState([])

    const [supplier ,setSupplier]= useState("")
    const [product ,setProduct]=useState("")
    const [size , setSize]=useState("")
    const [quantity , setQuantity] =useState("")
    const [unitprice,setUnitprice]=useState("")
    const [note ,setNote]=useState("")

    const [listSize ,setListSize]=useState([]);
    const [listProduct,setListProduct]=useState([]);
    const [listSupplier ,setListSupplier]=useState([]);

    useEffect(()=>{
        fetchData();
    },[])

    const fetchData =async()=>{
         const resSize = await getAllSize();
            if(resSize.EC ===0) setListSize(resSize.size)
        const resProduct = await getAllProduct();
            if(resProduct.EC ===0) setListProduct(resProduct.product)
        const resSupplier = await getAllSupplier();
            if(resSupplier.EC ===0) setListSupplier(resSupplier.supplier)
    }

    const handleClose =() =>{
        setShow(false)
        setSupplier("")
        setProduct("")
        setSize("")
        setQuantity("")
        setUnitprice("")
        setNote("")
        setItem([])
    }

    const handleSubmitCreateReceipt =async() =>{
        if(!supplier || item.length ==0){
            toast.error("Please Fill All Information")
            return;
        }
        let data= await postCreateNewReceipt(supplier,note,item)
        if(data && data.EC ===0){
            toast.success(data.message)
            handleClose();
            props.fetchListReceiptWithPaginate(1)
            props.setCurrentPage(1)
        }
    }

    const handleAddMoreProduct =() =>{
        if(!product || !size ||!quantity || !unitprice){
            toast.error("Please Fill All Information")
            return;
        }

        const index =item.findIndex(
            (i)=> i.product_id === product && i.size_id=== size 
        )
        
        // [0] tìm ra phần tử đầu tiên trùng rồi lấy số lượng của cái cũ cộng cho cái mới
        if(index === 0){
            const updateQuantity =[...item];
            updateQuantity[0].quantity=updateQuantity[0].quantity + parseInt(quantity);

            const updateUnitPrice =[...item];
            updateUnitPrice[0].unit_price= unitprice
            
            setQuantity(updateQuantity)
            setUnitprice(updateUnitPrice)

            // xét rỗng và return lại ngay
            setProduct("");setSize("");setQuantity("");setUnitprice("")
            return
        }



        const newItem = {
            product_id :product,
            size_id :size,
            quantity :parseInt(quantity), // ko ép kiểu nó sẽ ra kiểu chuỗi
            unit_price:unitprice

        };
        
        setItem([...item,newItem]);// trải các phần tử đã có trong item , gắn thêm các giá trị mới vào newItem vào cuối , kq là sẽ có các sản phẩm cũ và mới
        setProduct("");setSize("");setQuantity("");setUnitprice("")
    }

    const handleRemoveListItem =(index) =>{
        const newList=[...item]; // ko được thay đổi trực tiếp lên state , phải tạo 1 bảng sao
            newList.splice(index,1)       
            setItem(newList)
    }

    return(
        <>
            <Modal
            show={show}
            onHide={handleClose}
            size="xl"
            backdrop="static"
            className='modal-add-receipt'
            >
            <Modal.Header closeButton>
                <Modal.Title>Add New Receipt</Modal.Title>
            </Modal.Header>
        <Modal.Body>           
            <form className="row g-3">
                <div className="col-md-2">
                    <label className="form-lable">Supplier Name</label>
                    <select className="form-control" value={supplier} onChange={(event)=>setSupplier(event.target.value)}>
                        <option>--Select Supplier--</option>
                        {listSupplier.map((item,index)=>{
                            return <option key={index} value={item.id}>{item.name}</option>
                        })}
                    </select>
                </div>
                <div className="col-md-3">
                    <label className="form-lable">Product Name</label>
                    <select className="form-control" value={product} onChange={(event)=>setProduct(event.target.value)}>
                        <option>--Select Product--</option>
                        {listProduct.map((item,index)=>{
                            return <option key={index} value={item.id}>{item.name}</option> // nameproduct
                        })}
                    </select>
                </div>
                <div className="col-md-3">
                    <label className="form-lable">Size</label>
                    <select className="form-control" value={size} onChange={(event)=>setSize(event.target.value)}>
                        <option>--Select Size--</option>
                        {listSize.map((item,index)=>{
                            return <option key={index} value={item.id}>{item.size}</option>
                        })}
                    </select>
                </div>
                <div className="col-md-3">
                    <label className="form-lable">Quantity</label>
                    <input type="text" className="form-control" value={quantity} onChange={(event)=>setQuantity(event.target.value)}></input>
                </div>
                <div className="col-md-3">
                    <label className="form-lable">Unit Price</label>
                    <input type="text" className="form-control" value={unitprice} onChange={(event)=>setUnitprice(event.target.value)}></input>
                </div>
                <div className="col-md-9">
                    <label className="form-lable">Note</label>
                    <input type="text" className="form-control" value={note} onChange={(event)=>setNote(event.target.value)}></input>
                </div>
                <div className="add-more-product">
                    <Button variant="success" onClick={() =>handleAddMoreProduct()}>Add More Product</Button>
                </div>
            </form>
            <table className="table table-hover table-bordered">
            <thead>
            <tr>
                <th scope="col">Product</th>
                <th scope="col">Size</th>
                <th scope="col">Quantity</th>
                <th scope="col">Unit Price</th>
                <th scope="col">Action</th>
            </tr>
            </thead>
        
        <tbody>
        {
        item.map((item,index)=>{
            const productName = listProduct.find(p => p.id === parseInt(item.product_id))?.name || 'Unknow'; // so sánh nếu id của mảng item = id của mảng listProduct nếu có thì lấy cái object name ra ?. giúp trảnh lỗi undefinded
            const productSize = listSize.find(s => s.id === parseInt(item.size_id))?.size || 'Unknow';
            return(
                <tr key={`table-receipt-${index}`}>
                        <th>{productName}</th>
                        <td>{productSize}</td>
                        <td>{item.quantity}</td>
                        <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.unit_price)}</td>
                        <td>
                            <button className="btn btn-btn btn-warning mx-3"
                            onClick={()=>handleRemoveListItem(index)}
                            > 
                               Delete Item
                            </button>
                            
                        </td>
                </tr>
            )
        })
        }
        </tbody>
        </table>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary">
                Close
            </Button>
            <Button variant="primary" onClick={()=>handleSubmitCreateReceipt()}>
                Save
            </Button>
        </Modal.Footer>
    </Modal>
        </>
    )
}
export default ModalCreateReceipt