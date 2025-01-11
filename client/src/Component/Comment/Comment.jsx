import React, { useEffect, useState } from 'react';
import './Comment.css';
import Displaycommment from './Displaycommment';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { postcomment } from '../../action/comment';
import axios from 'axios';

const Comment = ({ videoid }) => {

    useEffect(()=>{
        fetchCity()
    },[])

    const dispatch = useDispatch();
    const [commenttext, setcommentext] = useState('');
    const [city, setCity] = useState(''); // State to store city
    const currentuser = useSelector((state) => state.currentuserreducer);
    const commentlist = useSelector((state) => state.commentreducer);
    console.log(commentlist);

    // Fetch city using geolocation
    const fetchCity = async () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await axios.get(
                        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=fb7a141cf45c4eb1a5cdaa853e2ec8fb`
                    );

                    console.log(response.data.results[0].components.city);
                    const city = response.data.results[0].components.city || 'Unknown';
                    setCity(city);
                } catch (error) {
                    console.error('Error fetching city:', error);
                    setCity('Unknown');
                }
            });
        } else {
            setCity('Unknown');
        }
    };

    const handleonsubmit = async (e) => {
        e.preventDefault();
        if (currentuser) {
            if (!commenttext) {
                alert('Please type your comment!');
            } else {
                if (!city) {
                    await fetchCity(); // Ensure city is fetched before posting the comment
                }
                dispatch(
                    postcomment({
                        videoid: videoid,
                        userid: currentuser?.result._id,
                        commentbody: commenttext,
                        usercommented: currentuser.result.name,
                        likes: 0,
                        dislikes: 0,
                        city: city || 'Unknown',
                    })
                );
                setcommentext('');
            }
        } else {
            alert('Please login to comment');
        }
    };

    return (
        <>
            <form className="comments_sub_form_comments" onSubmit={handleonsubmit}>
                <input
                    type="text"
                    onChange={(e) => setcommentext(e.target.value)}
                    placeholder="Add comment..."
                    value={commenttext}
                    className="comment_ibox"
                />
                <input type="submit" value="Add" className="comment_add_btn_comments" />
            </form>
            <div className="display_comment_container">
                {commentlist?.data
                    .filter((q) => videoid === q?.videoid)
                    .reverse()
                    .map((m) => {
                        return (
                            <Displaycommment
                                key={m._id}
                                cid={m._id}
                                userid={m.userid}
                                commentbody={m.commentbody}
                                commenton={m.commenton}
                                usercommented={m.usercommented}
                                city={m.city}
                                dislikecount = {m.dislikecount}
                                currusr = {currentuser}
                            />
                        );
                    })}
            </div>
        </>
    );
};

export default Comment;
