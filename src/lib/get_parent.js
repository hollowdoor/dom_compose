export default function getParent(root){
    let parent = root.parentNode || null;
    if(!parent){
        parent = document.createDocumentFragment();
        parent.appendChild(root);
        return parent;
    }
    return parent;
};
