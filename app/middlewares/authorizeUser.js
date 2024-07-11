const authorizeUser=(permissions)=>{
    return (req,res,next)=>{
        if(permissions.includes(req.user.role)){
            next()
        }else{
            res.status(400).json({error:'you dont have access to this '})
        }
          
    }
}

module.exports=authorizeUser