import React, { useEffect, useState } from "react";
import "./Comment.css";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { editcomment, deletecomment } from "../../action/comment";
import axios from "axios";
import { getallcomment } from '../../action/comment';

const Displaycomment = ({
  cid,
  commentbody,
  userid,
  commenton,
  usercommented,
  city,
  likes,
  dislikes,
  dislikelength,
}) => {
  const [edit, setedit] = useState(false);
  const [cmtnody, setcommentbdy] = useState("");
  const [cmtid, setcmntid] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en"); 
  const [dislikeCount, setDislikeCount] = useState(dislikelength || 0); 
  const dispatch = useDispatch();
  const currentuser = useSelector((state) => state.currentuserreducer);

  useEffect(() => {
    const fetchDislikeCount = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/comment/getDislikeCount/${cid}`
        );
        setDislikeCount(response.data.dislikelength || 0);
      } catch (error) {
        console.error("Error fetching dislike count:", error);
      }
    };

    fetchDislikeCount();
  }, [cid]); 

  const handleedit = (ctid, ctbdy) => {
    setedit(true);
    setcmntid(ctid);
    setcommentbdy(ctbdy);
  };

  const haneleonsubmit = (e) => {
    e.preventDefault();
    if (!cmtnody) {
      alert("Please type your comment!");
    } else {
      dispatch(editcomment({ id: cmtid, commentbody: cmtnody }));
      setcommentbdy("");
    }
    setedit(false);
  };

  const handledel = (id) => {
    dispatch(deletecomment(id));
  };

  const handleTranslateClick = async () => {
    setShowLanguageDropdown(!showLanguageDropdown);
  };

  const handleLanguageSelect = async (lang) => {
    setSelectedLanguage(lang);
    setShowLanguageDropdown(false);

    try {
      const response = await axios.post("http://localhost:5000/translate", {
        text: commentbody,
        language: lang,
      });
      setTranslatedText(response.data.translatedText);
    } catch (error) {
      console.error("Error while translating comment:", error);
    }
  };

  const handleDislike = async () => {
    try {
      console.log("disliking " + currentuser.result._id);

      const response = await axios.post(
        `http://localhost:5000/comment/dislikeComment/${cid}`,
        { userid: currentuser.result._id },
        {
          headers: {
            Authorization: `Bearer ${currentuser?.token}`,
          },
        }
      );

      console.log("Backend response:", response.data);
      alert(response.data.message);
      const updatedDislikeCount = response.data.comment?.dislikelength - 1 || 0;
      
      setDislikeCount(updatedDislikeCount);
      dispatch(getallcomment());

    } catch (error) {
      console.error("Error disliking the comment:", error);
      alert("Could not dislike the comment. Please try again.");
    }
  };

  return (
    <>
      {edit ? (
        <>
          <form
            className="comments_sub_form_commments"
            onSubmit={haneleonsubmit}
          >
            <input
              type="text"
              onChange={(e) => setcommentbdy(e.target.value)}
              placeholder="Edit comments.."
              value={cmtnody}
              className="comment_ibox"
            />
            <input
              type="submit"
              value="Change"
              className="comment_add_btn_comments"
            />
          </form>
        </>
      ) : (
        <>
          <p className="comment_body">
            {translatedText || commentbody} ({city})
          </p>
          <button onClick={handleTranslateClick} className="translate_btn">
            Translate
          </button>

          {showLanguageDropdown && (
            <div className="language-dropdown">
              <ul>
                <li onClick={() => handleLanguageSelect("en")}>English</li>
                <li onClick={() => handleLanguageSelect("es")}>Spanish</li>
                <li onClick={() => handleLanguageSelect("fr")}>French</li>
                <li onClick={() => handleLanguageSelect("de")}>German</li>
                <li onClick={() => handleLanguageSelect("it")}>Italian</li>
              </ul>
            </div>
          )}
        </>
      )}
      <p className="usercommented">
        - {usercommented} commented {moment(commenton).fromNow()}
      </p>
      <div className="comment_actions">
        <button onClick={handleDislike} className="dislike_btn">
          Dislike ({dislikeCount})
        </button>
      </div>
      {currentuser?.result?._id === userid && (
        <p className="EditDel_DisplayCommendt">
          <i onClick={() => handleedit(cid, commentbody)}>Edit</i>
          <i onClick={() => handledel(cid)}>Delete</i>
        </p>
      )}
    </>
  );
};

export default Displaycomment;
