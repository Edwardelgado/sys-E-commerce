import mongoose from "mongoose"

const reviewSchema = mongoose.Schema(
  {
    nombre: {
        type: String,
        required: true
    },
    valoracion:{
        type: Number,
        required: true
    },
    comentarios:{
        type: String,
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
    
},
{
    timestamps:true
})
const productSchema = mongoose.Schema(
{
    nombre: {
        type: String,
        required: true
    },
    imagenpro:{
        type: String,
        required:true
    },
    descripcion: {
        type: String,
        required: true
    },
    revisiones: [reviewSchema],
    valoracion:{
        type:Number,
        required: true,
        default:0
    },
    numeroRevisiones:{
        type: Number,
        required: true,
        default:0
    },
    precio:{
        type: Number,
        required: true,
        default:0
    },
    stock:{
        type: Number,
        required: true,
        default:0
    },
  },
  {
    timestamps:true
  }
)

const Product = mongoose.model("Product",productSchema)

export default Product