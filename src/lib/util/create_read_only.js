module.exports = function createReadOnly(src){
    const dest = {};
    for(let i=0; i<arguments.length; i++){
        let src = arguments[i];
        for(let n in src){
            if(!dest.hasOwnProperty(n)){
                Object.defineProperty(dest, n, {
                    value: src[n]
                });
            }

        }
    }


    return dest;
};
