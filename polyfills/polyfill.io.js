/* Polyfill service v3.42.0
 * For detailed credits and licence information see https://github.com/financial-times/polyfill-service.
 *
 * Features requested: Array.from,Array.prototype.find,Array.prototype.findIndex,Array.prototype.forEach,Array.prototype.includes,CustomEvent,Element.prototype.classList,Element.prototype.closest,Element.prototype.remove,HTMLTemplateElement,Map,MutationObserver,NodeList.prototype.forEach,Object.values,Promise,Reflect,Reflect.set,Set,String.prototype.includes,String.prototype.startsWith
 *
 * - _ESAbstract.Call, License: CC0 (required by "Reflect.set", "_ESAbstract.ToPrimitive", "_ESAbstract.ToPropertyKey", "_ESAbstract.OrdinaryToPrimitive")
 * - _ESAbstract.CreateMethodProperty, License: CC0 (required by "Reflect.set")
 * - _ESAbstract.Get, License: CC0 (required by "_ESAbstract.OrdinaryToPrimitive", "_ESAbstract.ToPrimitive", "_ESAbstract.ToPropertyKey", "Reflect.set")
 * - _ESAbstract.IsCallable, License: CC0 (required by "_ESAbstract.GetMethod", "_ESAbstract.ToPrimitive", "_ESAbstract.ToPropertyKey", "Reflect.set", "_ESAbstract.OrdinaryToPrimitive")
 * - _ESAbstract.ToObject, License: CC0 (required by "_ESAbstract.GetV", "_ESAbstract.GetMethod", "_ESAbstract.ToPrimitive", "_ESAbstract.ToPropertyKey", "Reflect.set")
 * - _ESAbstract.GetV, License: CC0 (required by "_ESAbstract.GetMethod", "_ESAbstract.ToPrimitive", "_ESAbstract.ToPropertyKey", "Reflect.set")
 * - _ESAbstract.GetMethod, License: CC0 (required by "_ESAbstract.ToPrimitive", "_ESAbstract.ToPropertyKey", "Reflect.set")
 * - _ESAbstract.Type, License: CC0 (required by "Reflect.set", "_ESAbstract.ToPropertyKey", "_ESAbstract.ToPrimitive", "_ESAbstract.ToString", "_ESAbstract.OrdinaryToPrimitive")
 * - _ESAbstract.OrdinaryToPrimitive, License: CC0 (required by "_ESAbstract.ToPrimitive", "_ESAbstract.ToPropertyKey", "Reflect.set")
 * - _ESAbstract.ToPrimitive, License: CC0 (required by "_ESAbstract.ToPropertyKey", "Reflect.set", "_ESAbstract.ToString")
 * - _ESAbstract.ToString, License: CC0 (required by "_ESAbstract.ToPropertyKey", "Reflect.set")
 * - _ESAbstract.ToPropertyKey, License: CC0 (required by "Reflect.set")
 * - Reflect, License: CC0 (required by "Reflect.set")
 * - Reflect.set, License: CC0 */

