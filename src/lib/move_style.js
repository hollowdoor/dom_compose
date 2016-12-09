import createID from 'really-unique-id';

export default function moveStyle(root){

    let head = document.querySelector('head');
    let styleIDs = [].slice.call(head.querySelectorAll('style'))
    .map(style=>style.getAttribute('id'));

    let styles = [].slice.call(root.querySelectorAll('style'))
    .filter(style=>{
        return styleIDs.indexOf(style.getAttribute('id')) === -1;
    });

    if(styles && styles.length){
        styles.forEach(style=>head.appendChild(style));
    }

}
