function generateShortCode(length=6){
    const chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code='';
    for(let i=0;i<length;i++){
    code+=chars.charAt(Math.floor(Math.random()*chars.length));
    }
    return code;
}

module.exports={generateShortCode};