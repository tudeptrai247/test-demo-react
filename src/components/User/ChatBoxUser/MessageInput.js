import { useState } from "react"
import { Button } from "react-bootstrap"
import './ChatBoxUser.scss'

const MessageInput =(props) =>{
    const [input ,setInput]=useState("")

    const {handleSend} =props

    //khi có sự kiến ấn enter sẽ lưu input message được nhập và gửi cho component cha
    const handleKeyDown =(event) =>{
        if(event.key==="Enter" && input.trim()){
            // gọi ngược lên cho component cha
            handleSend(input)
            setInput('')
        }
    }

    const handleClickSend =() =>{
        input.trim();
        handleSend(input)
        setInput('')
    }

    return(
        <div className="message-input">
            <input 
                type="text"
                value={input}
                onChange={(event) =>setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message"
            />
            <Button onClick={handleClickSend}>Send</Button>
        </div>
    )
}
export default MessageInput