export default function hasEvent(part, sub){
    if(!part.length) return false;

    const m = part.match(/([\s\S]*\s)(one?)(-)([^=\s]+)=$/m);

    if(m !== null && typeof sub === 'function'){
        return m;
    }
    return false;
};
