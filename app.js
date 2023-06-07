const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const path = require("path")

const errorController = require("./controllers/error")
const User = require("./models/user")

const app = express()

const adminRoutes = require("./routes/admin")
const shopRoutes = require("./routes/shop")

app.set("view engine", "ejs")

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, "public")))

app.use((req, res, next) => {
    User.findById("648048ffda6cd8d1812ee18f")
        .then((user) => {
            req.user = user
            next()
        })
        .catch((err) => console.log(err))
})

app.use("/admin", adminRoutes)
app.use(shopRoutes)

app.use(errorController.get404)

mongoose
    .connect(
        `mongodb+srv://flo2021:${process.env.MONGODB_PASSWORD}@cluster0.nlrt3.mongodb.net/shop?retryWrites=true&w=majority`
    )
    .then((result) => {
        User.findOne().then((user) => {
            if (!user) {
                const user = new User({
                    name: "Petr",
                    email: "test@test.com",
                    cart: {
                        items: [],
                    },
                })
                user.save()
            }
        })
        app.listen(3000)
    })
    .catch((err) => {
        console.log(err)
    })
