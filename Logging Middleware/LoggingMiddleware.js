const axios= require('axios');
const api_url="http://20.244.56.144/evaluation-service/logs";
const auth_token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyMjUwMWEwNTI5QHB2cHNpdC5hYy5pbiIsImV4cCI6MTc1MTA5MjY5NCwiaWF0IjoxNzUxMDkxNzk0LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiMThmOWUzNTEtZTAyOC00MzhiLWI2MzUtZWViOGE2NjUyZDA1IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic2F0eWEgdmVua2F0YSBoZW1hbnRoIGNoYWxsYXBhbGxpIiwic3ViIjoiZTlhMTYyM2EtYzkyOC00NTg1LThmNGEtODFjZjIxZmFhM2RiIn0sImVtYWlsIjoiMjI1MDFhMDUyOUBwdnBzaXQuYWMuaW4iLCJuYW1lIjoic2F0eWEgdmVua2F0YSBoZW1hbnRoIGNoYWxsYXBhbGxpIiwicm9sbE5vIjoiMjI1MDFhMDUyOSIsImFjY2Vzc0NvZGUiOiJlSFdOenQiLCJjbGllbnRJRCI6ImU5YTE2MjNhLWM5MjgtNDU4NS04ZjRhLTgxY2YyMWZhYTNkYiIsImNsaWVudFNlY3JldCI6IkVZaGJOdUd0anpxZlV4TlQifQ.npcAIn559tv4W8lPmk0LrXcvahDOGPMPEMsxZ0ERFJE";
async function log(stack,level,packageName,message){
    try{
        const payload={
            stack:stack.toLowerCase(),
            level:level.toLowerCase(),
            package:packageName.toLowerCase(),
            message
        };
        const{data}=await axios.post(api_url,payload,{headers:{Authorization:"Bearer ${auth_token}"}});
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