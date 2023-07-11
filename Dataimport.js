import express from 'express'
import User from './Models/UserModel.js'
import users from './data/users.js'
import Product from './Models/ProductModel.js'
import products from './data/products.js'
import expressAsyncHandler from 'express-async-handler'

const ImportData = express.Router()

ImportData.post("/user", expressAsyncHandler ( async (req, res) => {
    await User.deleteMany({});
    const importUser = await User.insertMany(users);
    res.send({ importUser })
}));

ImportData.post("/products", expressAsyncHandler (async (req, res) => {
    await Product.deleteMany({});
    const importProduct = await Product.insertMany(products);
    res.send({ importProduct })
}));

export default ImportData