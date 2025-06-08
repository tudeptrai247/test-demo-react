import ReactPaginate from "react-paginate"

const TableInventoryPaginate =(props) =>{

    const {listInventory,pageCount}=props

    const handlePageClick =(event) =>{
        props.fetchListInventoryWithPaginate(+event.selected +1)
        props.setCurrentPage(+event.selected +1)
    }

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
        <div className="user-paginate">  
        <ReactPaginate
         nextLabel="next >"
         onPageChange={handlePageClick}
         pageRangeDisplayed={3}
         marginPagesDisplayed={2}
         pageCount={pageCount}
         previousLabel="< previous"
         pageClassName="page-item"
         pageLinkClassName="page-link"
         previousClassName="page-item"
         previousLinkClassName="page-link"
         nextClassName="page-item"
         nextLinkClassName="page-link"
         breakLabel="..."
         breakClassName="page-item"
         breakLinkClassName="page-link"
         containerClassName="pagination"
         activeClassName="active"
         renderOnZeroPageCount={null}
         forcePage={props.currentPage -1}   
       />
        </div>
        </>
    )
}
export default TableInventoryPaginate