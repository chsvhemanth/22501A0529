const express = require('express');
const app=express();
const{log,loggerMiddleware}=require('./LoggingMiddleware');
const { generateShortCode } = require('./utils');
app.use(express.json());
app.use(loggerMiddleware);
const{urlmapper}=require('./urldata');

function urltaken(code){
    return urlmapper.has(code);
}

app.post('/shorturls',async(req,res)=>{
    const{url, validity=30, shortcode}=req.body;
try{
    new URL(url);
}
catch{
    await log("backend","error","handler","Invalid format");
    return res.status(400).json({error:"Invalid URL Format"});
}
if(typeof validity!=='number'|| validity<=0){
    await log('backend','error','handler','Invalid validity Input');
    return res.status(400).json({error:"Validity must be a positive integer"});
}
let code = generateShortCode();
if(code){
    if(!/^[a-zA-Z0-9]+$/.test(code)){
        await log("backend","error","handler","Shortcode must be alphanumeric");
        return res.status(400).json({error:"shortcode must be alphanumeric"});
    }
    if(urltaken(code)){
        await log("backend","error","handler","Code already exists");
        return res.status(400).json({error:"Code already exists"});
    }
}else{
    do{
        code=shortcodegenerator();
    }while(urltaken(code));
}
const expiry = new Date(Date.now()+validity*60*1000).toISOString();
urlmapper.set(code,{url,expiry});
await log("backend","info","route","Shortened URL Created: ${code}");
return res.status(201).json({shortlink:"https://hostname:port/${code}",expiry});
});

app.get('/:shortcode',async(req,res)=>{
  const{shortcode}=req.params;
  const entry=urlmapper.get(shortcode);
  if(!entry){
    await log("backend","warn","handler","Shortcode ${shortcode} not found");
    return res.status(404).json({error:"Shortcode does not exist"});
  }
  if(new Date()>new Date(entry.expiry)){
    await log("backend","warn","handler","Shortcode ${shortcode} expired");
    return res.status(410).json({error:"Shortlink is expired "});
  }
  await log("backend","info","route","redirecting ${shortcode}");
  return res.redirect(entry.url);
});

app.use(async(req,res)=>{
    await log("backend","error","route","Invalid endpoint: ${req.method} ${req.originalURL}");
    res.status(404).json({error:"endpoint not found"});
});

 
app.listen(8080,()=>{
   console.log("URL Shortner running on port 8080");
});