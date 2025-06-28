import { useEffect, useRef, useState } from "react"
import {postGeminiChatBot} from "../../../service/apiService"

//triggerNextStep là khi có respone rồi sẽ sang bước kế tiếp 
const GeminiResponse =({steps ,triggerNextStep}) =>{

    const [response ,setResponse]=useState("Processing...")

    // useRef dùng để gắn giá trị tạm thời ko bị thay đổi khi re render
    const hasFetched =useRef(false)

    const userMessage =steps?.userInput?.value;

    //useEffect này dùng để thay đổi lại hasFetched là false khi người dùng gửi 1 tin nhắn mới
    useEffect(()=>{ 
        hasFetched.current =false
    },[userMessage])

    useEffect(()=>{
        //nếu hasFetched là false
        if(hasFetched.current === true)
            return
        //set cho hasFetched là true để dừng lại
        hasFetched.current = true

        const fetchAIResponse = async() =>{
            try{
                const res =await postGeminiChatBot(userMessage)
                    if(!res){
                        console.log("No Reply From AI")
                        setResponse("Gemini error: too many requests or internal issue.");
                        return
                    }
                    setResponse(res.reply);
                    triggerNextStep()

            }catch(err){
                console.warn("API ERROR",err)
                setResponse("Error when call AI");
            } 
        };
        fetchAIResponse();
    },[userMessage,triggerNextStep])

    return(
        <div>
            {response}
        </div>
    )
}
export default GeminiResponse;