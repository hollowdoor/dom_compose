export default function nodeToString(node){
    if(typeof node !== 'object'){
        return node + '';
    }

    if(node.nodeType === Node.TEXT_NODE){
        return node.textContent;
    }else if(node.parentNode && node.parentNode.innerHTML){
        return node.parentNode.innerHTML;
    }

    let p = document.createElement('p');
    p.appendChild(node.cloneNode(true));

    return p.innerHTML;

};
