const MessageList =(props) =>{
    const {message} = props
    return(
        <div className="message-list">
            {message.map((msg,index)=>{
                return(
                            // classname để phân ra message bot hay user sau đó cho vào màu tương ứng
                <div key={index} className={`message ${msg.sender}`}> 
                        {msg.text}
                </div>
                )
            })}
        </div>
    )
}
export default MessageList