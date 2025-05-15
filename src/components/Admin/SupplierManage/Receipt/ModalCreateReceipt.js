import { useEffect, useState } from "react"
import { Button, Modal } from "react-bootstrap"
import {getAllSupplier,getAllSize,getAllProduct,postCreateNewReceipt} from "../../../../service/apiService";
import { toast } from "react-toastify";


const ModalCreateReceipt =(props) =>{

    const {show , setShow} = props

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
    }

    const handleSubmitCreateReceipt =async() =>{
        let data= await postCreateNewReceipt(supplier,product,size,quantity,unitprice,note)
        if(data && data.EC ===0){
            toast.success(data.message)
            handleClose();
            props.fetchListReceiptWithPaginate(1)
            props.setCurrentPage(1)
        }
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
            </form>
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