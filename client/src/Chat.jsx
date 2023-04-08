import React, { useEffect, useState } from "react";

const Chat = ({ socket, userName, room }) => {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setmessageList] = useState([]);

    const sendMessage = async () => {
        if (currentMessage !== '') {
            const messageData = {
                room: room,
                author: userName,
                message: currentMessage,
                time: 
                    new Date(Date.now()).getHours() + 
                    ":" +
                    new Date(Date.now()).getMinutes(),  
            };

            await socket.emit("send_message", messageData);
            setmessageList((list) => [...list, messageData]);
        }
    };

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setmessageList((list) => [...list, data])
            console.log(data);
        })
    }, [socket])

   return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        {messageList.map((messageContent) => {
            return <h1>{messageContent.message}</h1>
        })}
      </div>
      <div className="chat-footer">
        <input type="text" placeholder="Hey..." 
        onChange={(e) => setCurrentMessage(e.target.value)}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
};

export default Chat;