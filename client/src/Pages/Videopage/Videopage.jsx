import React, { useEffect, useState } from 'react'
import "./Videopage.css"
import moment from 'moment'
import Likewatchlatersavebtns from './Likewatchlatersavebtns'
import { useParams, Link } from 'react-router-dom'
import Comment from '../../Component/Comment/Comment'
import { viewvideo } from '../../action/video'
import { addtohistory } from '../../action/history'
import { useSelector, useDispatch } from 'react-redux'

const Videopage = () => {
    const { vid } = useParams();
    const dispatch = useDispatch();
    const vids = useSelector((state) => state.videoreducer);
    const [quality, setQuality] = useState("1080p");
    const [URLIndex, setURLIndex] = useState(0);  // Index corresponding to video quality

    // Find the video based on the ID
    const vv = vids?.data.filter((q) => q._id === vid)[0];
   
    const currentuser = useSelector(state => state.currentuserreducer);

    // Handle video view increment
    const handleviews = () => {
        dispatch(viewvideo({id: vid}));
    }

    // Handle adding to history
    const handlehistory = () => {
        dispatch(addtohistory({
            videoid: vid,
            viewer: currentuser?.result._id,
        }));
    }

    // Update video quality selection
    const handleQualityChange = (selectedQuality) => {
        setQuality(selectedQuality);
        // Map quality to the corresponding index in the transformedURLs array
        if (selectedQuality === "1080p") setURLIndex(0);
        if (selectedQuality === "720p") setURLIndex(1);
        if (selectedQuality === "480p") setURLIndex(2);
        if (selectedQuality === "360p") setURLIndex(3);
    }

    // UseEffect for handling video views and history
    useEffect(() => {
        if (currentuser) {
            handlehistory();
        }
        handleviews();
    }, [currentuser, vid]);

    return (
        <>
            <div className="container_videoPage">
                <div className="container2_videoPage">
                    <div className="video_display_screen_videoPage">
                        <video src={`${vv?.transformedURLs[URLIndex]}`} className="video_ShowVideo_videoPage" controls></video>
                        <div className="quality_selector">
                                <button 
                                    onClick={() => handleQualityChange("1080p")} 
                                    className={quality === "1080p" ? "active" : ""}
                                >
                                    1080p
                                </button>
                                <button 
                                    onClick={() => handleQualityChange("720p")} 
                                    className={quality === "720p" ? "active" : ""}
                                >
                                    720p
                                </button>
                                <button 
                                    onClick={() => handleQualityChange("480p")} 
                                    className={quality === "480p" ? "active" : ""}
                                >
                                    480p
                                </button>
                                <button 
                                    onClick={() => handleQualityChange("360p")} 
                                    className={quality === "360p" ? "active" : ""}
                                >
                                    360p
                                </button>
                            </div>
                        <div className="video_details_videoPage">
                            <div className="video_btns_title_VideoPage_cont">
                                <p className="video_title_VideoPage">{vv?.title}</p>
                                <div className="views_date_btns_VideoPage">
                                    <div className="views_videoPage">
                                        {vv?.views} views <div className="dot"></div>{" "}
                                        {moment(vv?.createdat).fromNow()}
                                    </div>
                                    <Likewatchlatersavebtns vv={vv} vid={vid} />
                                </div>
                            </div>
                            <Link to={'/'} className='chanel_details_videoPage'>
                                <b className="chanel_logo_videoPage">
                                    <p>{vv?.uploader.charAt(0).toUpperCase()}</p>
                                </b>
                                <p className="chanel_name_videoPage">{vv.uploader}</p>
                            </Link>
                            <div className="comments_VideoPage">
                                <h2>
                                    <u>Comments</u>
                                </h2>
                                <Comment videoid={vv._id} />
                            </div>                            
                        </div>
                    </div>
                    <div className="moreVideoBar">More videos</div>
                </div>
            </div>
        </>
    )
}

export default Videopage;
