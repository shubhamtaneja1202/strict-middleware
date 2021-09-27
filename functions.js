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
    
        let blackListedFile = await readFile(constants.BLACKLISTED_LIST_FILE_PATH);
        
        if(blackListedFile.last_updated_at && blackListedFile.last_updated_at + expiryTime <= Date.now()){
            await updateFile(constants.BLACKLISTED_LIST_FILE_PATH, constants.BLACKLISTED_LIST_FILE_CONTENT);
            return next();
        }        
        
        if(blackListedFile.list.indexOf(req.ip) > -1){
            return res.status(429).send(response);
        }
        
        let ipCounterFile = await readFile(constants.IP_COUNTER_FILE_PATH);

        if(ipCounterFile.last_updated_at && ipCounterFile.last_updated_at + expiryTime <= Date.now()){
            updateFile(constants.IP_COUNTER_FILE_PATH, constants.IP_COUNTER_FILE_CONTENT);
            return next();
        }           
       
        if(!ipCounterFile.ip_counter[req.ip]){
            ipCounterFile.ip_counter[req.ip] = 1
            if(!ipCounterFile.last_updated_at){
                ipCounterFile.last_updated_at =Date.now();
            }
            updateFile(constants.IP_COUNTER_FILE_PATH,ipCounterFile );
            return next();
        }
        
        if(ipCounterFile.ip_counter[req.ip] >= constants.ALLOW_COUNT_PER_EXPIRY){
            blackListedFile.list.push(req.ip);
            if(!blackListedFile.last_updated_at){
                blackListedFile.last_updated_at = Date.now();
            }
            updateFile(constants.BLACKLISTED_LIST_FILE_PATH,blackListedFile );
            return next();
        }
        ipCounterFile.ip_counter[req.ip] = ipCounterFile.ip_counter[req.ip] + 1;
        updateFile(constants.IP_COUNTER_FILE_PATH,ipCounterFile );
        return next();        

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
