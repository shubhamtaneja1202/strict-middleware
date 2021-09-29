module.exports = {
    ALLOW_COUNT_PER_EXPIRY : 5,
    DEFAULT_RESPONSE : {
        error : {
            message : 'too Many requests'
        }
    },
    DEFAULT_EXPIRY_TIME :3600000,
    FILE_PATH : './strict-middleware/store/data.json',
}