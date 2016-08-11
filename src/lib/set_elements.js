import domSearchReplace from 'dom-search-replace';

export default function setElements(root, elements){
    for(let element of elements){
        domSearchReplace(root, element.id, element.element);
    }
    return root;
};
