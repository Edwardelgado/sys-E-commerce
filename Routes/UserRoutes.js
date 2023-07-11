import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import User from '../Models/UserModel.js'
import generateToken from '../utils/generateToken.js'
import protect from '../Middleware/AuthMiddleware.js'

const userRouter = express.Router()

userRouter.post(
    "/login", 
    expressAsyncHandler(async(req, res) => {
        const { email, password} = req.body
        const user = await User.findOne({ email })

       if (user && (await user.matchPassword(password))){
            res.json({
                _id:user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
                createdAt: user.createdAt,
            })
       }else{
            res.status(401)
            throw new Error("Email o Password incorrecto")
       }

    })
)

//REGISTER
userRouter.post(
    "/", 
    expressAsyncHandler(async(req, res) => {
        const { name, email, password} = req.body
        const userExists = await User.findOne({ email })

        if (userExists) {
            res.status(400)
            throw new Error("Usuario ya existe")
        }
        const user = await User.create({
            name,
            email,
            password,
        })

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            })
            
        }else{
            res.status(400)
            throw new Error("Datos del usuario invalidos")
        }
    })
)


//PERFIL
userRouter.get(
    "/profile", 
    protect,
    expressAsyncHandler(async(req, res) => {
        const user = await User.findById(req.user._id)

        if (user) {
            res.json({
                _id:user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                createdAt: user.createdAt,
            })
        }else{
            res.status(404)
            throw new Error("Usuario no encontrado")
        }
    })
)


//ACTUALIZAR PERFIL
userRouter.put(
    "/profile", 
    protect,
    expressAsyncHandler(async(req, res) => {
        const user = await User.findById(req.user._id)

        if (user) {
            user.name = req.body.name || user.name
            user.email = req.body.email || user.email
            if (req.body.password){
                user.password = req.body.password
            }
            const actualizarUser =await user.save()
            res.json ({
                _id:actualizarUser._id,
                name: actualizarUser.name,
                email: actualizarUser.email,
                isAdmin: actualizarUser.isAdmin,
                createdAt: actualizarUser.createdAt,
                token: generateToken(actualizarUser._id),
            })

        }else{
            res.status(404)
            throw new Error("Usuario no encontrado")
        }
    })
)


export default userRouter
