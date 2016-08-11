import domFrom from 'dom-from';

function createID() {
  return Date.now() + randomNum();
};

function randomNum() {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9);
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
};

var isElement = function () {
    if (window === 'undefined') return function () {};
    if ("HTMLElement" in window) {
        return function (el) {
            return el instanceof HTMLElement;
        };
    } else {
        return function (el) {
            return (typeof el === "undefined" ? "undefined" : _typeof(el)) === "object" && el.nodeType === 1 && typeof el.nodeName === "string";
        };
    }
}();

var entities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
};

var replace = String.prototype.replace;

function escapeHtml(string) {
    return replace.call(String(string), /[&<>"'`=\/]/g, function (s) {
        return entities[s];
    });
};

//http://benv.ca/2012/10/02/you-are-probably-misusing-DOM-text-methods/

function setEvents(root, events) {

    while (events.length) {
        var event = events.shift();
        var element = root.querySelector("[" + event.attribute + "=\"" + event.id + "\"]");
        if (element && event.event in element) {
            element.addEventListener(event.event, event.listener, false);
            element.removeAttribute(event.attribute);
        }
    }
};

var replaceWithNode = require('./replace_with_node');
var nodeToString = require('./node_tostring');

function setElements(root, elements) {

    var nodes = [].slice.call(root.childNodes);
    var frag = document.createDocumentFragment();
    var el = [].slice.call(elements);

    if (!el.length) {
        return root;
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = nodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var node = _step.value;


            for (var i = 0; i < el.length; i++) {
                var element = el[i];
                var text = nodeToString(node);

                if (text.indexOf(element.id) !== -1) {
                    var newNode = replaceWithNode(node, element.id, element.element);

                    if (newNode.childNodes.length) {
                        newNode = setElements(newNode, elements);
                    }

                    el.splice(i, 1);
                    root.replaceChild(newNode, node);
                    break;
                }
            }

            if (!el.length) break;
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
};

var isElement$1 = require('./util/is_element');
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

            if (!isElement$1(element)) {
                throw new TypeError(element + ' is not a DOM element.');
            }

            element.appendChild(this[0]);
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
};

function html(strings) {

    var values = [].slice.call(arguments, 1);
    var result = '',
        string = strings[0],
        elements = [],
        events = [],
        dom = void 0;

    for (var i = 0; i < values.length; i++) {

        var value = values[i];
        var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);

        if (type === 'string') {
            result += string + escapeHtml(value);
        } else if (type === 'object') {
            if (isElement(value) || typeof value.appendTo === 'function') {
                var id = createID();

                elements.push({
                    id: id,
                    element: value
                });

                result += string + id;
            } else {
                result += string + escapeHtml(value);
            }
        } else if (type === 'function') {
            var m = void 0;
            if (m = string.match(/[\s](on[\S]+)=$/)) {

                var _id = createID();
                events.push({
                    id: _id,
                    attribute: m[1],
                    event: m[1].replace('on', ''),
                    listener: value
                });
                result += string + '"' + _id + '"';
            } else {
                result += string + escapeHtml(value);
            }
        } else {
            result += string + escapeHtml(value);
        }

        string = strings[i + 1];
    }

    result += string;

    dom = domFrom(result);

    dom = setElements(dom, elements);
    setEvents(dom, events);

    return createDOMOperations(dom);
}

export default html;
//# sourceMappingURL=bundle.es6.js.map
