const fs = require("fs")
const path = require("path")
const rootDir = require("../util/path")

const p = path.join(rootDir, "data", "cart.json")

module.exports = class Cart {
    static addProduct(id, price) {
        fs.readFile(p, (err, data) => {
            let cart = { products: [], totalPrice: 0 }
            if (!err) {
                cart = JSON.parse(data)
            }

            const existingProductIndex = cart.products.findIndex(
                (p) => p.id === id
            )
            if (existingProductIndex >= 0) {
                cart.products[existingProductIndex].qty += 1
            } else {
                cart.products.push({ id, qty: 1 })
            }

            cart.totalPrice += +price

            fs.writeFile(p, JSON.stringify(cart), (err) => {
                console.log(err)
            })
        })
    }

    static deleteProduct(id, price) {
        fs.readFile(p, (err, data) => {
            if (err) {
                return
            }

            const updatedCart = JSON.parse(data)
            const product = updatedCart.products.find((p) => p.id === id)
            if (!product) {
                return
            }
            updatedCart.totalPrice =
                updatedCart.totalPrice - product.qty * price
            updatedCart.products = updatedCart.products.filter(
                (p) => p.id !== id
            )

            fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
                console.log(err)
            })
        })
    }

    static getCart(cb) {
        fs.readFile(p, (err, data) => {
            if (err) {
                cb(null)
            } else {
                cb(JSON.parse(data))
            }
        })
    }
}
