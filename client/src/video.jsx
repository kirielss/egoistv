// import { google } from 'googleapis'
import { useEffect, useState, useContext, createContext } from 'react'
import YouTube from 'react-youtube';
import io from 'socket.io-client'




const YoutubePlayer = ({ socket, room }) => {
    const [url, setUrl] = useState('');
    const videoId = 'qdnqdFa1x7s'
    const opts = {
        height: '390',
        width: '640',
    }

    const YoutubeSearch = ({ socket, room }) => {
        const [value, setValue] = useState('');
        const [listVideo, setListVideo] = useState([])
        const [contextUrl, setcontextUrl] = useState('')
        const searchList = () => {
            // socket.to(room).emit("search_videos", {query: value})
            socket.emit("search_videos", {query: value, room: room});
        }
    
        useEffect(() => {
            socket.on("search_results", (data) => {
                setListVideo(data)
                // console.log(data)
            })
        }, [socket])
    
        const sendUrl = async (e) => {
            const url = `http://www.youtube.com/embed/${e.target.id}`
            // setUrl(`http://www.youtube.com/embed/${e.target.id}`)
    
            await socket.emit("play_video", {room: room, url: url});
            setUrl(url);
        }
    
        return (
          <div>
            <p>Search youtube video:</p>
            <input type="text" onChange={(e) => setValue(e.target.value)} />
            <button onClick={searchList}>Search</button>
            <div>
            {  
              listVideo.map((elem, index) => ( 
              <div className='list-video'>
                <img src={elem.snippet.thumbnails.default.url} />
                <div className='list-video-text'>
                    {/* <div>{index}</div> */}
                    <p>{elem.snippet.title}</p>
                    <p>{elem.snippet.description}</p>
                    <button
                        onClick={sendUrl}
                        id={elem.id.videoId}>
                        Play video
                    </button>
                </div>
              </div>
              ))
            }
            </div>
          </div>
        );
    }



    const srcVideo = `https://www.youtube.com/embed/${videoId}`;

    useEffect(() => {
        socket.on("play_video", (data) => {
            setUrl(data)
            console.log(url)
        })
    }, [socket])

    return (
      <div>
          <YoutubeSearch
            socket={socket}
            room={room}
          />  

            <iframe 
                onClick={() => console.log("click")}
                width="560"
                height="315"
                src={url}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
            ></iframe> 
      </div>  
    );
}
export default YoutubePlayer;