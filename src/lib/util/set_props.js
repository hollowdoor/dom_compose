module.exports = function setProps(obj, src){
    for(var n in src){
        Object.defineProperty(obj, n, {
            value: src[n]
        });
    }

    return obj;
};
