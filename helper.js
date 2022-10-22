exports.responser = (success,msg=null,data=null)=>{
    return{
        success,
        msg,
        data
    }
}