const axios= require('axios');
const api_url="http://20.244.56.144/evaluation-service/logs";

async function log(stack,level,packageName,message){
    try{
        const payload={
            stack:stack.toLowerCase(),
            level:level.toLowerCase(),
            package:packageName.toLowerCase(),
            message
        };
        const{data}=await axios.post(api_url,payload);
        console.log("Success:${data.logID}");
    } catch(error){
        console.error("Failed to log",error.message);
    }
}

function loggerMiddleware(req,res,next){
    log("backend","info","middleware","Request for${req.method} on  ${req.originalUrl}");
    next();
}

module.exports={
    log,loggerMiddleware
};
