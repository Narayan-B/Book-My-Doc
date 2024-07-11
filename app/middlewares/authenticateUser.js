const jwt=require('jsonwebtoken')

const authenticateUser=async(req,res,next)=>{
    const token=req.headers['authorization']
    if(!token){
        return res.status(400).json('token is required')
    }
    try{
        const tokenData=jwt.verify(token,process.env.SECRET)
        req.user={
            id:tokenData.id,
            role:tokenData.role
        }
        next()
    }catch(err){
        return res.status(400).json({error:err})
    }
}

module.exports=authenticateUser