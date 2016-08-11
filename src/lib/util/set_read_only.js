module.exports = function setReadOnly(dest, src){
    for(var n in src){
        Object.defineProperty(dest, n, {
            value: src[n]
        });
    }

    return dest;
};
