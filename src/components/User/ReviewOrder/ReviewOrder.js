import { useEffect, useState } from 'react'
import './ReviewOrder.scss'

const ReviewOrder =() =>{

    const [number ,setNumber]=useState("")
    const [roadName ,setRoadName] =useState("")
    const [province ,setProvince]=useState("")
    const [district ,setDistrict]=useState("")
    const [ward ,setWard]=useState("")

    const [listProvince ,setListProvince] =useState([])
    const [listDistrict ,setListDistrict]= useState([])
    const [listWard ,setListWard]=useState([])

    

    useEffect(()=>{  
        fetchProvince();  
       
    },[])

    useEffect(()=>{  
            if(province)
                fetchDistrict(province)
        },[province])

    useEffect(()=>{  
            if(district)
                fetchWard(district)
        },[district])

    const fetchProvince =async() =>{
        let res = await fetch('https://provinces.open-api.vn/api/p/') 
        const data =await res.json(); //chuyển respone thành dữ liệu json
        setListProvince(data)
    }

    const fetchDistrict =async(province) =>{
        let res = await fetch(`https://provinces.open-api.vn/api/p/${province}?depth=2`)
        const data =await res.json()
        setListDistrict(data.districts)
    }

    const fetchWard =async(district) =>{
        let res = await fetch(`https://provinces.open-api.vn/api/d/${district}?depth=2`)
        const data =await res.json()
        setListWard(data.wards)
    }

    return(
        <>
            <div className="manage-container">
                <div className="title">
                    Review Order
                </div>
                <div className='review-order-content'>
                    <div className='infor-user'>
                        <div className='title-user'>
                            User Information
                        </div>
                        <div className='input-information-user'>
                             <div>
                                <label>Number :</label>
                                <input type="text" value={number} onChange={(event) =>setNumber(event.target.value)}/>
                            </div>
                            <div>
                                <label>Address :</label>
                                <input type="text" value={roadName} onChange={(event)=>setRoadName(event.target.value)}/>
                            </div>
                            <div>
                                <label>Province :</label>
                                <select value={province} onChange={(event) =>setProvince(event.target.value)}>
                                    <option value="">--Choose Province--</option>
                                    {listProvince.map((item,index)=>{
                                       return <option key={index} value={item.code}>{item.name}</option>
                                      })
                                    }
                                </select>
                            </div>
                            <div>
                                <label>District :</label>
                                <select value={district} onChange={(event) =>setDistrict(event.target.value)}>
                                    <option value="">--Choose District--</option>
                                    {listDistrict.map((item,index)=>{
                                        return <option key={index} value={item.code}>{item.name}</option>
                                    })}
                                </select>
                            </div>
                            <div>
                                <label>Ward/Commune :</label>
                                <select value={ward} onChange={(event) =>setWard(event.target.value)}>
                                    <option value="">--Choose Ward/Commue--</option>
                                     <option value="">--Choose Province--</option>
                                    {listWard.map((item,index)=>{
                                       return <option key={index} value={item.code}>{item.name}</option>
                                      })
                                    }
                                </select>
                            </div>
                             <div>
                                <label>Note :</label>
                                <input type="text"/>
                            </div>
                        </div>
                    </div>
                    <div className='infor-product'>
                        v
                    </div>
                </div>
            </div>
        </>
    )
}
export default ReviewOrder