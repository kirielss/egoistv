import { useState } from 'react'
import io from 'socket.io-client'
import Chat from "./Chat";

const socket = io.connect("http://localhost:3001");

function App() {
  const [userName, setUserName] = useState('');
  const [room, setRoom] = useState('');

  const joinRoom = () => {
    if (userName !== "" && room !== "") {
     socket.emit("join_room", room); 
    }
  };
 
  return (
    <div className="App">
      <h1>Join A Chat</h1>
      <input type='text' placeholder='John...' onChange={(e) => setUserName(e.target.value)} />
      <input type='text' placeholder='Room ID...' onChange={(e) => setRoom(e.target.value)} />
      <button onClick={joinRoom}>Join a Room</button>

      <Chat 
        socket={socket}
        userName={userName}
      />
    </div>
  )
}

export default App