(function(undefined) {

// _ESAbstract.Call
/* global IsCallable */
// 7.3.12. Call ( F, V [ , argumentsList ] )
function Call(F, V /* [, argumentsList] */) { // eslint-disable-line no-unused-vars
    // 1. If argumentsList is not present, set argumentsList to a new empty List.
    var argumentsList = arguments.length > 2 ? arguments[2] : [];
    // 2. If IsCallable(F) is false, throw a TypeError exception.
    if (IsCallable(F) === false) {
        throw new TypeError(Object.prototype.toString.call(F) + 'is not a function.');
    }
    // 3. Return ? F.[[Call]](V, argumentsList).
    return F.apply(V, argumentsList);
}

// _ESAbstract.CreateMethodProperty
// 7.3.5. CreateMethodProperty ( O, P, V )
function CreateMethodProperty(O, P, V) { // eslint-disable-line no-unused-vars
    // 1. Assert: Type(O) is Object.
    // 2. Assert: IsPropertyKey(P) is true.
    // 3. Let newDesc be the PropertyDescriptor{[[Value]]: V, [[Writable]]: true, [[Enumerable]]: false, [[Configurable]]: true}.
    var newDesc = {
        value: V,
        writable: true,
        enumerable: false,
        configurable: true
    };
    // 4. Return ? O.[[DefineOwnProperty]](P, newDesc).
    Object.defineProperty(O, P, newDesc);
}

// _ESAbstract.Get
// 7.3.1. Get ( O, P )
function Get(O, P) { // eslint-disable-line no-unused-vars
    // 1. Assert: Type(O) is Object.
    // 2. Assert: IsPropertyKey(P) is true.
    // 3. Return ? O.[[Get]](P, O).
    return O[P];
}

// _ESAbstract.IsCallable
// 7.2.3. IsCallable ( argument )
function IsCallable(argument) { // eslint-disable-line no-unused-vars
    // 1. If Type(argument) is not Object, return false.
    // 2. If argument has a [[Call]] internal method, return true.
    // 3. Return false.

    // Polyfill.io - Only function objects have a [[Call]] internal method. This means we can simplify this function to check that the argument has a type of function.
    return typeof argument === 'function';
}

// _ESAbstract.ToObject
// 7.1.13 ToObject ( argument )
// The abstract operation ToObject converts argument to a value of type Object according to Table 12:
// Table 12: ToObject Conversions
/*
|----------------------------------------------------------------------------------------------------------------------------------------------------|
| Argument Type | Result                                                                                                                             |
|----------------------------------------------------------------------------------------------------------------------------------------------------|
| Undefined     | Throw a TypeError exception.                                                                                                       |
| Null          | Throw a TypeError exception.                                                                                                       |
| Boolean       | Return a new Boolean object whose [[BooleanData]] internal slot is set to argument. See 19.3 for a description of Boolean objects. |
| Number        | Return a new Number object whose [[NumberData]] internal slot is set to argument. See 20.1 for a description of Number objects.    |
| String        | Return a new String object whose [[StringData]] internal slot is set to argument. See 21.1 for a description of String objects.    |
| Symbol        | Return a new Symbol object whose [[SymbolData]] internal slot is set to argument. See 19.4 for a description of Symbol objects.    |
| Object        | Return argument.                                                                                                                   |
|----------------------------------------------------------------------------------------------------------------------------------------------------|
*/
function ToObject(argument) { // eslint-disable-line no-unused-vars
    if (argument === null || argument === undefined) {
        throw TypeError();
    }
  return Object(argument);
}

// _ESAbstract.GetV
/* global ToObject */
// 7.3.2 GetV (V, P)
function GetV(v, p) { // eslint-disable-line no-unused-vars
    // 1. Assert: IsPropertyKey(P) is true.
    // 2. Let O be ? ToObject(V).
    var o = ToObject(v);
    // 3. Return ? O.[[Get]](P, V).
    return o[p];
}

// _ESAbstract.GetMethod
/* global GetV, IsCallable */
// 7.3.9. GetMethod ( V, P )
function GetMethod(V, P) { // eslint-disable-line no-unused-vars
    // 1. Assert: IsPropertyKey(P) is true.
    // 2. Let func be ? GetV(V, P).
    var func = GetV(V, P);
    // 3. If func is either undefined or null, return undefined.
    if (func === null || func === undefined) {
        return undefined;
    }
    // 4. If IsCallable(func) is false, throw a TypeError exception.
    if (IsCallable(func) === false) {
        throw new TypeError('Method not callable: ' + P);
    }
    // 5. Return func.
    return func;
}

// _ESAbstract.Type
// "Type(x)" is used as shorthand for "the type of x"...
function Type(x) { // eslint-disable-line no-unused-vars
    switch (typeof x) {
        case 'undefined':
            return 'undefined';
        case 'boolean':
            return 'boolean';
        case 'number':
            return 'number';
        case 'string':
            return 'string';
        case 'symbol':
            return 'symbol';
        default:
            // typeof null is 'object'
            if (x === null) return 'null';
            // Polyfill.io - This is here because a Symbol polyfill will have a typeof `object`.
            if ('Symbol' in this && x instanceof this.Symbol) return 'symbol';
            return 'object';
    }
}

// _ESAbstract.OrdinaryToPrimitive
/* global Get, IsCallable, Call, Type */
// 7.1.1.1. OrdinaryToPrimitive ( O, hint )
function OrdinaryToPrimitive(O, hint) { // eslint-disable-line no-unused-vars
    // 1. Assert: Type(O) is Object.
    // 2. Assert: Type(hint) is String and its value is either "string" or "number".
    // 3. If hint is "string", then
    if (hint === 'string') {
        // a. Let methodNames be « "toString", "valueOf" ».
        var methodNames = ['toString', 'valueOf'];
        // 4. Else,
    } else {
        // a. Let methodNames be « "valueOf", "toString" ».
        methodNames = ['valueOf', 'toString'];
    }
    // 5. For each name in methodNames in List order, do
    for (var i = 0; i < methodNames.length; ++i) {
        var name = methodNames[i];
        // a. Let method be ? Get(O, name).
        var method = Get(O, name);
        // b. If IsCallable(method) is true, then
        if (IsCallable(method)) {
            // i. Let result be ? Call(method, O).
            var result = Call(method, O);
            // ii. If Type(result) is not Object, return result.
            if (Type(result) !== 'object') {
                return result;
            }
        }
    }
    // 6. Throw a TypeError exception.
    throw new TypeError('Cannot convert to primitive.');
}

// _ESAbstract.ToPrimitive
/* global Type, GetMethod, Call, OrdinaryToPrimitive */
// 7.1.1. ToPrimitive ( input [ , PreferredType ] )
function ToPrimitive(input /* [, PreferredType] */) { // eslint-disable-line no-unused-vars
    var PreferredType = arguments.length > 1 ? arguments[1] : undefined;
    // 1. Assert: input is an ECMAScript language value.
    // 2. If Type(input) is Object, then
    if (Type(input) === 'object') {
        // a. If PreferredType is not present, let hint be "default".
        if (arguments.length < 2) {
            var hint = 'default';
            // b. Else if PreferredType is hint String, let hint be "string".
        } else if (PreferredType === String) {
            hint = 'string';
            // c. Else PreferredType is hint Number, let hint be "number".
        } else if (PreferredType === Number) {
            hint = 'number';
        }
        // d. Let exoticToPrim be ? GetMethod(input, @@toPrimitive).
        var exoticToPrim = typeof this.Symbol === 'function' && typeof this.Symbol.toPrimitive === 'symbol' ? GetMethod(input, this.Symbol.toPrimitive) : undefined;
        // e. If exoticToPrim is not undefined, then
        if (exoticToPrim !== undefined) {
            // i. Let result be ? Call(exoticToPrim, input, « hint »).
            var result = Call(exoticToPrim, input, [hint]);
            // ii. If Type(result) is not Object, return result.
            if (Type(result) !== 'object') {
                return result;
            }
            // iii. Throw a TypeError exception.
            throw new TypeError('Cannot convert exotic object to primitive.');
        }
        // f. If hint is "default", set hint to "number".
        if (hint === 'default') {
            hint = 'number';
        }
        // g. Return ? OrdinaryToPrimitive(input, hint).
        return OrdinaryToPrimitive(input, hint);
    }
    // 3. Return input
    return input;
}

// _ESAbstract.ToString
/* global Type, ToPrimitive */
// 7.1.12. ToString ( argument )
// The abstract operation ToString converts argument to a value of type String according to Table 11:
// Table 11: ToString Conversions
/*
|---------------|--------------------------------------------------------|
| Argument Type | Result                                                 |
|---------------|--------------------------------------------------------|
| Undefined     | Return "undefined".                                    |
|---------------|--------------------------------------------------------|
| Null          | Return "null".                                         |
|---------------|--------------------------------------------------------|
| Boolean       | If argument is true, return "true".                    |
|               | If argument is false, return "false".                  |
|---------------|--------------------------------------------------------|
| Number        | Return NumberToString(argument).                       |
|---------------|--------------------------------------------------------|
| String        | Return argument.                                       |
|---------------|--------------------------------------------------------|
| Symbol        | Throw a TypeError exception.                           |
|---------------|--------------------------------------------------------|
| Object        | Apply the following steps:                             |
|               | Let primValue be ? ToPrimitive(argument, hint String). |
|               | Return ? ToString(primValue).                          |
|---------------|--------------------------------------------------------|
*/
function ToString(argument) { // eslint-disable-line no-unused-vars
    switch(Type(argument)) {
        case 'symbol':
            throw new TypeError('Cannot convert a Symbol value to a string');
            break;
        case 'object':
            var primValue = ToPrimitive(argument, 'string');
            return ToString(primValue);
        default:
            return String(argument);
    }
}

// _ESAbstract.ToPropertyKey
/* globals ToPrimitive, Type, ToString */
// 7.1.14. ToPropertyKey ( argument )
function ToPropertyKey(argument) { // eslint-disable-line no-unused-vars
    // 1. Let key be ? ToPrimitive(argument, hint String).
    var key = ToPrimitive(argument, String);
    // 2. If Type(key) is Symbol, then
    if (Type(key) === 'symbol') {
        // a. Return key.
        return key;
    }
    // 3. Return ! ToString(key).
    return ToString(key);
}

// Reflect
// 26.1 The Reflect Object
Object.defineProperty(self, "Reflect", {
    value: self.Reflect || {},
    writable: true,
    configurable: true
});
Object.defineProperty(self, "Reflect", {
    value: self.Reflect || {},
    enumerable: false
});
// Reflect.set
/* global CreateMethodProperty, Reflect, Type, ToPropertyKey, Call */
(function () {
    function _set(propertyKey, value, receiver, target) {
        var desc = Object.getOwnPropertyDescriptor(target, propertyKey);
        try {
            if (desc && desc.set) {
                return Call(desc.set, receiver, [value]);
            } else {
                target[propertyKey] = value;
            }
            return true;
        } catch (e) {
            return false;
        }
    };
    // 26.1.12 Reflect.set ( target, propertyKey, V [ , receiver ] )
    CreateMethodProperty(Reflect, 'set', function set(target, propertyKey, V /*[ , receiver ]*/ ) {
        var receiver = arguments[3];
        // 1. If Type(target) is not Object, throw a TypeError exception.
        if (Type(target) !== "object") {
            throw new TypeError(Object.prototype.toString.call(target) + ' is not an Object');
        }
        // 2. Let key be ? ToPropertyKey(propertyKey).
        var key = ToPropertyKey(propertyKey);
        // 3. If receiver is not present, then
        if (!(3 in arguments)) {
            // a. Set receiver to target.
            receiver = target;
        }
        // 4. Return ? target.[[Set]](key, V, receiver).
        return _set(key, V, receiver, target);
    });
}());})
.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});
