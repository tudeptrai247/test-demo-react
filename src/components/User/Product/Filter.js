import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import {getAllCategory,getAllBrand,getProductFilter} from "../../../service/apiService";


const Category =(props) =>{

    const {setListProduct} =useState

    const [listBrand,setListBrand]=useState([])
    const [listCategory,setListCategory]=useState([])
    const [brand,setBrand]=useState("")
    const [category,setCategory]=useState("")

    const {keyword} = props

   const handleFilter = async() =>{
        const params = new URLSearchParams();

        if(brand) params.append("brand",brand);
        if(category) params.append("category",category)
        if(keyword) params.append("keyword",keyword)

        let res = await getProductFilter(params.toString())
        if(res && res.EC===0){
            console.log(res.DT.product)
            props.setListProduct(res.DT.product)
            props.setCurrentPage(1)
        }
    }

    useEffect(()=>{
        const fetchData = async()=>{
       

            const resBrand =await getAllBrand();
            if(resBrand.EC ===0) setListBrand(resBrand.brand)

            const resCategory = await getAllCategory();
            if(resCategory.EC ===0) setListCategory(resCategory.category)

        };
        fetchData(); // gọi lại hàm này để chạy , vì có async nên phải định nghĩa lại hàm
    },[])

    


    return(
        <>
            <div className='filter-tittle'>
                Filter
            </div>
            <div className='filter-content'>
                <Form.Select size="lg" value={brand} onChange={(event)=>setBrand(event.target.value)}>
                        <option value="">--Select Brand--</option>
                        {listBrand.map((item,index)=>{
                       return <option key={index} value={item.id}>{item.brand}</option>
                    })}
                </Form.Select>
                    <br />
                <Form.Select size="lg" value={category} onChange={(event)=>setCategory(event.target.value)}>
                        <option value="">--Select Category--</option>
                        {listCategory.map((item,index)=>{
                       return <option key={index} value={item.id}>{item.category}</option>
                    })}
                </Form.Select>
                   
                    <br />
                <Button variant="secondary" onClick={() =>handleFilter()}>Filter</Button>
        </div>
        
        
        </>
    )
}
export default Category