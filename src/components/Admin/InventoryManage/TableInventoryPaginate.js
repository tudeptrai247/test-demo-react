const TableInventoryPaginate =(props) =>{

    const {listInventory}=props

    return(
        <>
          <table className="table table-hover table-bordered" >
            <thead>
                <tr>
                    <th scope="col">No</th>
                    <th scope="col">Product Name</th>
                    <th scope="col">Size</th>
                    <th scope="col">Quantity</th>
                </tr>
            </thead>
        <tbody>
            
            {listInventory && listInventory.length >0 &&
            
            listInventory.map((item,index)=>{
                return(
                    <tr key={`table-size-${index}`}>
                        <th>{item.inventory_id}</th>
                        <td>{item.name}</td>
                        <td>{item.size}</td>
                        <td>{item.quantity}</td>
                    </tr>
                )
            })
            }
            {listInventory && listInventory.length ==0 &&
            <tr>
                <td colSpan={'4'}>Not Found Data</td>
            </tr>
            }
            </tbody>
        </table>
        </>
    )
}
export default TableInventoryPaginate