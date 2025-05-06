import { useEffect } from "react"
import ReactPaginate from "react-paginate"


const TableCategoryPaginate =(props) =>{


    const {listCategory , pageCount}=props

    const handlePageClick=(event)=>{
        props.fetchListCategoryWithPaginate(+event.selected +1);
        props.setCurrentPage(+event.selected +1);
    }

    return(
        <>
        <table className="table table-hover table-bordered" >
            <thead>
                <tr>
                    <th scope="col">No</th>
                    <th scope="col">Category Name</th>
                    <th>Action</th>
                </tr>
            </thead>
        <tbody>
            {listCategory && listCategory.length >0 &&
            
            listCategory.map((item,index)=>{
                return(
                    <tr key={`table-size-${index}`}>
                        <th>{item.id}</th>
                        <td>{item.category}</td>
                        <td>
                            
                            <button className="btn btn-btn btn-warning mx-3"
                            onClick={() =>props.handleClickBtnUpdate(item)}
                            >
                                Update
                            </button>
                            <button className="btn btn-danger"
                            onClick={() =>props.handleClickBtnDelete(item)}>
                                Delete
                            </button>
                        </td>
                    </tr>
                )
            })
            }
            {listCategory && listCategory.length ==0 &&
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
export default TableCategoryPaginate