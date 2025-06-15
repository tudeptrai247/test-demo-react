import Filter from './Filter';
import './Product.scss'
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useEffect, useState } from 'react';
import { getProductUserWithPaginate ,getSearchProduct } from "../../../service/apiService";
import ReactPaginate from "react-paginate"
import ProductDetail from './ProductDetail';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';


const Product =() =>{

    const LIMIT_PRODUCT=20;

    const[listProduct ,setListProduct] =useState([])
    const [pageCount,setPageCount]=useState(0)
    const [currentPage,setCurrentPage]=useState(1)
    const [detailProduct , setDetailProduct]=useState("")
    const [showModalProductDetail , setShowModalProductDetail] = useState(false)
    const [keyword ,setKeyWord] =useState("")

    

    
    useEffect(()=>{
            fetchListProductWithPaginate(1)
        },[])

    const handlePageClick=(event)=>{
        fetchListProductWithPaginate(+event.selected +1);
        setCurrentPage(+event.selected +1);
    }

    const fetchListProductWithPaginate =async(page) =>{
        let res = await getProductUserWithPaginate(page,LIMIT_PRODUCT);
        console.log('data res product user',res)
        if(res.EC===0){
            setListProduct(res.DT.product)
            setPageCount(res.DT.totalPages)
        }
    }

    const handleShowDetailProduct =(product) =>{
        console.log('detail product', product)
        setShowModalProductDetail(true)
        setDetailProduct(product)
    }

    const handleSearchSubmit =async() =>{
        const params = new URLSearchParams();

        if(keyword){
            params.append("keyword" , keyword)
        }
        else{
            fetchListProductWithPaginate(1)
        }

        let res = await getSearchProduct(params.toString())
        if(res &&res.EC === 0){
            setListProduct(res.DT.product)
            setCurrentPage(1)
        }
    }

    

    return(
        <>
            <div className="product-container">
                <div className="tittle-product">Product</div>
                <div className='main-content'>
                    <div className="filter-container">
                        <div className='search-product'>
                            <div className='title-search'>
                                <p>Searching Product</p>
                            </div>
                            <input type='text' placeholder='searching product' value={keyword} onChange={(event)=>setKeyWord(event.target.value)} />
                            <div className='button-search' >
                                <Button variant="secondary" onClick={() =>handleSearchSubmit()}>Search</Button>
                            </div>
                        </div>
                        <Filter
                        setListProduct={setListProduct}
                        setCurrentPage={setCurrentPage}
                        keyword={keyword}
                        />
                    </div>
                    <div className="product-content">
                        <Container>
                        <Row>
                            {listProduct.map((item,index)=>{
                                return(
                            <Col md={3} key={index}>
                                <div className='card'>
                                    <img src={`http://localhost:8081/uploads/${item.image}`} onClick={()=>handleShowDetailProduct(item)}/>
                                </div>
                                <div className='content-card'>
                                    <h5>{item.name}</h5>
                                    <p>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</p>
                                </div>
                            </Col>
                            )
                            })}
                        </Row>
                    </Container>
                    </div>
                </div>
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
         forcePage={currentPage -1}   
       />
        </div>
    </div>
    <ProductDetail
        show={showModalProductDetail}
        setShow={setShowModalProductDetail}
        detailProduct={detailProduct}
    />
    
</>
    )
}
export default Product