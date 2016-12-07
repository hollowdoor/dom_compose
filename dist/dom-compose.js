var autoScroll = (function () {
'use strict';

function setEvents(root, events) {

    while (events.length) {
        var event = events.shift();
        var element = root.querySelector("[" + event.attribute + "=\"" + event.id + "\"]");
        if (element && event.event in element) {
            element.addEventListener(event.event, event.listener, false);
            element.removeAttribute(event.attribute);
        }
    }
}

var _typeof$2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
} : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
};

function nodeToString(node) {

    if ((typeof node === 'undefined' ? 'undefined' : _typeof$2(node)) !== 'object' || typeof node.nodeType === 'undefined') {
        throw new TypeError('In nodeToString: ' + node + ' is not a DOM node.');
    }

    //Try not to use clone if
    if (node.nodeType === Node.ELEMENT_NODE) {
        //Check for innerHTML because some nodes don't have it
        //Can innerHTML be used? Check to see if node is the only Node.
        if (node.parentNode && node.parentNode.childNodes.length === 1) {
            return String(node.parentNode.innerHTML);
        } else {
            return cloneToString(node);
        }
        //Check for children (elements) which some text nodes will have
    } else if (node.nodeType === Node.TEXT_NODE && !node.children) {
        return node.textContent;
    }

    return cloneToString(node);
}

function cloneToString(node) {
    var p = document.createElement('p');

    try {
        var clone = node.cloneNode(true);
        p.appendChild(clone);
    } catch (e) {
        throw new Error('In nodeToString:\n        Attemp at cloning ' + node + ' failed - with error ' + e);
    }

    return p.innerHTML;
}

var index = function (re) {
	return Object.prototype.toString.call(re) === '[object RegExp]';
};

var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
} : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
};

function domSearch(doc, pattern, options) {

    var search = (typeof options === 'undefined' ? 'undefined' : _typeof$1(options)) === 'object' ? Object.create(options) : {};
    search.all = typeof search.all === 'boolean' ? search.all : false;
    search.type = getPatternType(pattern);
    search.result = [];
    search.pattern = pattern;

    if (doc.nodeType === Node.ELEMENT_NODE) {
        return searchDoc(doc, search);
    } else if (doc.nodeType === Node.TEXT_NODE) {
        if (doc.children.length) {
            return searchDoc(doc, search);
        } else {
            return checkTextNode(doc, search);
        }
    }
}

function searchDoc(doc, search) {

    searchChildren(doc, search);

    return search.result;
}

function searchChildren(doc, search) {
    if (search.type === 'regexp') {
        return searchRegexp(doc, search);
    }

    return searchString(doc, search);
}

function searchString(doc, search) {

    for (var i = 0; i < doc.childNodes.length; i++) {
        var child = doc.childNodes[i];

        if (child.nodeType === Node.TEXT_NODE) {
            var str = nodeToString(child);

            if (str.indexOf(search.pattern) !== -1) {

                search.result.push({
                    textNode: child,
                    parent: doc
                });

                if (!search.all) {
                    break;
                }
            }
        } else {
            searchDoc(child, search);
        }
    }

    return search;
}

function searchRegexp(doc, search) {

    for (var i = 0; i < doc.childNodes.length; i++) {
        var child = doc.childNodes[i];

        if (child.nodeType === Node.TEXT_NODE) {

            var str = nodeToString(child);
            var match = void 0;

            if ((match = str.match(search.pattern)) !== null) {

                search.result.push({
                    textNode: child,
                    parent: doc,
                    match: match
                });

                if (!search.all) {
                    break;
                }
            }
        } else {
            searchDoc(child, search);
        }
    }

    return search;
}

function checkTextNode(node, search) {
    var str = nodeToString(node);

    if (search.type === 'string') {
        if (doc.indexOf(pattern) !== -1) {
            return [{ textNode: node, parent: node.parentNode }];
        }
    } else if (search.type === 'regexp') {
        var match = void 0;
        if (match = search.pattern.match(node)) {
            return [{
                textNode: node,
                parent: node.parentNode,
                match: match
            }];
        }
    }

    return [];
}

function getPatternType(pattern) {
    if (index(pattern)) {
        return 'regexp';
    }

    return typeof pattern === 'undefined' ? 'undefined' : _typeof$1(pattern);
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
} : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
};

var slicedToArray = function () {
    function sliceIterator(arr, i) {
        var _arr = [];
        var _n = true;
        var _d = false;
        var _e = undefined;

        try {
            for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                _arr.push(_s.value);

                if (i && _arr.length === i) break;
            }
        } catch (err) {
            _d = true;
            _e = err;
        } finally {
            try {
                if (!_n && _i["return"]) _i["return"]();
            } finally {
                if (_d) throw _e;
            }
        }

        return _arr;
    }

    return function (arr, i) {
        if (Array.isArray(arr)) {
            return arr;
        } else if (Symbol.iterator in Object(arr)) {
            return sliceIterator(arr, i);
        } else {
            throw new TypeError("Invalid attempt to destructure non-iterable instance");
        }
    };
}();

