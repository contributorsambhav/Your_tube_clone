import express from "express"

import { postcomment,getcomment,deletecomment,editcomment,dislikeComment,getDislikeCount } from "../Controllers/Comment.js"
import auth from "../middleware/auth.js"
const router=express.Router()

router.post("/post",auth,postcomment)
router.get('/get',getcomment)
router.delete('/delete/:id',auth,deletecomment)
router.patch('/edit/:id',auth,editcomment)
router.post("/dislikeComment/:id",auth,dislikeComment)
router.get("/getDislikeCount/:id",getDislikeCount)

export default router