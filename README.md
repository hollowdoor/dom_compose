dom-compose
===========

Install
-------

`npm install --save dom-compose`

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

let $el = tpl({text, div});
$el.appendTo(document.querySelector('body'));
```

Template Literal Values
-----------------------

The template literal processed by the `doc` tag function accepts these values.

-	DOM Nodes
-	Function (DOM event callback)
-	Any primitive Javascript value
-	An object that obeys the `appendTo` contract

### Primitive values

Any primitive is toStringed.

These values can be inserted anywhere in the template string.

### DOM Nodes

DOM Nodes are inserted in a logical position relative to a parent element. If you try to insert a Node where it doesn't belong the insertion won't work.

Positions where a DOM Node fits would be anywhere between the tags of a node.

For instance both of these will work:

```javascript
let location = document.createElement('span');
location.innerHTML = 'world';
//Works
let result = doc `<p>Hello ${location}!</p>`;
```

```javascript
let greeting = document.createElement('span');
greeting.innerHTML = 'Hello world!';
//Works
let result = doc `<p>${greeting}</p>`;
```

But this will not:

```javascript
let greeting = document.createElement('span');
greeting.innerHTML = 'Hello world!';
//Does not work
let result = doc `<p ${greeting}></p>`;
```

### DOM Event Functions

Function values are processed based on the string to their left like:

```javascript
doc`<p onclick=${(values)=>{/*Function body*/}}>A paragraph.</p>`
```

Event attributes used this way don't require quotes. They won't work with quotes.

Events set this way are not true inline events. They are extracted, and set with `element.addEventListener`. So without hazard you can do something like this:

```javascript
let result = doc`
    <p onclick=${(values)=>{/*Function body*/}} onclick=${(values)=>{/*Function body*/}}>
        A paragraph.
    </p>
`
```

### The appendTo contract

Most DOM manipulation libraries have an `appendTo` method that appends their DOM contents to another element. Some of these are:

-	jQuery
-	Zepto
-	spooky-element

Passing an instance from one of the above libraries will append that instance's DOM contents to the DOM created by the `dom-compose` template literal.

The domCompose Function
-----------------------

The module returns a function that needs to be called to get the `doc` template tag.

This function `domCompose` takes an options object.

These options are:

### options.domlib

Set this to a function that evaluates the HTML input.

```javascript
import cheerio from 'cheerio';
import domCompose from 'dom-compose';
const doc = domCompose({
    domlib: (html)=>cheerio.load(html)
});


const tpl = (text1, text2, text3) => html `
    <p>Hello ${text1} ${text2} ${text3}</p>
    `;

const result = tpl('wide', 'wonderful', 'world');
/*The result is a cheerio DOM instance*/
console.log(result.html());
```

If you use a parser like cheerio you can't set attribute events, or set DOM elements through the template literal.

The default **domlib** is a miniature DOM library with only a few methods.

These methods are:

#### result.appendTo(element)

Append the result to another DOM element.

Because this is the appendTo contract the results of the `doc` tag function can be inserted into other template literals consumed by the `doc` tag function.

#### result.html()

Get the html of the result. Unlike most DOM libs `result.html()` is not a setter.

### options.escape

Replace the escape function.

```javascript
import domCompose from 'dom-compose';
//Here we set escape to not escape at all.
const doc = domCompose({
    escape: (string)=>string
});
```

Some Info
---------

This library isn't doing anything crazy for now. Who knows where it will go. There are a lot of possibilities.