function domSearchReplace(doc, pattern, replacement, options) {
    var search = (typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object' ? Object.create(options) : {};
    search.all = typeof search.all === 'boolean' ? search.all : false;
    search.replaceType = getReplacementType(replacement);

    var result = domSearch(doc, pattern, options);

    if (!result.length) {
        return doc;
    }

    if (search.replaceType === 'node') {
        replaceWithNode(result[0], pattern, replacement, search);
        return doc;
    } else if (search.replaceType === 'appendTo') {
        replaceWithAppendTo(result[0], pattern, replacement, search);
        return doc;
    }

    replacement = String(replacement);

    if (!search.all) {
        replaceWithText(result[0], pattern, replacement, search);
        return doc;
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = result[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var res = _step.value;

            replaceWithText(res, pattern, replacement, search);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return doc;
}

function replaceWithText(result, pattern, replacement, search) {
    var str = result.textNode.nodeValue;
    var parts = void 0,
        collect = '';

    if (sameLength(pattern, str)) {
        result.textNode.nodeValue = replacement;
        return;
    }

    if (search.all) {
        parts = str.split(pattern);
    } else {
        parts = str.split(pattern, 2);
    }

    for (var i = 0; i < parts.length; i++) {
        collect += parts[i];
        if (i < parts.length - 1) {
            collect += replacement;
        }
    }

    result.textNode.nodeValue = collect;
}

function replaceWithNode(result, pattern, replacement, search) {
    var str = result.textNode.nodeValue;

    if (sameLength(pattern, str)) {
        result.parent.replaceChild(replacement, result.textNode);
        return;
    }

    var _str$split = str.split(pattern, 2);

    var _str$split2 = slicedToArray(_str$split, 2);

    var before = _str$split2[0];
    var after = _str$split2[1];

    var frag = document.createDocumentFragment();

    frag.appendChild(document.createTextNode(before));
    frag.appendChild(replacement);
    frag.appendChild(document.createTextNode(after));

    result.parent.replaceChild(frag, result.textNode);
}

function replaceWithAppendTo(result, pattern, replacement, search) {
    var str = result.textNode.nodeValue;
    var frag = document.createDocumentFragment();

    if (sameLength(pattern, str)) {
        replacement.appendTo(frag);
    } else {
        var _str$split3 = str.split(pattern, 2);

        var _str$split4 = slicedToArray(_str$split3, 2);

        var before = _str$split4[0];
        var after = _str$split4[1];

        frag.appendChild(document.createTextNode(before));
        replacement.appendTo(frag);
        frag.appendChild(document.createTextNode(after));
    }

    result.parent.replaceChild(frag, result.textNode);
}

function getReplacementType(replacement) {
    if (isNode(replacement)) {
        return 'node';
    } else if ((typeof replacement === 'undefined' ? 'undefined' : _typeof(replacement)) === 'object' && typeof replacement.appendTo === 'function') {
        return 'appendTo';
    }
    return 'none';
}

function sameLength(pattern, str) {
    if (typeof pattern === 'string' && pattern.length === str.length) {
        return true;
    } else if (index(pattern)) {
        var match = str.match(pattern);
        if (match[0].length === str.length) {
            return true;
        }
    }

    return false;
}

function isNode(o) {
    return (typeof Node === 'undefined' ? 'undefined' : _typeof(Node)) === "object" ? o instanceof Node : o && (typeof o === 'undefined' ? 'undefined' : _typeof(o)) === "object" && typeof o.nodeType === "number" && typeof o.nodeName === "string";
}

function setElements(root, elements) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = elements[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var element = _step.value;

            domSearchReplace(root, element.id, element.element);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return root;
}

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var isElement = createCommonjsModule(function (module, exports) {
(function (root) {
  function isElement(value) {
    return value && value.nodeType === 1 && value && typeof value == 'object' && Object.prototype.toString.call(value).indexOf('Element') > -1;
  }

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = isElement;
    }
    exports.isElement = isElement;
  } else if (typeof define === 'function' && define.amd) {
    define([], function () {
      return isElement;
    });
  } else {
    root.isElement = isElement;
  }
})(commonjsGlobal);
});

var operations = [];

Object.defineProperties(operations, {
    appendTo: {
        value: function value(element) {
            if (typeof element === 'string') {
                try {
                    element = document.querySelector(element);
                } catch (e) {
                    throw new TypeError(element + ' is not a valid selector.');
                }
            }

            if (!isElement(element)) {
                throw new TypeError(element + ' is not a DOM element.');
            }

            element.appendChild(this[0]);
        }
    },
    html: {
        value: function value() {
            return nodeToString(this[0]);
        }
    }
});

function createDOMOperations(dom) {
    var ops = Object.create(operations);

    Object.defineProperties(ops, {
        0: {
            get: function get() {
                return dom;
            }
        }
    });

    return ops;
}

var domExists = typeof document !== 'undefined' && typeof document.getElementById === 'function' && typeof document.createDocumentFragment === 'function';

var _typeof$3 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();















var get$1 = function get$1(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get$1(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

function isElement$2(value) {
       return value && value.nodeType === 1 && value && (typeof value === 'undefined' ? 'undefined' : _typeof$3(value)) == 'object' && Object.prototype.toString.call(value).indexOf('Element') > -1;
}

/**
 * Expose `parse`.
 */

var index$2 = parse;

/**
 * Tests for browser support.
 */

var innerHTMLBug = false;
var bugTestDiv;
if (typeof document !== 'undefined') {
  bugTestDiv = document.createElement('div');
  // Setup
  bugTestDiv.innerHTML = '  <link/><table></table><a href="/a">a</a><input type="checkbox"/>';
  // Make sure that link elements get serialized correctly by innerHTML
  // This requires a wrapper element in IE
  innerHTMLBug = !bugTestDiv.getElementsByTagName('link').length;
  bugTestDiv = undefined;
}

/**
 * Wrap map from jquery.
 */

var map = {
  legend: [1, '<fieldset>', '</fieldset>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  // for script/link/style tags to work in IE6-8, you have to wrap
  // in a div with a non-whitespace character in front, ha!
  _default: innerHTMLBug ? [1, 'X<div>', '</div>'] : [0, '', '']
};

map.td = map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

map.option = map.optgroup = [1, '<select multiple="multiple">', '</select>'];

map.thead = map.tbody = map.colgroup = map.caption = map.tfoot = [1, '<table>', '</table>'];

map.polyline = map.ellipse = map.polygon = map.circle = map.text = map.line = map.path = map.rect = map.g = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">', '</svg>'];

/**
 * Parse `html` and return a DOM Node instance, which could be a TextNode,
 * HTML DOM Node of some kind (<div> for example), or a DocumentFragment
 * instance, depending on the contents of the `html` string.
 *
 * @param {String} html - HTML string to "domify"
 * @param {Document} doc - The `document` instance to create the Node for
 * @return {DOMNode} the TextNode, DOM Node, or DocumentFragment instance
 * @api private
 */

function parse(html, doc) {
  if ('string' != typeof html) throw new TypeError('String expected');

  // default to the global `document` object
  if (!doc) doc = document;

  // tag name
  var m = /<([\w:]+)/.exec(html);
  if (!m) return doc.createTextNode(html);

  html = html.replace(/^\s+|\s+$/g, ''); // Remove leading/trailing whitespace

  var tag = m[1];

  // body support
  if (tag == 'body') {
    var el = doc.createElement('html');
    el.innerHTML = html;
    return el.removeChild(el.lastChild);
  }

  // wrap map
  var wrap = map[tag] || map._default;
  var depth = wrap[0];
  var prefix = wrap[1];
  var suffix = wrap[2];
  var el = doc.createElement('div');
  el.innerHTML = prefix + html + suffix;
  while (depth--) el = el.lastChild;

  // one element
  if (el.firstChild == el.lastChild) {
    return el.removeChild(el.firstChild);
  }

  // several elements
  var fragment = doc.createDocumentFragment();
  while (el.firstChild) {
    fragment.appendChild(el.removeChild(el.firstChild));
  }

  return fragment;
}

var domify = index$2;

/*
git remote add origin https://github.com/hollowdoor/dom_from.git
git push -u origin master
*/

var index$1 = function (el, doc) {
    var frag, type, i;

    if (!doc) {
        doc = document;
    }

    if (typeof el === 'string') {
        return domify(el, doc);
    } else {
        if (el !== undefined && !isNaN(el.nodeType) && el.nodeType > 0) {
            return el;
        }
        type = Object.prototype.toString.call(el);
        if (type === '[object Object]') {
            if (el.root && !isNaN(el.root.nodeType) && el.nodeType > 0) return el.root;
            if (el.length) {
                frag = doc.createDocumentFragment();
                for (i = 0; i < el.length; i++) {
                    frag.appendChild(el[i].cloneNode(true));
                }
                return frag;
            }
        } else if (type === '[object Array]') {
            frag = doc.createDocumentFragment();
            for (i = 0; i < el.length; i++) {
                frag.appendChild(el[i]);
            }
            return frag;
        }
    }

    return domify(el + '', doc);
};

/*!
 * escape-html
 * Copyright(c) 2012-2013 TJ Holowaychuk
 * Copyright(c) 2015 Andreas Lubbe
 * Copyright(c) 2015 Tiancheng "Timothy" Gu
 * MIT Licensed
 */

/**
 * Module variables.
 * @private
 */

var matchHtmlRegExp = /["'&<>]/;

/**
 * Module exports.
 * @public
 */

var index$4 = escapeHtml;

/**
 * Escape special characters in the given string of html.
 *
 * @param  {string} string The string to escape for inserting into HTML
 * @return {string}
 * @public
 */

function escapeHtml(string) {
  var str = '' + string;
  var match = matchHtmlRegExp.exec(str);

  if (!match) {
    return str;
  }

  var escape;
  var html = '';
  var index = 0;
  var lastIndex = 0;

  for (index = match.index; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34:
        // "
        escape = '&quot;';
        break;
      case 38:
        // &
        escape = '&amp;';
        break;
      case 39:
        // '
        escape = '&#39;';
        break;
      case 60:
        // <
        escape = '&lt;';
        break;
      case 62:
        // >
        escape = '&gt;';
        break;
      default:
        continue;
    }

    if (lastIndex !== index) {
      html += str.substring(lastIndex, index);
    }

    lastIndex = index + 1;
    html += escape;
  }

  return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
}

/**
 * For that extra degree of randomness.
 */
var incrementor = 0;

var reallyUniqueId = uniqueId;

/**
 * Returns a unique string using a random
 * integer, a timestamp and a fingerprint.
 *
 * @returns {Number} uniqueId
 */
function uniqueId() {
  return [randomInt(), hammerTime(), randomInt().slice(4)].join('-');
}

/**
 * Returns a random 32 bit integer.
 *
 * @returns {Number} random
 */
function randomInt() {
  var maxVal = Math.round(1 * 1e17);
  return format(Math.round(Math.random() * 1e17), maxVal);
}

/**
 * Returns the time in ms since 1970.
 *
 * @returns {Number} hammertime
 */
function hammerTime() {
  /**
   * http://en.wikipedia.org/wiki/List_of_dates_predicted_for_apocalyptic_events
   */
  var doomsDay = new Date();
  doomsDay.setFullYear('2239');
  return format(new Date().getTime() + incrementor++ % 10000, doomsDay.getTime());
}

function format(n, maxVal) {
  return pad(n.toString(36), maxVal.toString(36).length);
}

function pad(n, width) {
  return nZeroes(width - String(n).length) + n;
  function nZeroes(n) {
    var length = Math.max(n + 1, 1);
    var z = new Array(length);
    return z.join('0');
  }
}

function createDOMTemplate() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$domlib = _ref.domlib,
        domlib = _ref$domlib === undefined ? createDOMOperations : _ref$domlib,
        _ref$escape = _ref.escape,
        escape = _ref$escape === undefined ? index$4 : _ref$escape;

    return function html(strings) {

        var values = [].slice.call(arguments, 1);

        var result = '',
            string = strings[0],
            elements = [],
            events = [],
            dom = null;

        for (var i = 0; i < values.length; i++) {

            var value = values[i];
            var type = typeof value === 'undefined' ? 'undefined' : _typeof$3(value);

            if (type === 'string') {
                result += string + escape(value);
            } else if (domExists) {
                if (type === 'object') {
                    if (isElement$2(value) || typeof value.appendTo === 'function') {
                        var id = reallyUniqueId();

                        elements.push({
                            id: id,
                            element: value
                        });

                        result += string + id;
                    } else {
                        throw new TypeError(value + ' is not a valid element, or does not have\n                            an appendTo method.');
                    }
                } else if (type === 'function') {
                    var m = void 0;
                    if (m = string.match(/[\s](on[\S]+)=$/)) {

                        var _id = reallyUniqueId();
                        events.push({
                            id: _id,
                            attribute: m[1],
                            event: m[1].replace('on', ''),
                            listener: value
                        });
                        result += string + '"' + _id + '"';
                    } else {
                        throw new TypeError(m[1] + ' is not an event attribute.');
                    }
                }
            } else {
                result += string + escape(value);
            }

            string = strings[i + 1];
        }

        result = (result += string).trim();

        if (domExists) {
            dom = index$1(result);

            dom = setElements(dom, elements);
            setEvents(dom, events);
        }

        return domlib(dom || result);
    };
}

/*
git remote add origin https://github.com/hollowdoor/dom_compose.git
git push -u origin master
*/

return createDOMTemplate;

}());
//# sourceMappingURL=dom-compose.js.map
