export default function isElement(value) {
    return (value && value.nodeType === 1) &&
           (value && typeof value == 'object') &&
           (Object.prototype.toString.call(value).indexOf('Element') > -1);
}
