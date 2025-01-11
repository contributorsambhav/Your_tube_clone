import comment from "../Models/comment.js";
import mongoose from "mongoose";

export const postcomment = async (req, res) => {
  const commentdata = req.body;
  const postcomment = new comment(commentdata);
  try {
    await postcomment.save();
    res.status(200).json("posted the comment");
  } catch (error) {
    res.status(400).json(error.message);
    return;
  }
};

export const getcomment = async (req, res) => {
  try {
    const commentlist = await comment.find();
    res.status(200).send(commentlist);
  } catch (error) {
    res.status(400).json(error.message);
    return;
  }
};

export const deletecomment = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).send("Comments unavailable..");
  }
  try {
    await comment.findByIdAndDelete(_id);
    res.status(200).json({ message: "deleted comment" });
  } catch (error) {
    res.status(400).json(error.message);
    return;
  }
};

export const editcomment = async (req, res) => {
  const { id: _id } = req.params;
  const { commentbody } = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).send("Comments unavailable..");
  }
  try {
    const updatecomment = await comment.findByIdAndUpdate(_id, {
      $set: { commentbody: commentbody },
    });
    res.status(200).json(updatecomment);
  } catch (error) {
    res.status(400).json(error.message);
    return;
  }
};

export const dislikeComment = async (req, res) => {
  const { id: _id } = req.params;

  const userid = req.body.userid;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ message: "Invalid comment ID." });
  }

  try {
    const existingComment = await comment.findById(_id);

    if (!existingComment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    if (existingComment.dislikelength >= 2) {
      await comment.findByIdAndDelete(_id);
      return res
        .status(200)
        .json({ message: "Comment deleted due to high dislike count." });
    }

    if (!existingComment.dislikes.includes(userid)) {
      existingComment.dislikes.push(userid); 
      existingComment.dislikelength = existingComment.dislikes.length; 
      await existingComment.save();
      return res.status(200).json({
        message: "Comment disliked successfully.",
        comment: existingComment,
      });
    } else {
      return res.status(200).json({
        message: "User already disliked this comment.",
        comment: existingComment,
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getDislikeCount = async (req, res) => {
  const { id: _id } = req.params;
  const existingComment = await comment.findById(_id);

  if (!existingComment) {
    return res.status(404).json({ message: "Comment not found." });
  } else {
    return res.status(200).json({
      dislikelength: existingComment.dislikelength - 1,
    });
  }
};
