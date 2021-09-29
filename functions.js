const constants = require('./constants');
const fs = require('fs');

let allowCountPerHour = constants.ALLOW_COUNT_PER_EXPIRY;
let response = constants.DEFAULT_RESPONSE;
let expiryTime =constants.DEFAULT_EXPIRY_TIME;

const init = (data) => {
    try { 
        if(data.allowCountPerExpiry){
           allowCountPerHour = data.allowCountPerExpiry;
        }
        if(data.response){
            response = response;
        }
        if(data.expiryTime){
            expiryTime = data.expiryTime;
        }
    }catch(error){
        throw error;
    }
}

const strictIpMiddleware = async(req, res, next) => {
    try {
        if(!req.ip) {
            console.error(`strictIpMiddleware : Incorrect Request`)
            return res.status(500).send({message : 'Something Went Wrong'})
        }
    
        let fileData = await readFile(constants.FILE_PATH);
        
        if(fileData.black_list.indexOf(req.ip) > -1){
            if(fileData.black_list_details[req.ip].expiry + expiryTime >= Date.now()){
                return res.status(429).send(response);
            } 
            // remove data from black list
            fileData.black_list.splice(fileData.black_list.indexOf(req.ip),1);
            delete fileData.black_list_details[req.ip];
        }
        
        if(!fileData.ip_counter[req.ip]){
            // initialize ip counter
            fileData.ip_counter[req.ip] = {count : 1 , start_time : Date.now()};
        } else {
            if(fileData.ip_counter[req.ip].count >= constants.ALLOW_COUNT_PER_EXPIRY){
                // check expiry of ip counter
                if(fileData.ip_counter[req.ip].start_time + expiryTime >= Date.now()){
                    fileData.black_list_details[req.ip] = {};
                    fileData.black_list_details[req.ip]['expiry'] = Date.now() + 3600000;
                    fileData.black_list.push(req.ip);
                } else {
                    fileData.ip_counter[req.ip] = {count : 1 , start_time : Date.now()};  
                }
            } else {
                if(fileData.ip_counter[req.ip].start_time + expiryTime <= Date.now()){
                    fileData.ip_counter[req.ip] = {count : 1 , start_time : Date.now()};  
                }else {
                    fileData.ip_counter[req.ip].count = fileData.ip_counter[req.ip].count + 1;
                }
            }    
        }
        
        updateFile(constants.FILE_PATH,fileData);
        next();        

    }catch(error){
        console.error('strictIpMiddleware : Internal Server Error, Please install the latest version ', error )
        return res.status(500).send({message : 'Something Went Wrong'})
    }
};

const updateFile = async(path, content) => {
    console.log('content', content);
    fs.writeFile(path, JSON.stringify(content),(err) => {
        if(err){
            console.log(err);
        }
        return true;
    });
}
const readFile = async(path) => {
    let content = fs.readFileSync(path);
    return JSON.parse(content.toString());
}

module.exports = {
    init,
    strictIpMiddleware
}
