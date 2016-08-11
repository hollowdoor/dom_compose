const entities = {
    '&amp;'     : '&',
    '&#38;'     : '&',
    '&lt;'      : '<',
    '&#60;'     : '<',
    '&gt;'      : '>',
    '&#62;'     : '>',
    '&quot;'    : '"',
    '&#34;'     : '"',
    '&apos;'    : "'",
    "&#39;"     : "'",
    '&#x2F;'    : '/',
    '&#x60;'    : '`',
    '&equals;'  : '=',
    '&#x3D;'    : '='
};

const replace = String.prototype.replace;

export default function escapeHtml(string) {
    return replace.call(String(string), /[&<>"'`=\/]/g, (s)=>{
      return entities[s];
    });
};

//http://benv.ca/2012/10/02/you-are-probably-misusing-DOM-text-methods/
