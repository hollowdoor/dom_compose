import setEvents from './lib/set_events';
import setElements from './lib/set_elements';
import createDOMOperations from './lib/operations';
import domExists from './lib/global_dom_exists';
import isElement from 'is-element';
import domFrom from 'dom-from';
import escapeHTML from 'escape-html';
import createID from 'really-unique-id';

const defaultOptions = {
    domlib: createDOMOperations,
    escape: escapeHTML
};

function createDOMTemplate({
    domlib: domlib = createDOMOperations,
    escape: escape = escapeHTML
} = {}){

    return function html(strings){

        const values = [].slice.call(arguments, 1);

        let result = '',
            string = strings[0],
            elements = [],
            events = [],
            dom = null;

        for(let i=0; i<values.length; i++){

            let value = values[i];
            let type = typeof value;

            if(type === 'string'){
                result += string + escape(value);
            }else if(domExists){
                if(type === 'object'){
                    if(isElement(value) || typeof value.appendTo === 'function'){
                        let id = createID();

                        elements.push({
                            id: id,
                            element: value
                        });

                        result += string + id;
                    }else{
                        throw new TypeError(`${value} is not a valid element, or does not have
                            an appendTo method.`);
                    }
                }else if(type === 'function'){
                    let m;
                    if(m = string.match(/[\s](on[\S]+)=$/)){

                        let id = createID();
                        events.push({
                            id: id,
                            attribute: m[1],
                            event: m[1].replace('on', ''),
                            listener: value
                        });
                        result += string + '"' + id + '"';
                    }else{
                        throw new TypeError(m[1]+' is not an event attribute.');
                    }
                }
            }else{
                result += string + escape(value);
            }

            string = strings[i + 1];
        }

        result = (result += string).trim();

        if(domExists){
            dom = domFrom(result);

            dom = setElements(dom, elements);
            setEvents(dom, events);
        }

        return domlib(dom || result);
    };
}


export default createDOMTemplate;

/*
git remote add origin https://github.com/hollowdoor/dom_compose.git
git push -u origin master
*/
