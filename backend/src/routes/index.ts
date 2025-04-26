import express  from "express";
import uploadRouter  from "./api/upload";

const router = express.Router();

router.use('/upload',uploadRouter)
router.get('/',(req,res)=>{
 res.send('you are in api')
})
export default router;