import { useEffect, useState } from 'react';
import {getInventorytWithPaginate} from '../../../service/apiService'
import TableInventoryPaginate from './TableInventoryPaginate'

const ManageInventory =() =>{
    const LIMIT_INVENTORY=6;
    const [currentPage ,setCurrentPage]=useState(1)
    const [pageCount ,setPageCount]=useState(0)
    const [listInventory , setListInventory]=useState([])

    useEffect(() =>{
        fetchListInventoryWithPaginate(1)
    },[])

    const fetchListInventoryWithPaginate = async(page) =>{
        let res = await getInventorytWithPaginate(page,LIMIT_INVENTORY)
        if(res && res.EC ===0){
            setListInventory(res.DT.inventory)
            setPageCount(res.DT.totalPages)
        }
    }

    return(
        <>
            <div className="manage-container">
                <div className="title">
                    Manage Inventory
                </div>
                <div className="table-inventory-container">
                    <TableInventoryPaginate
                        fetchListInventoryWithPaginate={fetchListInventoryWithPaginate}
                        listInventory={listInventory}
                        pageCount={pageCount}
                        currentPage={currentPage}
                    />
                </div>
            </div>
        </>
    )
}
export default ManageInventory