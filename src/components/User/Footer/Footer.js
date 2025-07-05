import { useNavigate } from "react-router-dom"

const Footer =() =>{
    const navigate =useNavigate()

    const handleClickToProductPage =()=>{
        navigate("/products")
    }
     const handleClickToHomePage =()=>{
        navigate("/")
    }
     

    return(
        <>
            <div className="footer-column">
                <b>Oldstuff</b>
                <p> Old Shoes – New Story Begin.</p>
            </div>
            <div className="footer-column">
                <b>Quick Links</b>
                <p onClick={handleClickToHomePage}>Home Page</p>
                <p onClick={handleClickToProductPage}>Product</p>
            </div>
            <div className="footer-column">
                <b >Follow Us</b>
                <p> Facebook</p>
                <p> Instagram</p>
                <p> Tiktok</p>
            </div>            
        </>
    )
}
export default Footer