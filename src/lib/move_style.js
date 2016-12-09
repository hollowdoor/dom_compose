export default function moveStyle(root){
    let styles = root.querySelectorAll('style');
    let head = document.querySelector('head');
    if(styles && styles.length){
        [].slice.call(styles).forEach((style)=>{
            head.appendChild(style);
        });
    }

}
