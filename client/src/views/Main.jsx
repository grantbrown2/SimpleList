import React, {useState, useEffect} from 'react'
import NavBar from '../components/NavBar';
import ShowAllLists from '../components/ShowAllLists';
import axios from 'axios';
import BottomBar from '../components/BottomBar';

const getYoutubeVideoId = (url) => {
    // Extracts the video ID from a YouTube URL
    const match = url.match(/(?:\?v=|&v=|youtu\.be\/|\/v\/|\/embed\/|\/watch\?v=|&v=|embed\/|youtu\.be\/|v\/)([^#]{11})/);
    return match && match[1];
}

const Main = () => {

    const [list, setList] = useState([]);
    const [URL, setURL] = useState(''); 
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const APIKey = "AIzaSyDLh_5G8XD8s7D5Ri71R5Y0IWroFf0i2XE";
    
    useEffect(() => {
        axios.get('https://api.nasa.gov/planetary/apod?api_key=fwfMdH9qdIyadVMyR7VOGokoR3QrMKDeNK7p5B5z')
            .then((res) => {
                const apod = res.data;
                if (apod.media_type === 'video') {
                    const videoId = getYoutubeVideoId(apod.url);
                    console.log(videoId)
                    window.gapi.load('client', () => {
                        window.gapi.client.setApiKey(APIKey);
                        window.gapi.client.load('youtube', 'v3', ()=> {
                            window.gapi.client.youtube.videos.list({
                                part: 'snippet',
                                id: videoId
                            })
                            .then((res) => {
                                console.log('YouTube API response:', res.result);
                                const thumbnailUrl = res.result.items[0].snippet.thumbnails.default.url;
                                console.log('Thumbnail URL:', thumbnailUrl);
                                setThumbnailUrl(thumbnailUrl);
                            })
                            .catch((err) => console.log(err));
                        });
                    });
                } else {
                    setURL(apod.url);
                }
            })
            .catch((err) => console.log(err));
    }, []);

    const backgroundImageStyle = {
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        width: '100vw'
    };

    if (thumbnailUrl) {
        backgroundImageStyle.backgroundImage = `url(${thumbnailUrl})`;
    } else if (URL) {
        backgroundImageStyle.backgroundImage = `url(${URL})`;
    }

    return (
        <div className="background" style={backgroundImageStyle}>
            <NavBar list={list} setList={setList} />
            <ShowAllLists list={list} setList={setList}/>
            <BottomBar />
        </div>
    )
}

export default Main