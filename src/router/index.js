
const userRouter = require('./user')
const adminRouter = require('./admin')
function route(app) {
    app.use('/user', userRouter)
    app.use('/admin', adminRouter)
}

module.exports = route
