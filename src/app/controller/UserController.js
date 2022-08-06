
class UserController {
    home(req,res,next){
        res.render('index')
    }
}

module.exports = new UserController