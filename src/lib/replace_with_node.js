import nodeToString from './node_tostring';
import isElement from './util/is_element';
import append from './node_append';
//dNode = destination node
function replaceWithNode(dNode, replaceText, replacementNode){

    if(indexOfText(dNode, replaceText) === -1){
        return dNode;
    }

    let node = replacementNode.cloneNode(true);


    const children = dNode.childNodes;
    if(dNode.nodeType === Node.TEXT_NODE && !children.length){
        return replaceInTextNode(dNode, replaceText, node);
    }else if(dNode.nodeType === Node.ELEMENT_NODE){
        return replaceInElement(dNode, replaceText, node.cloneNode(true));
    }

}

function replaceInTextNode(dNode, replaceText, node){

    const str = nodeToString(dNode);
    const index = str.indexOf(replaceText);

    if(index === -1){
        return node;
    }

    const start = index;
    const end = index + replaceText.length;
    const before = str.slice(0, start);
    const after = str.slice(end, str.length);

    if(node.nodeType === Node.TEXT_NODE){
        let newText = nodeToString(node);
        return document.createTextNode(before + newText + after);
    }

    const frag = document.createDocumentFragment();
    frag.appendChild(document.createTextNode(before));
    append(frag, node);
    frag.appendChild(document.createTextNode(after));
    return frag;
}

function replaceInElement(dNode, replaceText, node){
    if(dNode.innerHTML.trim() === replaceText){
        //A little faster if this can be done.
        dNode.innerHTML = '';
        append(dNode, node);
    }else if(dNode.childNodes.length && indexOfText(dNode, replaceText) !== -1){
        return replaceInChildren(dNode, replaceText, node);
    }

    return dNode;
}

function replaceInChildren(dNode, replaceText, node){

    for(let i=0; i<dNode.childNodes.length; i++){
        let child = dNode.childNodes[i];

        if(indexOfText(child, replaceText) !== -1){
            let newChild = replaceWithNode(child, replaceText, node);
            replaceNode(child, newChild, dNode);
            return dNode;
        }
    }

    return dNode;
}

function replaceNode(startNode, replacement, parent){
    parent = parent || startNode.parentNode;
    if(startNode === replacement){
        return startNode;
    }
    return parent.replaceChild(replacement, startNode);
}

function indexOfText(node, text){
    const str = nodeToString(node);
    return str.indexOf(text);
}

function containsElements(node){
    return node.nodeType === Node.ELEMENT_NODE && node.children.length;
}

export default replaceWithNode;
