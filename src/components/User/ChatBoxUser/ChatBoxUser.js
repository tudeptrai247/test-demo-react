import './ChatBoxUser.scss'
import { useState } from 'react';
import { RiMessage2Fill	 } from 'react-icons/ri';
import GeminiResponse from './GeminiResponse.js';
import MessageList from './MessageList.js';
import MessageInput from './MessageInput.js';
import {postGeminiChatBot} from "../../../service/apiService"

const ChatBoxUser =() =>{

    const [visible ,setVisible]=useState(false);
    
    const [message,setMessage] =useState([
      {sender :"bot" ,text:"Hi , Ask Me Anything"}
    ])

    const handleSend =async(userText)=>{
                  //lấy giá trị hiện tại của message , sau đó thêm vào cuối phần tử mới vào mảng
        setMessage(prev => [...prev , {sender:"user" ,text:userText}])

        try{
            const res = await postGeminiChatBot(userText)
            // lấy phản hồi từ AI
            const responese = res.reply
        setMessage(prev => [...prev , {sender:"bot" ,text:responese}])

        }catch(err){
          setMessage(prev => [...prev , {sender:"bot" ,text:"Error : Can Response Now , Sorry :("}])
        }
    }


    
    return(
        <div className='container-chat-box'>
           {visible &&(
              <div className='chat-popup'>
                <MessageList message={message}/>
                <MessageInput handleSend={handleSend}/>
              </div>
           )
           }
        <RiMessage2Fill className='icon-message' onClick={()=>setVisible(!visible)}/>
    </div>    
    )
}
export default ChatBoxUser