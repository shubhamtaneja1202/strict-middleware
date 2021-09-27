module.exports = {
    ALLOW_COUNT_PER_EXPIRY : 5,
    DEFAULT_RESPONSE : {
        error : {
            message : 'too Many requests'
        }
    },
    DEFAULT_EXPIRY_TIME :3600000,
    BLACKLISTED_LIST_FILE_PATH : './strict-ip-middleware/store/blacklisted_list.json',
    BLACKLISTED_LIST_FILE_CONTENT : {
        "list" : [],
        "last_updated_at" : ""
    },
    IP_COUNTER_FILE_PATH : './strict-ip-middleware/store/ip_counter.json',
    IP_COUNTER_FILE_CONTENT : {
        "ip_counter" : {},
        "last_updated_at" : ""
    }
}