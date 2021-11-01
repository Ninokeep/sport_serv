
async function isAdmin(req,res,next){


    const {user} = req.user;
    //requête ici pour voir si tu es admin

    if(request === null){
        res.status(400).json({"success":false,"response":"tu n'es pas admin"})
    }
    next();
}



module.exports = isAdmin;