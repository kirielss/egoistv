import { useEffect, useState } from 'react'
import YouTube from 'react-youtube';
import io from 'socket.io-client'

const YoutubePlayer = ({ socket, room }) => {
    const [url, setUrl] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [player, setPlayer] = useState(null);
    const [playerReady, setPlayerReady] = useState(false);
    const [playerState, setPlayerState] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
    const videoId = 'qdnqdFa1x7s'
    const opts = {
        height: '390',
        width: '640',
        playerVars: {
            autoplay: 1,
            constrols: 0,
        },
    }

useEffect(() => {
  const handlePlayerStatus = (data) => {
    if (data && data.isPlaying != null && data.isPlaying !== isPlaying) {
      console.log('handlePlayerStatus:', data.isPlaying);
      setIsPlaying(data.isPlaying);
      if (player && playerReady) {
        data.isPlaying ? player.playVideo() : player.pauseVideo();
      }
    }
  };


  socket.on('player_status', handlePlayerStatus);

    const handleSyncTime = (data) => {
    if (data && data.time != null && data.time !== currentTime) {
      console.log('handleSyncTime:', data.time);
      setCurrentTime(data.time);
      if (player && playerReady) {
        player.seekTo(data.time);
      }
    }
  };
    socket.on('sync_time', handleSyncTime);


  return () => {
    socket.off('player_status', handlePlayerStatus);
        socket.off('sync_time', handleSyncTime);

  };
}, [socket, player, playerReady, isPlaying, currentTime]);


    const handleReady = (event) => {
        setPlayer(event.target);
        setPlayerReady(true);
        event.target.playVideo();
    }

const handleStateChange = (event) => {
  setPlayerState(event.data);
  const isCurrentlyPlaying = event.data === YouTube.PlayerState.PLAYING;
  setIsPlaying(isCurrentlyPlaying);
  socket.emit('player_status', { room, isPlaying: isCurrentlyPlaying, time: player.getCurrentTime() });
  if (!isCurrentlyPlaying) {
    syncTimeWithServer();
  }  
}

// const handlePlayPause = () => {
//   if (isPlaying) {
//     player.pauseVideo();
//   } else {
//     player.playVideo();
//   }
// }


const handlePlayPause = () => {
  if (isPlaying) {
    player.pauseVideo();
    setIsPlaying(false);
  } else {
    player.playVideo();
    setIsPlaying(true);
  }
  socket.emit('player_status', { room, isPlaying: !isPlaying });
}

const handleTimeChange = (e) => {

  setCurrentTime(e.target.getCurrentTime())
  socket.emit('player_status', { room, isPlaying, time: e.target.getCurrentTime() });
}


const syncTimeWithServer = () => {
  socket.emit('sync_time', { room, time: player.getCurrentTime()});
}


    return (
       <div>
            <YouTube videoId={videoId} opts={opts} onReady={handleReady} onStateChange={handleStateChange} onSeek={handleTimeChange} onEnd={handleTimeChange} />
            <button onClick={handlePlayPause}>
                {isPlaying ? 'Pause' : 'Play'}
            </button>
       </div>
    );
}

export default YoutubePlayer;
