const isElement = (function () {
    if(typeof window === 'undefined') return function(){};
    if ("HTMLElement" in window) {
        return function (el) {return el instanceof HTMLElement;};
    } else {
        return function (el) {
            return typeof el === "object" && el.nodeType === 1 && typeof el.nodeName === "string";
        }
    }
})();

export default isElement;
