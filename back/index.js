import express from "express"
import mongoose from "mongoose"
import multer from "multer"
import {registerValidation,loginValidation, postCreateValidation} from "./validations.js"
import {checkAuth, handleValidationErrors} from "./utils/index.js"
import {postController, userController}  from "./Controllers/index.js"
import cors from "cors"


const app = express()

const storage = multer.diskStorage({
    destination: (_, __, cb) =>{
        cb(null, "uploads")
    },
    filename:(_,file,cb) =>{
        cb(null, file.originalname)
    }
})
const upload = multer({storage})

mongoose.connect("mongodb+srv://denis:123@cluster0.uwq7n2z.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0"
).then(() => console.log("ok"))
.catch((err) => console.log("error", err))

app.use(express.json())
app.use(cors())
app.use("/uploads", express.static("uploads"))

app.post("/log", loginValidation,handleValidationErrors, userController.login)
app.post("/reg", registerValidation,handleValidationErrors, userController.register)
app.get("/auth/me", checkAuth, userController.getMe)

app.post("/upload", checkAuth, upload.single("file"), (req, res) =>{
    console.log(req.file)
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})
app.get("/tags", postController.getLastTags)
app.get("/posts", postController.getAll)
app.get("/posts/:id", postController.getOne)
app.post("/posts", checkAuth, postCreateValidation,handleValidationErrors, postController.create);
app.delete("/posts/:id", checkAuth, postController.remove)
app.patch("/posts/:id", checkAuth, postCreateValidation, handleValidationErrors, postController.update)

app.listen(4444, (err) =>{
    if (err){
        return console.log(err)
    }
    console.log("Server pusk")
})