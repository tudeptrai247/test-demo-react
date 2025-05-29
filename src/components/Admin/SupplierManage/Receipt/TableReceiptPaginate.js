import ReactPaginate from "react-paginate"


const TableReceiptPaginate =(props) =>{

    const {listReceipt,pageCount }=props

    const handlePageClick =(event) =>{
        props.fetchListReceiptWithPaginate(+event.selected +1);
        props.setCurrentPage(+event.selected +1)
    }

    return(
        <>
        <table className="table table-hover table-bordered">
            <thead>
            <tr>
                <th scope="col">No</th>
                <th scope="col">Receipt Date</th>
                <th scope="col">Note</th>
                <th scope="col">Supplier</th>
                <th scope="col">Action</th>
            </tr>
            </thead>
        
        <tbody>
        {listReceipt && listReceipt.length >0 &&
        listReceipt.map((item,index)=>{
            return(
                <tr key={`table-receipt-${index}`}>
                        <th>{item.receipt_id}</th>
                        <td>{item.receipt_date}</td>
                        <td>{item.note}</td>
                        <td>{item.name}</td>
                        <td>
                            <button className="btn btn-btn btn-warning mx-3"
                            onClick={()=>props.handleClickBtnView(item)}
                            > 
                                View Receipt Detail
                            </button>
                             <button className="btn btn-danger"
                             onClick={() =>props.handleClickBtnDeleteSoft(item)}
                             > 
                                Delete
                            </button>
                        </td>
                </tr>
            )
        })
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
export default TableReceiptPaginate