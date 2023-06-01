const delay = async(time) => {
    //const delay = async function(time){
        return new Promise(function(resolve) {
            setTimeout(resolve, time)
        });
    }
    
    module.exports = delay;