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

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
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

function isElement$1(value) {
       return value && value.nodeType === 1 && value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object' && Object.prototype.toString.call(value).indexOf('Element') > -1;
}

function createDOMTemplate() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$domlib = _ref.domlib,
        domlib = _ref$domlib === undefined ? createDOMOperations : _ref$domlib,
        _ref$escape = _ref.escape,
        escape = _ref$escape === undefined ? escapeHTML : _ref$escape;

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
                    if (isElement$1(value) || typeof value.appendTo === 'function') {
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

/*
git remote add origin https://github.com/hollowdoor/dom_compose.git
git push -u origin master
*/

module.exports = createDOMTemplate;
//# sourceMappingURL=bundle.js.map
