import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import Product from '../Models/ProductModel.js'
import protect from '../Middleware/AuthMiddleware.js'

const productRoute = express.Router()
//get todos los productos


productRoute.get("/", expressAsyncHandler(
    async(req, res) => {
        const pageTamano = 6
        const page = Number(req.query.pageNumber) || 1
        const keyword = req.query.keyword ? {
            nombre:{
                $regex:req.query.keyword,
                $options: "i",
            }
        }
        : {}
        const contador = await Product.countDocuments({ ...keyword })
        const products = await Product.find({ ...keyword })
        .limit(pageTamano)
        .skip(pageTamano * (page -1 )).sort({_id: -1})
        res.json( { products, page, pages:Math.ceil(contador / pageTamano) })

    })
)

//GET PRODUCTO POR ID
productRoute.get("/:id", expressAsyncHandler(
    async(req, res) => {
    
        const product = await Product.findById(req.params.id)
        if (product){
            res.json(product)
        }else{
            res.status(404)
            throw new Error("Producto no encontrado")
        }
     

    })
)
//PRODUCT REVIEW
productRoute.post("/:id/review", 
protect,
expressAsyncHandler(
    async(req, res) => {
        const { valoracion, comentarios } = req.body
        const product = await Product.findById(req.params.id)

        if (product){
            const alreadyReviewed = product.revisiones.find(
                (r) => r.user.toString() === req.user._id.toString()
            )
            if (alreadyReviewed) {
                res.status(400)
                throw new Error("Producto ya comentado ")
            }
           
            const review = {
                nombre: req.user.name,
                valoracion: Number(valoracion),
                comentarios,
                user: req.user._id
            }
            product.revisiones.push(review)
            product.numeroRevisiones =  product.revisiones.length
            product.valoracion=
            product.revisiones.reduce((acc,item)=> item.valoracion + acc,0) /
            product.revisiones.length

            await product.save()
            res.status(201).json({message: "Comentario agregado"})
        }else{
            res.status(404)
            throw new Error("Producto no encontrado")
        }
     

    })
)
export default productRoute
