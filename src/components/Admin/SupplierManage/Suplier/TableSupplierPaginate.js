import ReactPaginate from "react-paginate";


const TableSupplierPaginate = (props) =>{

    const {listSupplier , pageCount} = props;

    const handlePageClick =(event) =>{
        props.fetchListSuppliersWithPaginate(+event.selected +1)
        props.setCurrentPage(+event.selected +1);
        console.log(`đang ở trang ${event.selected +1} của supplier` )
    }

    return(
        <>
            <table className="table table-hover table-bordered">
        <thead>
            <tr>
                <th scope="col">No</th>
                <th scope="col">Name Supplier</th>
                <th scope="col">Address</th>
                <th scope="col">Number</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            {listSupplier && listSupplier.length>0 &&
            
            listSupplier.map( (item,index) =>{
                return(
                <tr key={`table-supplier-${index}`}>
                    <th>{item.id}</th>
                    <td>{item.name}</td>
                    <td>{item.address}</td>
                    <td>{item.number}</td>
                    <td>
                        <button className="btn btn-secondary"
                        onClick={() =>props.handleClickBtnView(item)}
                        >
                            View
                        </button>
                        <button className="btn btn-btn btn-warning mx-3"
                        onClick={() =>props.handleClickBtnUpdate(item)}
                        >
                            Update
                        </button>
                        <button className="btn btn-danger"
                        onClick={() =>props.handleClickBtnDelete(item)}
                        >
                            Delete
                        </button>
                    </td>
                </tr>
                )
            })
        //  nếu độ dài dữ liệu =0 thì hiện thông báo
            }
        {listSupplier && listSupplier.length==0 &&
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
export default TableSupplierPaginate;