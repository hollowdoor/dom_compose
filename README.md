dom-compose
===========

This library is ready for use, but this README is incomplete. There is some significant code cleanup that also needs to be done.

Just letting you know.

Install
-------

`npm install --save dom-compose`;

Usage
-----

```javascript
import domCompose from 'dom-compose';
const doc = domCompose();
//With commonjs
//const doc = require('dom-compose')();

const tpl = (input) => doc `
    <div>Hello ${input.text} ${input.div}
    <button onclick=${(event)=>{
        console.log('hello');
    }}>Say</button>
    <input class="greeting">
    </div>
`;

let div = document.createElement('div');
let text = 'world';
div.innerHTML = `I'm a div.`;

$el = tpl({text, div});

```
