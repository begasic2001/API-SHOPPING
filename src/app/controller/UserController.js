
class UserController {
    home(req,res,next){
        res.render('user/index')
    }
}

module.exports = new UserController