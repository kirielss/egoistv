// import { google } from 'googleapis'
import { useEffect, useState } from 'react'
import YouTube from 'react-youtube';
// import { gapi, load } from 'react-gapi';


const searchQuery = () => {

}

const YoutubeSearch = () => {
    
}

const YoutubePlayer = () => {
    const videoId = 'qdnqdFa1x7s'
    const opts = {
        height: '390',
        width: '640',
    }

    const srcVideo = `https://www.youtube.com/embed/${videoId}`

    return (
      // <YouTube videoId='{videoId}' opts={opts}/>
      <iframe
        width="560"
        height="315"
        src={srcVideo}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    );
}
export default YoutubePlayer;