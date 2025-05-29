import jwt from "jsonwebtoken"
import path from "path"

import UserModel from "../models/User.js"
import bcrypt from "bcrypt"
export const register = async (req,res) =>{
    try {
        

    const password = req.body.password
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    
    const doc = new UserModel({
        email: req.body.email,
        passwordHash: hash,
        avatarUrl: req.body.avatarUrl,
        fullName: req.body.fullName
    })

    const user = await doc.save()
    const token = jwt.sign({
        _id: user._id,
    },
    "secret123",
    {
        expiresIn: "30d"
    })

    const {passwordHash, ...UseData} = user._doc

    res.json({
            ...UseData,
            token,
        })
        
   
    } catch (err) {
        console.log(err)
            res.status(500).json({
                message: "Не удалось зарегаться"
            })
    }
    
}
export const login = async(req, res) =>{
    try {
        const user = await UserModel.findOne({email: req.body.email});
        if (!user){
            return res.status(404).json({message: "Пользователь не найден"})
        }
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if(!isValidPass){
            return res.status(404).json({
                message: "Неправильный логин или пароль"
            })
        }

        const token = jwt.sign({
        _id: user._id,
    },
    "secret123",
    {
        expiresIn: "30d"
    })
    const {passwordHash, ...UseData} = user._doc

    res.json({
            ...UseData,
            token,
        })
    } catch (error) {
        console.log(err)
            res.status(500).json({
                message: "Не удалось авторизоваться"
            })
    }
}
export const getMe = async(req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        if(!user){
            return res.status(404).json({
                message: 'Пользователь не найден',
            })
        }
        const {passwordHash, ...UseData} = user._doc

        res.json({UseData})
    } catch (err ){
        
        
    }
}