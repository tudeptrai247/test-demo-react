import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { putUpdateCategory, putUpdateProduct } from '../../../../service/apiService';
import { toast } from 'react-toastify';
import _ from 'lodash';
import {getAllCategory,getAllSize,getAllBrand,postCreateNewProduct} from "../../../../service/apiService";
import { FiPlus } from "react-icons/fi";
import './ManageProduct.scss'



const ModalUpdateProduct =(props) =>{


    const {show , setShow , dataUpdate}=props

    const [name,setName] =useState("")
    const [size,setSize]=useState("")
    const [brand,setBrand]=useState("")
    const [category,setCategory]=useState("")
    const [price,setPrice]=useState("")
    const [description ,setDescription]=useState("")
    const [image,setImage]=useState("")
    const [prevImage , setPrevImage] =useState("")

     const [listSize ,setListSize]=useState([])
    const [listBrand,setListBrand]=useState([])
    const [listCategory,setListCategory]=useState([])

     useEffect(()=>{
        if(!_.isEmpty(dataUpdate)){
            setName(dataUpdate.name)
            setSize(dataUpdate.idsize)
            setBrand(dataUpdate.idbrand)
            setCategory(dataUpdate.idcategory)
            setPrice(dataUpdate.price)
            setDescription(dataUpdate.description)
            setPrevImage(`http://localhost:8081/uploads/${dataUpdate.image}`)
        }
    },[dataUpdate])    

     useEffect(()=>{
        fetchData(); 
    },[]) // [] ko có dependencies sẽ gọi 1 lần

const fetchData = async()=>{
            const resSize = await getAllSize();
            if(resSize.EC ===0) setListSize(resSize.size)

            const resBrand =await getAllBrand();
            if(resBrand.EC ===0) setListBrand(resBrand.brand)

            const resCategory = await getAllCategory();
            if(resCategory.EC ===0) setListCategory(resCategory.category)

        };

    
    const handleClose =()=>{
        setShow(false)
        setName("")
        setSize("")
        setBrand("")
        setCategory("")
        setPrice("")
        setDescription("")
        setImage("")
        setPrevImage("")
        props.dataUpdateResert()
    }

    const handleUpLoadImage =(event) =>{
    if(event.target && event.target.files && event.target.files[0]){    
        setPrevImage(URL.createObjectURL(event.target.files[0]))
        setImage(event.target.files[0])
        
     }
    }

    const handleSubmitUpdateProduct =async() =>{

         if(name==="" || size==="" || brand==="" || category==="" || price==="" || description==="" || image===""){
            toast.error("Please Fill All Information")
            return
        }

        const formData=new FormData();
        formData.append("name", name);
        formData.append("idsize", size);
        formData.append("idbrand", brand);
        formData.append("idcategory", category);
        formData.append("price", price);
        formData.append("description", description);
        formData.append("image", image);
        formData.append("id", dataUpdate.id);

        let data= await putUpdateProduct(formData)
        console.log('check data update',data)
        if(data?.EC===0){
            toast.success(data.message)
            handleClose()
            props.fetchListProductWithPaginate(1)
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
              className='modal-add-product'
            >
                  <Modal.Header closeButton>
          <Modal.Title>Update Category Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
         <form className="row g-3">
                    <div className="col-md-6">
                        <label  className="form-label">Name Product</label>
                        <input type="text" className="form-control" value={name} onChange={(event) =>setName(event.target.value)} />
                    </div>
                    <div className="col-md-2">
                        <label  className="form-label">Size</label>
                        <select className="form-control" value={size} onChange={(event) =>setSize(event.target.value)}>
                            <option value="">--Select Size--</option>
                            {listSize.map((item,index)=>{
                               return <option key={index} value={item.id}>{item.size}</option>
                            })}
                        </select>
                    </div>
                    <div className="col-md-2">
                        <label  className="form-label">Brand</label>
                        <select className="form-control" value={brand} onChange={(event) =>setBrand(event.target.value)}>
                            <option value="">--Select Brand--</option>
                            {listBrand.map((item,index)=>{
                               return <option key={index} value={item.id}>{item.brand}</option>
                            })}
                        </select>
                    </div>
                    <div className="col-md-2">
                        <label  className="form-label">Category </label>
                        <select className="form-control" value={category} onChange={(event) =>setCategory(event.target.value)}>
                            <option value="">--Select Category--</option>
                            {listCategory.map((item,index)=>{
                               return <option key={index} value={item.id}>{item.category}</option>
                            })}
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label  className="form-label">Price</label>
                        <input type="text" className="form-control" value={price} onChange={(event) =>setPrice(event.target.value)} />
                    </div>
                    <div className="col-md-8">
                        <label  className="form-label">Description</label>
                        <input type="text" className="form-control" value={description} onChange={(event) =>setDescription(event.target.value)} />
                    </div>
                    <div className="col-md-12 ">
                        <label  className="form-label lable-upload" htmlFor='lableUpload'><FiPlus />Upload Image Product</label>
                        <input type="file" id='lableUpload'
                        onChange={(event)=>handleUpLoadImage(event)}
                         hidden
                         />
                    </div>
                    <div className="col-md-12 img-review">
                        {prevImage ? <img src={prevImage}/>
                                    :   
                                    <span>Preview Image</span>
                        }
                    </div>
                </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() =>handleSubmitUpdateProduct()}>
            Save
          </Button>
        </Modal.Footer>  
            </Modal>
        </>
    )
}
export default ModalUpdateProduct