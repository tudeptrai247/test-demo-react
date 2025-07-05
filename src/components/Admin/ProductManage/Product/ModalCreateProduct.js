import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { FiPlus } from "react-icons/fi";
import {getAllCategory,getAllBrand,postCreateNewProduct} from "../../../../service/apiService";
import { toast } from 'react-toastify';

 // trong sản phẩm ko cần dùng size 
 const ModalCreateProduct =(props) =>{

    useEffect(()=>{
        const fetchData = async()=>{

            const resBrand =await getAllBrand();
            if(resBrand.EC ===0) setListBrand(resBrand.brand)

            const resCategory = await getAllCategory();
            if(resCategory.EC ===0) setListCategory(resCategory.category)

        };
        fetchData(); // gọi lại hàm này để chạy , vì có async nên phải định nghĩa lại hàm
    },[])

    const {show , setShow} = props

    const [name,setName] =useState("")
    const [brand,setBrand]=useState("")
    const [category,setCategory]=useState("")
    const [price,setPrice]=useState("")
    const [description ,setDescription]=useState("")
    const [image,setImage]=useState("")

    const [listBrand,setListBrand]=useState([])
    const [listCategory,setListCategory]=useState([])

    const [prevImage , setPrevImage] =useState("")

    const handleClose =() =>{
        setShow(false)
        setName("")
        setBrand("")
        setCategory("")
        setPrice("")
        setDescription("")
        setImage("")
        setPrevImage("")
    }

    const handleUpLoadImage =(event) =>{
        const file = event.target?.files?.[0];
        if(file){   
        const allowType =['image/jpeg','image/png','image/webp','image/jpg'];
        if(!allowType.includes(file.type)){
            toast.error("Invalid File Type , Please Choosen jpeg , png , webp , jpg")
            return
        }
        //tạo url tạm thời cho ảnh 
        setPrevImage(URL.createObjectURL(file))
        setImage(file)
     }
    }

    const handleSubmitCreateProduct =async()=>{
           
        if(name==="" || brand==="" || category==="" || price==="" || description==="" || image===""){
            toast.error("Please Fill All Information")
            return
        }
        if(isNaN(Number(price))){
            toast.error("Invalid Price")
            return
        }



        const formData=new FormData();
        formData.append("name", name);
        formData.append("brand", brand);
        formData.append("category", category);
        formData.append("price", price);
        formData.append("description", description);
        formData.append("image", image);

           
           let data = await postCreateNewProduct(formData);
           console.log('<< component res :' , data)
           if(data?.EC === 0){ // ? dùng để kiểm tra data có tồn tại ko trước khi truy cập EC
            toast.success(data.message);
            handleClose();
            props.setCurrentPage(1);
            props.fetchListProductWithPaginate(1)
           }
        
           if(data && data.EC != 0){
            toast.error("Error");
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
                
            </Modal.Header>
            <Modal.Body>
        <form className="row g-3">
            <div className="col-md-6">
                <label  className="form-label">Name Product</label>
                <input type="text" className="form-control" value={name} onChange={(event) =>setName(event.target.value)} />
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
            <Button variant="primary" onClick={()=>{handleSubmitCreateProduct()}}  >
                Save
            </Button>
        </Modal.Footer>
        </Modal>
        </>
    )

 }
 export default ModalCreateProduct