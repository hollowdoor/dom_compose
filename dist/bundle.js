'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var domSearchReplace = _interopDefault(require('dom-search-replace'));
var isElement = _interopDefault(require('is-element'));
var nodeToString = _interopDefault(require('dom-node-tostring'));
var domFrom = _interopDefault(require('dom-from'));
var escapeHTML = _interopDefault(require('escape-html'));
var createID = _interopDefault(require('really-unique-id'));

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
};

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
};

var domExists = typeof document !== 'undefined' && typeof document.getElementById === 'function' && typeof document.createDocumentFragment === 'function';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
};

var defaultOptions = {
    domlib: createDOMOperations,
    escape: escapeHTML
};

function createDOMTemplate() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var _ref$domlib = _ref.domlib;
    var domlib = _ref$domlib === undefined ? createDOMOperations : _ref$domlib;
    var _ref$escape = _ref.escape;
    var escape = _ref$escape === undefined ? escapeHTML : _ref$escape;


    return function html(strings) {

        var values = [].slice.call(arguments, 1);

        var result = '',
            string = strings[0],
            elements = [],
            events = [],
            dom = null;

        for (var i = 0; i < values.length; i++) {

            var value = values[i];
            var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);

            if (type === 'string') {
                result += string + escape(value);
            } else if (domExists) {
                if (type === 'object') {
                    if (isElement(value) || typeof value.appendTo === 'function') {
                        var id = createID();

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

                        var _id = createID();
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
            dom = domFrom(result);

            dom = setElements(dom, elements);
            setEvents(dom, events);
        }

        return domlib(dom || result);
    };
}

module.exports = createDOMTemplate;
//# sourceMappingURL=bundle.js.map
