import { useState } from 'react'
import io from 'socket.io-client'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <h1>Nosso APP</h1>
    </div>
  )
}

export default App
