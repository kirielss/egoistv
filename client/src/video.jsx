// import { google } from 'googleapis'
import { useEffect, useState } from 'react'
import YouTube from 'react-youtube';
import io from 'socket.io-client'

const socket = io.connect("http://localhost:3001");


const YoutubeSearch = () => {
    const [value, setValue] = useState('');
    const [listVideo, setListVideo] = useState([])
    const [teste, setTest] = useState([1, 2, 3, 4, 5])
    const searchList = () => {
        socket.emit("search_videos", {query: value})
    }

    useEffect(() => {
        socket.on("search_results", (data) => {
            setListVideo(data)
        })
    }, [socket])
    return (
      <div>
        <p>Search youtube video:</p>
        <input type="text" onChange={(e) => setValue(e.target.value)} />
        <button onClick={searchList}>Search</button>
        <div>
        {  
          listVideo.map((elem, index) => ( // console.log(elem);
          <div className='list-video'>
            <img src={elem.snippet.thumbnails.default.url} />
            <div className='list-video-text'>
                {/* <div>{index}</div> */}
                <p>{elem.snippet.title}</p>
                <p>{elem.snippet.description}</p>
                <button>Play video</button>
            </div>
          </div>
          ))
        }
        </div>
      </div>
    );
}

const YoutubePlayer = () => {
    const videoId = 'qdnqdFa1x7s'
    const opts = {
        height: '390',
        width: '640',
    }

    const srcVideo = `https://www.youtube.com/embed/${videoId}`;

    return (
      <div>
          <YoutubeSearch/>  
          {/* <iframe
            width="560"
            height="315"
            src={srcVideo}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe> */}
      </div>  
    );
}
export default YoutubePlayer;