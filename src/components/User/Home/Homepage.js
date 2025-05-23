import videoHomePage from '../../../assets/vidsneaker.mp4'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useSelector } from 'react-redux'
import shoes1 from '../../../assets/shoes1.jpg'
import { useEffect, useState } from 'react';
import {get4product, getitemnike ,getitemadidas} from'../../../service/apiService'

const Homepage = () =>{
    const isAuthenticated = useSelector(state =>state.user.isAuthenticated);
    const account = useSelector(state => state.user.account)

    console.log('accout :' , account ,'isAuthenticated' , isAuthenticated)

    const [list4item ,setList4item] =useState([])
    const [nikeList ,setNikeList] =useState([])
    const [adidasList , setAdidasList] = useState([])

    useEffect(() =>{
       const getItemData = async() =>{
            const resitem = await get4product();
            if(resitem.EC===0) setList4item(resitem.product)
            
            const resNike = await getitemnike();
            if(resNike.EC===0) setNikeList(resNike.product)   

            const resAdidas = await getitemadidas();
            if(resAdidas.EC===0) setAdidasList(resAdidas.product) 
        };
        getItemData();
    },[])

    



    return(
        <div className="homepage-container">
            <video autoPlay muted loop  className='video-section'>
                <source src= {videoHomePage} type = "video/mp4"/>
            </video>
            <div className="homepage-content">
                <div className="title-1">
                   New Product
                </div>
                <div className="new-product-container">
                    <Container>
                        <Row>
                            {list4item.map((item,index)=>{
                                return(
                            <Col md={3} key={index}>
                                <div className='card'>
                                    <img src={`http://localhost:8081/uploads/${item.image}`}/>
                                </div>
                                <div className='content-card'>
                                    <h5>{item.name}</h5>
                                    <p>{item.price} đ</p>
                                </div>
                            </Col>
                            )
                            })}
                        </Row>
                    </Container>
                </div>
                <div className="title-1">
                   Nike
                </div>
                <div className="new-product-container">
                    <Container>
                        <Row>
                            {nikeList.map((item,index)=>{
                                return(
                            <Col md={3} key={index}>
                                <div className='card'>
                                    <img src={`http://localhost:8081/uploads/${item.image}`}/>
                                </div>
                                <div className='content-card'>
                                    <h5>{item.name}</h5>
                                    <p>{item.price} đ</p>
                                </div>
                            </Col>
                            )
                            })}
                        </Row>
                    </Container>
                </div>
                <div className="title-1">
                   Adidas
                </div>
                <div className="new-product-container">
                    <Container>
                        <Row>
                            {adidasList.map((item,index)=>{
                                return(
                            <Col md={3} key={index}>
                                <div className='card'>
                                    <img src={`http://localhost:8081/uploads/${item.image}`}/>
                                </div>
                                <div className='content-card'>
                                    <h5>{item.name}</h5>
                                    <p>{item.price} đ</p>
                                </div>
                            </Col>
                            )
                            })}
                        </Row>
                    </Container>
                </div>
            </div>
        </div>
    )
}
export default Homepage