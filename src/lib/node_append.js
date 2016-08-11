export default function append(parent, child){
    if(child.appendTo){
        child.appendTo(parent);
    }else{
        parent.appendChild(child);
    }
};
