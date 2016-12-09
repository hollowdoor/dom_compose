import domCompose from '../';
const doc = domCompose();
//With commonjs
//const doc = require('dom-compose')();

const tpl = (input) => doc `

    <div>
    <style>.greeting{ border: 1px solid red; }</style>
    <p>Hello ${input.text} ${input.div}</p>
    <button onclick=${(event)=>{
        console.log('hello');
    }}>Say</button>
    <input class="greeting">
    </div>
`;

let div = document.createElement('div');
let text = 'world';
div.innerHTML = `I'm a div.`;

let $el = tpl({text, div});
$el.appendTo(document.querySelector('body'));
