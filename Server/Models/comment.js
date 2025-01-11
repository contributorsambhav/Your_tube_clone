import mongoose from "mongoose";

const commentschema = mongoose.Schema({
  videoid: String,
  userid: String,
  commentbody: String,
  usercommented: String,
  commentedon: { type: Date, default: Date.now },
  likes: { type: [String], default: [] },
  dislikes: {
    type: [String],
    default: [],
    validate: {
      validator: function (v) {
        return v.every((id) => typeof id === "string" && id.trim() !== "");
      },
      message: (props) => `${props.value} contains invalid user IDs.`,
    },
  },
  city: { type: String, default: "Unknown" },
  dislikelength: Number,
});

export default mongoose.model("Comments", commentschema);
