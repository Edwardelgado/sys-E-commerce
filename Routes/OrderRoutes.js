import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import protect from '../Middleware/AuthMiddleware.js'
import Order from './../Models/OrderModel.js'
const orderRouter = express.Router()

//CREATE ORDER
orderRouter.post(
    "/", 
    protect,
    expressAsyncHandler(async(req, res) => {
        const { 
            orderItems, 
            direccionEnvio, 
            paymentMethod, 
            itemsPrice, 
            taxPrice, 
            shippingPrice,
            totalPrice
         } = req.body

            if (orderItems && orderItems.length === 0 ) {
                res.status(400)
                throw new Error("No solicito articulos")
                return 
            } else {
              const order = new Order({
                orderItems,
                user: req.user._id,
                direccionEnvio, 
                paymentMethod, 
                itemsPrice, 
                taxPrice, 
                shippingPrice,
                totalPrice
              })
              const crearOrder = await order.save()
              res.status(201).json(crearOrder)
            }
      })

     
)


//GET ORDER
orderRouter.get(
  "/:id", 
  protect,
  expressAsyncHandler(async(req, res) => {
     const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
     )
          if (order) {
            res.json(order)
          } else {
            res.status(404)
            throw new Error("Pedido no encontrado")
          }
    })

   
)


//ORDER IS PAID
orderRouter.put(
  "/:id/pay", 
  protect,
  expressAsyncHandler(async(req, res) => {
     const order = await Order.findById(req.params.id)

          if (order) {
            order.isPaid = true
            order.paidAt = Date.now()
            order.paymentResult = {
              id:req.body.id,
              estado: req.body.estado,
              update_time: req.body.update_time,
              email_address: req.body.email_address,

            }
            const updateOrder = await order.save()
            res.json(updateOrder)
          } else {
            res.status(404)
            throw new Error("Pedido no encontrado")
          }
    })

   
)


//USER LOGIN ORDER
orderRouter.get(
  "/", 
  protect,
  expressAsyncHandler(async(req, res) => {
     const order = await Order.find({ user: req.user._id }).sort({ _id:-1 })
     res.json(order)
    })

   
)


export default orderRouter

