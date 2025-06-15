import { useEffect, useState } from "react"
import {getProductBestSelling} from "../../../service/apiService"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Tooltip } from "recharts"

const BestSellingRechart = (props) =>{
    const [data ,setData ]= useState([])

    useEffect(()=>{
        const fetchDataBestProductSelling = async() =>{
            try{
            const res = await getProductBestSelling();
            setData(res)
            }catch(err){
                console.error("faild to fetch ProductBestSelling" ,err)
            }
        };
        fetchDataBestProductSelling();
    },[])

    return(
        <div className="best-selling-chart-container">
            <h3>Best Selling Product</h3>
            <ResponsiveContainer  width={500} height={300}>
                <BarChart data={data} margin={{top:20 ,right:40,left:30 ,bottom:5}}>
                    <CartesianGrid strokeDasharray="2 2" />
                    {/* hiện thị tên sản phẩm theo trục X */}
                    <XAxis dataKey="name"/>  
                    <YAxis />
                    {/* tooltip hiện thị thông tin  */}
                    <Tooltip />
                    <Bar dataKey="total_sold" fill="#8884d8"/>
                </BarChart>
            </ResponsiveContainer>

        </div>
    )
}
export default BestSellingRechart