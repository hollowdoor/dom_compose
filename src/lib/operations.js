import isElement from './is_element.js';
import nodeToString from 'dom-node-tostring';
let operations = [];

Object.defineProperties(operations, {
    appendTo: {
        value: function(element){
            if(typeof element === 'string'){
                try{
                    element = document.querySelector(element);
                }catch(e){ throw new TypeError(element + ' is not a valid selector.') }
            }

            if(!isElement(element)){
                throw new TypeError(element + ' is not a DOM element.')
            }

            element.appendChild(this[0]);
        }
    },
    html: {
        value: function(){
            return nodeToString(this[0]);
        }
    }
});

export default function createDOMOperations(dom){
    let ops = Object.create(operations);

    Object.defineProperties(ops, {
        0: {
            get: function(){
                return dom;
            }
        }
    });

    return ops;
};
