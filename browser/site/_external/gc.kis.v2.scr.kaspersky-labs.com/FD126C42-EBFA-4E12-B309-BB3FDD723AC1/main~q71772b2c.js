(function(){
var AvNs = {SIGNATURE:"7D8B79A2-8974-4D7B-A76A-F4F29624C06Baii9O529cjeVrxlm-s-Ugoq54GKH9TcR2S8moOnUgqEDlmlBBDyPNJqgXU9hOlMt9sDSjonzju8voaFtZPqPMw",PREFIX:"https://gc.kis.v2.scr.kaspersky-labs.com/",INJECT_ID:"FD126C42-EBFA-4E12-B309-BB3FDD723AC1",RESOURCE_ID:"E3E8934C-235A-4B0E-825A-35A08381A191",IsWebExtension: function(){return false;}};(function ObjectTrafficMain(ns)
{
    var NativeObject = Object;
    var NativeObjectCreate = Object.create;
    var NativeObjectFreeze = Object.freeze;
    var NativeObjectDefineProperty = Object.defineProperty;
    var NativeObjectSetPrototypeOf = Object.setPrototypeOf;
    var NativeObjectHasOwnProperty = Object.hasOwnProperty;
    var NativeObjectHasOwn = Object.hasOwn;
    var NativeObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    var NativeObjectGetOwnPropertyNames = Object.getOwnPropertyNames;
    var NativeObjectGetOwnPropertySymbols = Object.getOwnPropertySymbols;
    var NativeObjectKeys = Object.keys;
    var NativeObjectEntries = Object.entries;
    var NativeObjectFromEntries = Object.fromEntries;
    var NativeProto  = Object.prototype;
    ns.GetSafePrototype = function GetSafePrototype(nativeProto)
    {
        var safeProto = NativeObjectCreate(null);
        function CopyDescriptor(key)
        {
            var desc = NativeObjectGetOwnPropertyDescriptor(nativeProto, key);
            if (typeof desc.value === "function")
            {
                NativeObjectDefineProperty(
                    safeProto, 
                    key,
                    {
                        value:        desc.value,
                        writable:     false,
                        enumerable:   desc.enumerable,
                        configurable: true
                    }
                );
            }
            else
            {
                NativeObjectDefineProperty(
                    safeProto, 
                    key,
                    {
                        get:          desc.get,
                        set:          desc.set,
                        enumerable:   desc.enumerable,
                        configurable: true
                    }
                );
            }
        }
        function CopyDescriptors(propNames)
        {
            for (var i = 0; i < propNames.length; ++i)
                CopyDescriptor(propNames[i]); 
        }
        CopyDescriptors(NativeObjectGetOwnPropertyNames(nativeProto));
        if (typeof Symbol === "function" && NativeObjectGetOwnPropertySymbols)
            CopyDescriptors(NativeObjectGetOwnPropertySymbols(nativeProto));
        return safeProto; 
    }
    var SafeProto = ns.GetSafePrototype(NativeProto);
    ns.ChangeProto = function ChangeProto(obj, proto)
    {
        if (NativeObjectSetPrototypeOf)
            NativeObjectSetPrototypeOf(obj, proto);
        else
            obj.__proto__ = proto; 
        return obj;
    }
    function SafeObject()
    {
        var newObject = NativeObject.apply(null, arguments); 
        return ns.ChangeProto(newObject, SafeProto);
    }
    function SafeObjectCreate()
    {
        var result = NativeObjectCreate.apply(NativeObject, arguments); 
        return ns.ChangeProto(result, SafeProto);
    }
    SafeObject.prototype = SafeProto;
    SafeObject.prototype.constructor = SafeObject;
    SafeObject.create = SafeObjectCreate;
    SafeObject.freeze = NativeObjectFreeze;
    SafeObject.defineProperty = NativeObjectDefineProperty;
    SafeObject.setPrototypeOf = NativeObjectSetPrototypeOf;
    SafeObject.hasOwnProperty = NativeObjectHasOwnProperty;
    SafeObject.hasOwn = NativeObjectHasOwn;
    SafeObject.getOwnPropertyDescriptor = NativeObjectGetOwnPropertyDescriptor;
    SafeObject.getOwnPropertyNames = NativeObjectGetOwnPropertyNames;
    SafeObject.getOwnPropertySymbols = NativeObjectGetOwnPropertySymbols;
    SafeObject.keys = NativeObjectKeys;
    SafeObject.entries = NativeObjectEntries;
    SafeObject.fromEntries = NativeObjectFromEntries;
    NativeObjectFreeze(SafeProto);
    NativeObjectFreeze(SafeObject);
    ns.Object = SafeObject;
})(AvNs || {});
(function TrafficDateMain(ns)
{
    var NativeDate = Date;
    var NativeProto = Date.prototype;
    var SafeProto = ns.GetSafePrototype(NativeProto);
    var nativeDateNow = Date.now;
    var nativeDateParse = Date.parse;
    var nativeDateUTC = Date.UTC;
    function SafeDate()
    {
        var args = ns.Array.from(arguments);
        var newDate = new (NativeDate.bind.apply(NativeDate, ns.Array(null).concat(args))); 
        return ns.ChangeProto(newDate, SafeProto);
    }
    SafeDate.prototype = SafeProto;
    SafeDate.prototype.constructor = SafeDate;
    SafeDate.now = function now()
        {
            return nativeDateNow();
        }
    SafeDate.parse = function parse()
        {
            return nativeDateParse.apply(NativeDate, arguments);
        }
    SafeDate.UTC = function UTC()
        {
            return nativeDateUTC.apply(NativeDate, arguments);
        }
    ns.Object.freeze(SafeProto);
    ns.Object.freeze(SafeDate);
    ns.Date = SafeDate;
})(AvNs || {});
(function TrafficUrlMain(ns)
{
    var NativeUrl = URL;
    var NativeProto = URL.prototype;
    var SafeProto = URL.prototype? ns.GetSafePrototype(NativeProto) : null;
    var NativeUrlCanParse = URL.canParse;
    var NativeUrlCreateObjectURL = URL.createObjectURL;
    var NativeUrlParse = URL.parse;
    var NativeUrlRevokeObjectURL = URL.revokeObjectURL;
    function SafeUrl()
    {
        var args = ns.Array.from(arguments);
        var newUrl = new (NativeUrl.bind.apply(NativeUrl, ns.Array(null).concat(args))); 
        return ns.ChangeProto(newUrl, SafeProto);
    }
    SafeUrl.canParse = function canParse()
    {
        return NativeUrlCanParse(NativeUrl, arguments);
    }
    SafeUrl.createObjectURL = function createObjectURL()
    {
        return NativeUrlCreateObjectURL(NativeUrl, arguments);
    }
    SafeUrl.parse = function parse()
    {
        return NativeUrlParse(NativeUrl, arguments);
    }
    SafeUrl.revokeObjectURL = function revokeObjectURL()
    {
        return NativeUrlRevokeObjectURL(NativeUrl, arguments);
    }
    if (SafeProto)
    {
        SafeUrl.prototype = SafeProto;
        SafeUrl.prototype.constructor = SafeUrl;
        ns.Object.freeze(SafeProto);
        ns.Object.freeze(SafeUrl);
        ns.URL = SafeUrl;
    }
    else
    {
        ns.URL = NativeUrl;
    }
})(AvNs || {});
(function TrafficJsonMain(ns)
{
    var StringReplace = String.prototype.replace;
    var StringSlice = String.prototype.slice;
    var StringMatch = String.prototype.match;
    var StringFromCharCode = String.fromCharCode;
    function GetClass(obj)
    {
        if (typeof obj === "undefined")
            return "undefined";
        if (obj === null)
            return "null";
        return StringMatch.call(ns.Object.prototype.toString.call(obj), /^\[object\s(.*)\]$/)[1];
    }
    var exports = {};
    var undef; 
    function ObjectToJson(object)
    {
        if (object === null || object === Infinity || object === -Infinity || object === undef)
            return "null";
        var className = GetClass(object);
        if (className === "Boolean")
        {
            return "" + object; 
        }
        else if (className === "Number")
        {
            return window.isNaN(object) ? "null" : "" + object; 
        }
        else if (className === "String")
        {
            var escapedStr = "" + object; 
            return "\"" + StringReplace.call(StringReplace.call(escapedStr, /\\/g, "\\\\"), /\"/g, "\\\"") + "\"";
        }
        if (typeof object === "object") 
        {
            if (!ObjectToJson.check) ObjectToJson.check = new AvNs.Array();
            for (var i=0, chkLen=ObjectToJson.check.length ; i<chkLen ; ++i)
            {
                if (ObjectToJson.check[i] === object)  
                    throw new TypeError();
            }
            ObjectToJson.check.push(object);
            var str = '';
            if (className === "Array" || className === "Array Iterator")
            {
                for (var index = 0, length = object.length; index < length; ++index)
                    str += ObjectToJson(object[index]) + ',';  
                ObjectToJson.check.pop();
                return "[" + StringSlice.call(str, 0, -1) + "]";
            }
            for (var property in object)
            {
                if (ns.Object.hasOwnProperty.call(object, property))
                    str += '"' + property + '":' + ObjectToJson(object[property]) + ','; 
            }
            ObjectToJson.check.pop();
            return "{" + StringSlice.call(str, 0, -1) + "}";
        }
        return undef;
    }
    exports.stringify = function stringify(source)
    {
        return ObjectToJson(source);
    };
    var parser = {
        source : null,
        grammar : /^[\x20\t\n\r]*(?:([,:\[\]{}]|true|false|null)|(-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)|"((?:[^\r\n\t\\\"]|\\(?:["\\\/trnfb]|u[0-9a-fA-F]{4}))*)")/,
        ThrowError : function ThrowError()
        {
            throw new SyntaxError('JSON syntax error');
        },
        NextToken : function NextToken(token)
        {
            this.source = StringSlice.call(token.input, token[0].length);
            return this.grammar.exec(this.source);
        },
        ParseArray : function ParseArray()
        {
            var token = this.grammar.exec(this.source);
            var parseItem = token && token[1] !== ']';
            var result = new AvNs.Array();
            for(;;token = this.NextToken(token))
            {
                if (!token)
                    this.ThrowError();
                if (parseItem)
                {
                    result.push(this.ParseValue(token));
                    token = this.grammar.exec(this.source);
                }
                else if (token[1])
                {
                    if (token[1] === ']')
                        break;
                    else if (token[1] !== ',')
                        this.ThrowError();
                }
                else
                {
                    this.ThrowError();
                }
                parseItem = !parseItem;
            }
            return result;
        },
        ParseObject : function ParseObject()
        {
            var propertyName = "";
            var parseProperty = true
            var result = {};
            for(var token = this.grammar.exec(this.source);;token = this.NextToken(token))
            {
                if (!token)
                    this.ThrowError();
                if (parseProperty)
                {
                    if (token[1] && token[1] === '}')
                    {
                        break;
                    }
                    else if (token[1] || token[2] || !token[3])
                    {
                        this.ThrowError();
                    }
                    propertyName = token[3];
                    token = this.NextToken(token);
                    if (!token || !token[1] || token[1] !== ':')
                        this.ThrowError();
                    parseProperty = false;
                }
                else
                {
                    if (!propertyName)
                        this.ThrowError();
                    result[ propertyName ] = this.ParseValue(token); 
                    token = this.NextToken(this.grammar.exec(this.source));
                    if (token[1])
                    {
                        if (token[1] === '}')
                            break;
                        else if (token[1] !== ',')
                            this.ThrowError();
                    }
                    else
                    {
                        this.ThrowError();
                    }
                    propertyName = undef;
                    parseProperty = true;
                }
            }
            return result;
        },
        ParseValue : function ParseValue(token)
        {
            if (token[1])
            {
                switch (token[1])
                {
                    case '[' :
                        this.source = StringSlice.call(this.source, token[0].length);
                        return this.ParseArray();
                    case '{' :
                        this.source = StringSlice.call(this.source, token[0].length);
                        return this.ParseObject();
                    case 'true' :
                        return true;
                    case 'false' :
                        return false;
                    case 'null' :
                        return null;
                    default:
                        this.ThrowError();
                }
            }
            else if (token[2])
            {
                return  +token[2]; 
            }
            return StringReplace.call(token[3], /\\(?:u(.{4})|(["\\\/'bfnrt]))/g, function replaceCallback(substr, utfCode, esc)
            {
                if(utfCode)
                    return StringFromCharCode(parseInt(utfCode, 16));
                switch(esc)
                {
                    case 'b': return '\b';
                    case 'f': return '\f';
                    case 'n': return '\n';
                    case 'r': return '\r';
                    case 't': return '\t';
                    default:
                        return esc;
                }
            });
        },
        Parse : function Parse(str)
        {
            if (GetClass(str) !== 'String')
                throw new TypeError();
            this.source = str;
            var token = this.grammar.exec(this.source);
            if (!token)
                this.ThrowError();
            return this.ParseValue(token);
        }
    };
    exports.parse = function parse(source)
    {
        return parser.Parse(source);
    };
    ns.JSON = {};
    if (window.JSON)
    {
        var originStringify = JSON.stringify;
        function StringifyWrapper(source) 
        {
            if (String.prototype.toJSON)
                return exports.stringify(source);
            return originStringify(source);
        }
        ns.JSON.stringify = JSON.stringify ? StringifyWrapper : exports.stringify;
        ns.JSON.parse = JSON.parse || exports.parse;
    }
    else
    {
        ns.JSON.stringify = exports.stringify;
        ns.JSON.parse = exports.parse;
    }
})(AvNs || {});
(function TrafficArrayMain(ns)
{
    var NativeArray = Array;
    var NativeArrayFrom = Array.from;
    var NativeArrayIsArray = Array.isArray;
    var NativeProto  = Array.prototype;
    var SafeProto = ns.GetSafePrototype(NativeProto);
    function ToSafeArray(nativeArr)
    {
        var arr = new NativeArray();
        for (var k = 0, len = nativeArr.length; k < len; k++)
            arr[k] = nativeArr[k]; 
        return ns.ChangeProto(arr, SafeProto);
    }
    var methodsReturningArray = ["concat", "slice", "map", "filter", "flat", "flatMap", "splice"];
    for (var m = 0; m < methodsReturningArray.length; m++)
    {
        var method = methodsReturningArray[m]; 
        (function Processor(methodName, orig)
        {
            if (typeof orig !== "function")
                return;
            ns.Object.defineProperty(
                SafeProto, 
                methodName, 
                {
                    value: function Method() 
                    {
                        var nativeResult = orig.apply(this, arguments);
                        return (NativeArrayIsArray(nativeResult))
                            ? ToSafeArray(nativeResult)
                            : nativeResult;
                    },
                    writable: false,
                    enumerable: false,
                    configurable: false
                }
            );
        })(method, SafeProto[method]); 
    }
    function SafeArray()
    {
        if (arguments.length === 1 && typeof arguments[0] === "number")
            throw new Error("SafeArray: length is not supported");
        var arr = new NativeArray();
        for (var i = 0; i < arguments.length; i++)
            arr[i] = arguments[i]; 
        return ns.ChangeProto(arr, SafeProto);
    }
    SafeArray.prototype = SafeProto;
    SafeArray.prototype.constructor = SafeArray;
    function LegacyArrayForEach(callback, thisArg)
    {
        for (var i = 0; i < this.length; i++)
        {
            if (this === null)
                throw new Error("this is null or not defined");
            if (typeof callback !== "function")
                throw new Error(callback + " is not a function");
            if (i in this)
                callback.call(thisArg, this[i], i, this); 
        }
    };
    function LegacyArrayFrom(iterable, mapFn, thisArg)
    {
        if (iterable && iterable instanceof SafeArray)
            return ToSafeArray(iterable.slice());
        var iteratorFn = null;
        if (typeof Symbol === "function" && Symbol.iterator)
            iteratorFn = iterable[Symbol.iterator];
        if (typeof iteratorFn === 'function')
        {
            var iterator = iteratorFn.call(iterable);
            var nativeArray = [];
            for (var i = 0, result = iterator.next(); !result.done; ++i, result = iterator.next())
                nativeArray[i] = result.value; 
            if (typeof mapFn === 'function')
            {
                for (var j = 0; j < nativeArray.length; j++)
                    nativeArray[j] = mapFn.call(thisArg, nativeArray[j], j); 
            }
            return ToSafeArray(nativeArray);
        }
        if (iterable !== null && typeof iterable.length === "number")
        {
            var arr = new SafeArray();
            for (var k = 0; k < iterable.length; k++)
            {
                var value = iterable[k]; 
                if (typeof mapFn === "function")
                    value = mapFn.call(thisArg, value, k);
                arr[k] = value; 
            }
            return arr;
        }
        throw new TypeError("LegacyArrayFrom: argument is not iterable");
    }
    function ArrayFrom(iterable, mapFn, thisArg)
    {
        return ToSafeArray(NativeArrayFrom(iterable, mapFn, thisArg));
    }
    SafeArray.isArray = function IsArray()
        {
            return NativeArrayIsArray.apply(NativeArray, arguments);
        }
    SafeArray.from = typeof NativeArray.from === "function" ? ArrayFrom : LegacyArrayFrom;
    SafeArray.some = Array.some;
    if (typeof SafeProto.forEach !== "function")
        SafeProto.forEach = LegacyArrayForEach;
    ns.Object.freeze(SafeProto);
    ns.Object.freeze(SafeArray);
    ns.Array = SafeArray;
})(AvNs || {});
(function TrafficStringMain(ns)
{
    ns.StringFromCharCode = String.fromCharCode;
    ns.StringFromCodePoint = String.fromCodePoint;
    ns.StringRaw = String.raw;
    ns.StringAnchor = String.prototype.anchor;
    ns.StringAt = String.prototype.at;
    ns.StringBig = String.prototype.big;
    ns.StringBlink = String.prototype.blink;
    ns.StringBold = String.prototype.bold;
    ns.StringCharAt = String.prototype.charAt;
    ns.StringCharCodeAt = String.prototype.charCodeAt;
    ns.StringCodePointAt = String.prototype.codePointAt;
    ns.StringConcat = String.prototype.concat;
    ns.StringEndsWith = String.prototype.endsWith;
    ns.StringFixed = String.prototype.fixed;
    ns.StringFontcolor = String.prototype.fontcolor;
    ns.StringFontsize = String.prototype.fontsize;
    ns.StringIncludes = String.prototype.includes;
    ns.StringIndexOf = String.prototype.indexOf;
    ns.StringIsWellFormed = String.prototype.isWellFormed;
    ns.StringItalics = String.prototype.italics;
    ns.StringLastIndexOf = String.prototype.lastIndexOf;
    ns.StringLink = String.prototype.link;
    ns.StringLocaleCompare = String.prototype.localeCompare;
    ns.StringMatch = String.prototype.match;
    ns.StringMatchAll = String.prototype.matchAll;
    ns.StringNormalize = String.prototype.normalize;
    ns.StringPadEnd = String.prototype.padEnd;
    ns.StringPadStart = String.prototype.padStart;
    ns.StringRepeat = String.prototype.repeat;
    ns.StringReplace = String.prototype.replace;
    ns.StringReplaceAll = String.prototype.replaceAll;
    ns.StringSearch = String.prototype.search;
    ns.StringSlice = String.prototype.slice;
    ns.StringSmall = String.prototype.small;
    ns.StringSplit = String.prototype.split;
    ns.StringStartsWith = String.prototype.startsWith;
    ns.StringStrike = String.prototype.strike;
    ns.StringSub = String.prototype.sub;
    ns.StringSubstr = String.prototype.substr;
    ns.StringSubstring = String.prototype.substring;
    ns.StringSup = String.prototype.sup;
    ns.StringToLocaleLowerCase = String.prototype.toLocaleLowerCase;
    ns.StringToLocaleUpperCase = String.prototype.toLocaleUpperCase;
    ns.StringToLowerCase = String.prototype.toLowerCase;
    ns.StringToString = String.prototype.toString;
    ns.StringToUpperCase = String.prototype.toUpperCase;
    ns.StringToWellFormed = String.prototype.toWellFormed;
    ns.StringTrim = String.prototype.trim;
    ns.StringTrimEnd = String.prototype.trimEnd;
    ns.StringTrimStart = String.prototype.trimStart;
    ns.StringValueOf = String.prototype.valueOf;
})(AvNs || {});
(function TrafficMapMain(ns)
{
    var NativeMap = null; 
    var NativeProto = null; 
    var SafeProto = null; 
    var nativeMapGroupBy = null; 
    var originString = window.String;
    if (typeof Map === "function")
    {
        NativeMap = Map; 
        NativeProto = Map.prototype; 
        SafeProto = ns.GetSafePrototype(NativeProto);
        nativeMapGroupBy = Map.groupBy; 
    }
    function SafeMapGroupBy()
    {
        var result = nativeMapGroupBy.apply(NativeMap, arguments);
        return ns.ChangeProto(result, SafeProto);
    }
    function SafeMap()
    {
        var args = ns.Array.from(arguments);
        var newMap = new (NativeMap.bind.apply(NativeMap, ns.Array(null).concat(args))); 
        return ns.ChangeProto(newMap, SafeProto);
    }
    function LegacyMap(entries)
    {
        this.mapData = (typeof ns.Object.create === "function") ? ns.Object.create(null) : new ns.Object({});
        this.size = 0;
        if (entries)
        {
            ns.Array.from(entries).forEach(function Add(pair)
            {
                if (pair && typeof pair[0] !== "undefined")
                {
                    this.set(pair[0], pair[1]);
                    this.size++;
                }
            }, this);
        }
    }
    function GetKeyStr(key)
    {
        if (typeof key !== "string" && typeof key !== "number")
            return '';
        var k = originString(key);
        return (k !== "__proto__" && k !== "constructor" && k !== "prototype") ? k : '';
    }
    function LegacyMapSet(key, value)
    {
        var k = GetKeyStr(key);
        if (!k)
            return;
        if (typeof ns.Object.defineProperty === "function")
        {
            ns.Object.defineProperty(
                this.mapData, 
                k,
                {
                    value: value,
                    writable: true,
                    enumerable: true,
                    configurable: true
                }
            );
        }
        else
        {
            this.mapData[k] = value; 
        }
        this.size++;
    };
    function LegacyMapGet(key)
    {
        var k = GetKeyStr(key);
        if (!k)
            return null;
        return ns.Object.hasOwnProperty.call(this.mapData, k) 
            ? this.mapData[k] 
            : null;
    };
    function LegacyMapHas(key)
    {
        var k = GetKeyStr(key);
        if (!k)
            return false;
        return ns.Object.hasOwnProperty.call(this.mapData, k);
    };
    function LegacyMapDelete(key)
    {
        var k = GetKeyStr(key);
        if (!k)
            return;
        delete this.mapData[k]; 
        this.size--;
    };
    function LegacyMapForEach(callback, thisArg)
    {
        if (typeof callback !== "function")
            throw new Error("Callback must be a function");
        var data = this.mapData;
        for (var key in data)
        {
            if (ns.Object.hasOwnProperty.call(data, key))
                callback.call(thisArg, data[key], key, this); 
        }
    };
    if (NativeMap)
    {
        SafeMap.prototype = SafeProto;
        SafeMap.prototype.constructor = SafeMap;
        SafeMap.groupBy = SafeMapGroupBy;
        ns.Object.freeze(SafeProto);
        ns.Object.freeze(SafeMap);
        ns.Map = SafeMap;
    }
    else
    {
        LegacyMap.prototype.set = LegacyMapSet;
        LegacyMap.prototype.get = LegacyMapGet;
        LegacyMap.prototype.has = LegacyMapHas;
        LegacyMap.prototype["delete"] = LegacyMapDelete;
        LegacyMap.prototype.forEach = LegacyMapForEach;
        ns.Map = LegacyMap;
    }
})(AvNs || {});
(function CommonMain(ns)
{
    ns.XMLHttpRequest = window.XMLHttpRequest;
    ns.XDomainRequest = window.XDomainRequest;
    ns.XMLHttpRequestOpen = window.XMLHttpRequest && window.XMLHttpRequest.prototype.open;
    ns.XMLHttpRequestSend = window.XMLHttpRequest && window.XMLHttpRequest.prototype.send;
    ns.XMLHttpRequestAbort = window.XMLHttpRequest && window.XMLHttpRequest.prototype.abort;
    ns.XMLHttpRequestSetRequestHeader = window.XMLHttpRequest && window.XMLHttpRequest.prototype.setRequestHeader;
    var originalCreateTreeWalker = document.createTreeWalker;
    ns.CreateTreeWalker = function CreateTreeWalker(root, whatToShow, filter, entityReferenceExpansion)
    {   
        if (typeof (originalCreateTreeWalker) !== "function")
            throw new Error("document.createTreeWalker not implemented");
        return originalCreateTreeWalker.call(document, root, whatToShow, filter, entityReferenceExpansion);
    };
    ns.ElementSetAttribute = Element.prototype.setAttribute;
    ns.ElementAttachShadow = Element.prototype.attachShadow;
    ns.documentCreateTextNode = document.createTextNode;
    ns.documentStyleSheets = document.styleSheets;
    ns.Navigator = navigator;
    ns.SendBeacon = navigator && navigator.sendBeacon;
    if (typeof Set === "undefined")
    {
        ns.Set = null;
        ns.SetAdd = null;
    }
    else
    {
        ns.Set = Set; 
        ns.SetAdd = Set.prototype.add; 
    }
    ns.EmptyFunc = function EmptyFunc()
    {
    };
    ns.IsStringEqualIgnoreCase = function IsStringEqualIgnoreCase(left, right)
    {
        if (typeof left !== "string" || typeof right !== "string")
            return false;
        return ns.StringToLowerCase.call(left) === ns.StringToLowerCase.call(right);
    };
    ns.MaxRequestDelay = 2000;
    ns.Log = ns.EmptyFunc;
    ns.SessionLog = ns.Log;
    ns.SessionError = ns.Log;
    function GetHostAndPort(url)
    {
        if (!url)
            return "";
        var urlString = typeof url !== "string" ? url.toString() : url;
        var hostBeginPos = ns.StringIndexOf.call(urlString, "//");
        if (hostBeginPos === -1)
        {
            urlString = document.baseURI || "";
            hostBeginPos = ns.StringIndexOf.call(urlString, "//");
            if (hostBeginPos === -1)
                return "";
        }
        hostBeginPos += 2;
        var hostEndPos = ns.StringIndexOf.call(urlString, "/", hostBeginPos);
        if (hostEndPos === -1)
            hostEndPos = urlString.length;
        var originParts = ns.StringSplit.call(ns.StringSubstring.call(urlString, 0, hostEndPos), "@");
        var origin = originParts.length > 1 ? originParts[1] : originParts[0];
        return origin[0] === "/" ? document.location.protocol + origin : origin;
    }
    ns.IsCorsRequest = function IsCorsRequest(url, initiator)
    {
        try
        {
            var urlOrigin = GetHostAndPort(url);
            var initiatorOrigin = GetHostAndPort(initiator);
            return Boolean(urlOrigin) && Boolean(initiatorOrigin) && urlOrigin !== initiatorOrigin;
        }
        catch (e)
        {
            ns.SessionLog("Error check CORS request, url: " + url + " , initiator: " + initiator + ", error: " + e.message);
            return false;
        }
    };
    ns.TryCreateUrl = function TryCreateUrl(url)
    {
        try
        {
            var replacedUrl = ns.StringReplace.call(url, /(https?:\/\/)\.(?=[0-9xa-fA-F])/i, "$1"); 
            return new ns.URL(replacedUrl);
        }
        catch (e)
        {
            ns.SessionLog("Can't create URL from " + url);
            return null;
        }
    };
    ns.TrySendMessage = function TrySendMessage(port, message)
    {
        try
        {
            port.postMessage(message);
        }
        catch (e)
        {
            if (e.message && ns.StringStartsWith.call(e.message, "Attempt to postMessage on disconnected port"))
                ns.SessionLog("Attempt to postMessage on disconnected port: " + JSON.stringify(message));
            else
                ns.SessionError(e, "nms_back");
        }
    };
    ns.HasValue = function HasValue(value)
    {
        return value && value.length !== 0;
    };
    ns.GetResourceSrc = function GetResourceSrc(resourceName)
    {
        return ns.GetBaseUrl() + ns.RESOURCE_ID + resourceName;
    };
    ns.IsRelativeTransport = function IsRelativeTransport()
    {
        return ns.PREFIX === "/";
    };
    ns.GetBaseUrl = function GetBaseUrl()
    {
        if (!ns.IsRelativeTransport())
            return ns.PREFIX;
        return document.location.protocol + "//" + document.location.host + "/";
    };
    var originalAppendChild = document.appendChild;
    ns.AppendChild = function AppendChild(element, addElement)
    {
        return originalAppendChild.call(element, addElement);
    };
    var originalAddEventListener = document.addEventListener;
    var originalWindowAddEventListener = window.addEventListener;
    ns.AddEventListener = function AddEventListener(element, name, func, pluginId)
    {
        if (typeof originalAddEventListener === "function")
        {
            var callingFunction = element === window ? originalWindowAddEventListener : originalAddEventListener;
            callingFunction.call(element,
                name,
                function EventListenerCallback(e)
                {
                    try
                    {
                        func(e || window.event);
                    }
                    catch (ex)
                    {
                        ns.SessionError(ex, pluginId);
                    }
                }, 
                true);
        }
        else
        {
            element.attachEvent("on" + name, 
                function EventListenerCallback(e)
                {
                    try
                    {
                        func.call(element, e || window.event);
                    }
                    catch (ex)
                    {
                        ns.SessionError(ex, pluginId);
                    }
                });
        }
    };
    ns.AddRemovableEventListener = function AddRemovableEventListener(element, name, func)
    {
        if (originalAddEventListener)
        {
            var callingFunction = element === window ? originalWindowAddEventListener : originalAddEventListener;
            callingFunction.call(element, name, func, true);
        }
        else
        {
            element.attachEvent("on" + name, func);
        }
    };
    ns.RemoveElement = function RemoveElement(element)
    {
        element && element.parentNode && element.parentNode.removeChild(element);
    };
    var originalDocumentCreateElement = document.createElement;
    ns.DocumentCreateElement = function DocumentCreateElement(elementType)
    {
        return originalDocumentCreateElement.call(document, elementType);
    };
    var originalDocumentQuerySelectorAll = document.querySelectorAll;
    ns.HasDocumentQuerySelectorAll = function HasDocumentQuerySelectorAll()
    {
        return Boolean(originalDocumentQuerySelectorAll);
    };
    ns.DocumentQuerySelectorAll = function DocumentQuerySelectorAll(selector)
    {
        return originalDocumentQuerySelectorAll.call(document, selector);
    };
    var originalElementQuerySelectorAll = Element.prototype.querySelectorAll;
    ns.HasElementQuerySelectorAll = function HasElementQuerySelectorAll()
    {
        return Boolean(originalElementQuerySelectorAll);
    };
    ns.ElementQuerySelectorAll = function ElementQuerySelectorAll(element, selector)
    {
        return originalElementQuerySelectorAll.call(element, selector);
    };
    var originalDocumentQuerySelector = document.querySelector;
    ns.HasDocumentQuerySelector = function HasDocumentQuerySelector()
    {
        return Boolean(originalDocumentQuerySelector);
    };
    ns.DocumentQuerySelector = function DocumentQuerySelector(selector)
    {
        return originalDocumentQuerySelector.call(document, selector);
    };
    var originalElementQuerySelector = Element.prototype.querySelector;
    ns.HasElementQuerySelector = function HasElementQuerySelector()
    {
        return Boolean(originalElementQuerySelector);
    };
    ns.ElementQuerySelector = function ElementQuerySelector(element, selector)
    {
        return originalElementQuerySelector.call(element, selector);
    };
    ns.RunModule = function RunModule(func, timeout)
    {
        if (document.readyState === "loading")
        {
            if (timeout)
                ns.SetTimeout(func, timeout);
            var delayFunc = function DelayFunc() { ns.SetTimeout(func, 0); };
            if (document.addEventListener)
                ns.AddEventListener(document, "DOMContentLoaded", delayFunc);
            ns.AddEventListener(window, "load", delayFunc);
        }
        else
        {
            ns.SetTimeout(func, 0); 
        }
    };
    ns.RemoveEventListener = function RemoveEventListener(element,  name, func)
    {
        if (element.removeEventListener)
            element.removeEventListener(name, func, true);
        else
            element.detachEvent("on" + name, func);
    };
    var oldSetTimeout = setTimeout;
    var oldClearTimeout = clearTimeout;
    ns.SetTimeout = function SetTimeout(func, timeout, pluginId)
    {
        return oldSetTimeout.call(window, function TimerCallback()
            {
                try
                {
                    func();
                }
                catch (e)
                {
                    ns.SessionError(e, pluginId);
                }
            }, timeout);
    };
    ns.ClearTimeout = function ClearTimeout(id)
    {
        oldClearTimeout.call(window, id);
    };
    var oldSetInterval = setInterval;
    var oldClearInterval = clearInterval;
    ns.SetInterval = function SetInterval(func, interval, pluginId)
    {
        return oldSetInterval.call(window, function IntervalCallback()
            {
                try
                {
                    func();
                }
                catch (e)
                {
                    ns.SessionError(e, pluginId);
                }
            }, interval);
    };
    ns.ClearInterval = function ClearInterval(id)
    {
        return oldClearInterval.call(window, id);
    };
    ns.GetOwnerNode = function GetOwnerNode(element)
    {
        return element.ownerNode || element.owningElement;
    };
    function InsertStyleRule(style, rule)
    {
        try
        {
            if (style.styleSheet)
            {
                style.styleSheet.cssText += rule + "\n";
            }
            else
            {
                ns.AppendChild(style, ns.documentCreateTextNode.call(document, rule));
                ns.SetTimeout(function TimerCallback()
                    {
                        if (!style.sheet)
                            return;
                        var rules = style.sheet.cssRules || style.sheet.rules;
                        if (rules && rules.length === 0)
                            style.sheet.insertRule(rule);
                    }, 500);
            }
        }
        catch (e)
        {
            if (e.message === "can't access dead object")
                ns.SessionLog("Trying to set css for dead object");
            else
                throw e;
        }
    }
    function FindStyle(document, style)
    {
        ns.Array.from(ns.documentStyleSheets).forEach(function ForEachStyleSheet(styleSheet)
        {
            var ownerNode = ns.GetOwnerNode(styleSheet);
            if (ownerNode && ownerNode.className === "abn_style" && ownerNode.textContent === style.textContent)
                return ownerNode;
        });
        return null;
    }
    function GetHead()
    {
        var headElements = document.getElementsByTagName("head");
        return headElements.length !== 0 ? headElements[0] : null;
    }
    function AddDocumentStyles(document, rules)
    {
        if (typeof rules !== "object" || rules.constructor !== Array)
            return new ns.Array();
        var styles = new ns.Array();
        for (var i = 0, len = rules.length; i < len;)
        {
            var style = ns.DocumentCreateElement("style");
            style.type = "text/css";
            style.className = "abn_style";
            style.setAttribute("nonce", ns.ContentSecurityPolicyNonceAttribute);
            for (var n = 0; n < 4 && i < len; ++n, ++i)
            {
                var rule = rules[i]; 
                if (originalDocumentQuerySelectorAll)
                {
                    InsertStyleRule(style, rule);
                }
                else
                {
                    var styleBegin = ns.StringLastIndexOf.call(rule, "{");
                    if (styleBegin === -1)
                        continue;
                    var styleText = ns.StringSubstr.call(rule, styleBegin);
                    var selectors = ns.Array.from(ns.StringSplit.call(ns.StringSubstr.call(rule, 0, styleBegin), ","));
                    if (style.styleSheet)
                    {
                        var cssText = "";
                        selectors.forEach(function ForEachSelector(selector) 
                        {
                            cssText += selector + styleText + "\n";
                        });
                        style.styleSheet.cssText += cssText;
                    }
                    else
                    {
                        selectors.forEach(function ForEachSelectorLegacy(selector) 
                        {
                            ns.AppendChild(style, ns.documentCreateTextNode.call(document, selector + styleText));
                        });
                    }
                }
            }
            var inserted = FindStyle(document, style);
            if (inserted && inserted.parentNode)
                inserted.parentNode.removeChild(inserted);
            if (document.head && typeof document.head.appendChild === "function")
            {
                ns.AppendChild(document.head, style);
            }
            else
            {
                var head = GetHead();
                if (head)
                {
                    ns.AppendChild(head, style);
                }
                else
                {
                    ns.AddEventListener(document, "load", function AddStyle()
                    {
                        var element = document.head || GetHead();
                        if (!element)
                            return;
                        styles.forEach(function ForEachStyle(currentStyle)
                        {
                            ns.AppendChild(element, currentStyle);
                        });
                    });
                }
            }
            styles.push(style);
        }
        return styles;
    }
    ns.AddStyles = function AddStyles(rules)
    {
        return AddDocumentStyles(document, rules);
    };
    ns.GetCurrentIsoDate = function GetCurrentIsoDate()
    {
        return new ns.Date().toISOString();
    };
    ns.GetCurrentTime = function GetCurrentTime()
    {
        try
        {
            return new ns.Date().getTime();
        }
        catch (e)
        {
            ns.SessionError(e);
            return 0;
        }
    };
    ns.GetPageScroll = function GetPageScroll()
    {
        var documentScrollLeft = 0;
        var documentScrollTop = 0;
        if (document.documentElement)
        {
            documentScrollLeft = document.documentElement.scrollLeft;
            documentScrollTop = document.documentElement.scrollTop;
        }
        var bodyScrollLeft = 0;
        var bodyScrollTop = 0;
        if (document.body)
        {
            bodyScrollLeft = document.body.scrollLeft;
            bodyScrollTop = document.body.scrollTop;
        }
        return new ns.Object({ left: documentScrollLeft || bodyScrollLeft || 0, top: documentScrollTop || bodyScrollTop || 0 });
    };
    ns.GetPageHeight = function GetPageHeight()
    {
        return document.documentElement.clientHeight || document.body.clientHeight;
    };
    ns.GetPageWidth = function GetPageWidth()
    {
        return document.documentElement.clientWidth || document.body.clientWidth;
    };
    ns.IsDefined = function IsDefined(variable)
    {
        return typeof variable !== "undefined";
    };
    ns.StopProcessingEvent = function StopProcessingEvent(evt)
    {
        if (evt.preventDefault)
            evt.preventDefault();
        else
            evt.returnValue = false;
        if (evt.stopPropagation)
            evt.stopPropagation();
        if (ns.IsDefined(evt.cancelBubble))
            evt.cancelBubble = true;
    };
    var originalBtoa = window.btoa;
    function Base64EncodeUnicode(str)
    {
        return originalBtoa.call(window, ns.StringReplace.call(encodeURIComponent(str), /%([0-9A-F]{2})/g, function toSolidBytes(match, p1)
            {
                return ns.StringFromCharCode("0x" + p1);
            }));
    }
    ns.ToBase64 = function ToBase64(value)
    {
        try
        {
            if (ns.IsDefined(originalBtoa))
                return Base64EncodeUnicode(value);
            var Base64Alphabit = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            var plain = value;
            var padLength = 0;
            if (plain.length % 3)
            {
                padLength = 3 - (plain.length % 3);
                for (var j = 0; j < padLength; ++j)
                    plain += "\0";
            }
            var result = "";
            for (var i = 0; i < plain.length; i += 3)
            {
                var byte1 = ns.StringCharCodeAt.call(plain, i);
                var byte2 = ns.StringCharCodeAt.call(plain, i + 1);
                var byte3 = ns.StringCharCodeAt.call(plain, i + 2);
                var temp = (byte1 << 16) | (byte2 << 8) | byte3;
                var sixBit1 = (temp >> 18) & 0x3f;
                var sixBit2 = (temp >> 12) & 0x3f;
                var sixBit3 = (temp >> 6) & 0x3f;
                var sixBit4 = temp & 0x3f;
                result += ns.StringCharAt.call(Base64Alphabit, sixBit1) + ns.StringCharAt.call(Base64Alphabit, sixBit2) + 
                                               ns.StringCharAt.call(Base64Alphabit, sixBit3) + ns.StringCharAt.call(Base64Alphabit, sixBit4);
            }
            if (padLength > 0)
            {
                result = ns.StringSlice.call(result, 0, result.length - padLength);
                for (var k = 0; k < padLength; ++k)
                    result += "=";
            }
            return result;
        }
        catch (e)
        {
            ns.SessionError("Cannot convert to Base64: " + e.message, "common");
        }
        return "";
    };
    ns.StartLocationHref = document.location.href;
    ns.IsTopLevel = window && window === window.top;
    ns.IsElementVisibleCheckApplicable = function IsElementVisibleCheckApplicable()
    {
        return window && window.getComputedStyle;
    };
    ns.IsElementVisible = function IsElementVisible(element)
    {
        return window.getComputedStyle(element).visibility === "visible";
    };
    var originalElement = Element;
    ns.IsElementDisplayed = function IsElementDisplayed(element)
    {
        var style = (ns.IsElementVisibleCheckApplicable() && originalElement && element instanceof originalElement) ? window.getComputedStyle(element) : element.currentStyle;
        if (!style)
            return false;
        return style.display !== "none";
    };
    ns.DisableElementById = function DisableElementById(id)
    {
        var el = document.getElementById(id);
        if (el)
            el.classList.add("disabled");
    };
    ns.GetPageStartTime = function GetPageStartTime()
    {
        return window && window.performance && window.performance.timing && window.performance.timing.domContentLoadedEventStart
            ? window.performance.timing.domContentLoadedEventStart
            : 0;
    };
    ns.GetPageStartNavigationTime = function GetPageStartNavigationTime()
    {
        return window && window.performance && window.performance.timing && window.performance.timing.navigationStart
            ? window.performance.timing.navigationStart
            : 0;
    };
    ns.TryGetTagName = function TryGetTagName(element)
    {
        try
        {
            return element.tagName;
        }
        catch (e)
        {
            return "";
        }
    };
    ns.IsValidTargetProperty = function IsValidTargetProperty(event)
    {
        try
        {
            return event && event.target;
        }
        catch (e)
        {
            ns.SessionLog(e);
            return false;
        }
    };
    ns.IsEqualNodeName = function IsEqualNodeName(element, nodeName)
    {
        try
        {
            if (!element)
                return false;
            return ns.IsStringEqualIgnoreCase(element.nodeName, nodeName);
        }
        catch (e)
        {
            ns.SessionLog(e);
            return false;
        }
    };
    ns.IsMac = function IsMac()
    {
        return navigator ? (/Macintosh|Mac OS X/i).test(navigator.userAgent) : false;
    };
    var historyChangeSubscribers = new ns.Array();
    var previousLocationHref = ns.StartLocationHref;
    function NotifyHistoryChanged()
    {
        try
        {
            if (previousLocationHref !== document.location.href)
            {
                ns.SessionLog("History changed: " + document.location.href);
                previousLocationHref = document.location.href;
                historyChangeSubscribers.forEach(function ForEachHistorySubscriber(subscriber)
                {
                    try
                    {
                        subscriber.notify();
                    }
                    catch (e)
                    {
                        ns.SessionError(e, subscriber.injector);
                    }
                });
            }
            else
            {
                ns.SessionLog("Ignore history change notification because href is not changed: " + document.location.href);
            }
        }
        catch (e)
        {
            ns.SessionError(e, "history_wrapper");
        }
    }
    ns.SubscribeHistoryChanged = function SubscribeHistoryChanged(subscribedInjector, callback)
    {
        historyChangeSubscribers.push(new ns.Object({ injector: subscribedInjector, notify: callback }));
    };
    ns.UnsubscribeHistoryChanged = function UnsubscribeHistoryChanged(injector)
    {
        var result = new ns.Array();
        historyChangeSubscribers.forEach(function ForEachHistorySubscriber(subscriber)
        {
            if (subscriber.injector !== injector) 
                result.push(subscriber);
        });
        historyChangeSubscribers = result;
    };
    function PostponeNotifyHistoryChanged()
    {
        ns.SetTimeout(NotifyHistoryChanged, 100, "history_wrapper");
    }
    if (window.history)
    {
        var oldWindowHistory = window.history;
        var oldBack = window.history.back;
        var oldForward = window.history.forward;
        var oldGo = window.history.go;
        var oldPushState = window.history.pushState;
        var oldReplaceState = window.history.replaceState;
        window.history.back = function WrapperBack()
        {
            oldBack.apply(oldWindowHistory);
            PostponeNotifyHistoryChanged();
        };
        window.history.forward = function WrapperForward()
        {
            oldForward.apply(oldWindowHistory);
            PostponeNotifyHistoryChanged();
        };
        window.history.go = function WrapperGo()
        {
            oldGo.apply(oldWindowHistory, arguments);
            PostponeNotifyHistoryChanged();
        };
        window.history.pushState = function WrapperPushState()
        {
            oldPushState.apply(oldWindowHistory, arguments);
            PostponeNotifyHistoryChanged();
        };
        window.history.replaceState = function WrapperReplaceState()
        {
            oldReplaceState.apply(oldWindowHistory, arguments);
            PostponeNotifyHistoryChanged();
        };
        ns.WindowHistoryPushState = function PushStateExecutor()
        {
            oldPushState.apply(oldWindowHistory, arguments);
        };
    }
    else
    {
        ns.WindowHistoryPushState = ns.EmptyFunc;
    }
    return ns;
})(AvNs);
(function CommonMutation(ns)
{
    function IsElementNode(node)
    {
        return node.nodeType === 1; 
    }
    function IsNodeContainsElementWithTag(node, observeTag)
    {
        try
        {
            return observeTag === "*" || (IsElementNode(node) && (ns.IsStringEqualIgnoreCase(node.tagName, observeTag) || node.getElementsByTagName(observeTag).length > 0));
        }
        catch (e)
        {
            return false;
        }
    }
    function MutationChangeObserver(observeTag, pluginId)
    {
        var m_observer = null;
        var m_callback = null;
        var m_functionCheckInteresting = observeTag ? function functionCheckInteresting(node) { return IsNodeContainsElementWithTag(node, observeTag); } : IsElementNode;
        function ProcessNodeList(nodeList)
        {
            var exists = false;
            ns.Array.from(nodeList).forEach(function ForEachNode(node)
            {
                if (m_functionCheckInteresting(node))
                    exists = true;
            });
            return exists;
        }
        function ProcessDomChange(records)
        {
            try
            {
                if (!m_callback)
                    return;
                for (var i = 0; i < records.length; ++i)
                {
                    var record = records[i]; 
                    if ((record.addedNodes.length && ProcessNodeList(record.addedNodes))
                        || (record.removedNodes.length && ProcessNodeList(record.removedNodes)))
                    {
                        m_callback();
                        return;
                    }
                }
            }
            catch (e)
            {
                ns.SessionError(e, pluginId);
            }
        }
        this.Start = function Start(callback)
        {
            m_callback = callback;
            m_observer = new MutationObserver(ProcessDomChange);
            m_observer.observe(document, new ns.Object({ childList: true, subtree: true }));
        };
        this.Stop = function Stop()
        {
            if (m_observer)
                m_observer.disconnect();
            m_observer = null;
            m_callback = null;
        };
    }
    function DomEventsChangeObserver(observeTag, pluginId)
    {
        var m_callback = null;
        var m_functionCheckInteresting = observeTag ? function functionCheckInteresting(node) { return IsNodeContainsElementWithTag(node, observeTag); } : IsElementNode;
        function ProcessEvent(event)
        {
            try
            {
                if (!m_callback)
                    return;
                if (m_functionCheckInteresting(event.target))
                    m_callback();
            }
            catch (e)
            {
                ns.SessionError(e, pluginId);
            }
        }
        this.Start = function Start(callback)
        {
            ns.AddRemovableEventListener(window, "DOMNodeInserted", ProcessEvent);
            ns.AddRemovableEventListener(window, "DOMNodeRemoved", ProcessEvent);
            m_callback = callback;
        };
        this.Stop = function Stop()
        {
            ns.RemoveEventListener(window, "DOMNodeInserted", ProcessEvent);
            ns.RemoveEventListener(window, "DOMNodeRemoved", ProcessEvent);
            m_callback = null;
        };
    }
    function TimeoutChangeObserver(observeTag)
    {
        var m_interval = null;
        var m_callback = null;
        var m_tagCount = 0;
        var m_attribute = "klot_" + ns.GetCurrentTime();
        function IsChangesOccure(nodeList)
        {
            var res = false;
            ns.Array.from(nodeList).forEach(function ForEachNode(node)
            {
                if (!node[m_attribute]) 
                    res = true;
            });
            return res;
        }
        function FillTagInfo(nodeList)
        {
            ns.Array.from(nodeList).forEach(function ForEachNode(node)
            {
                node[m_attribute] = true; 
            });
        }
        function TimeoutProcess()
        {
            if (!m_callback)
                return;
            var nodeList = observeTag ? document.getElementsByTagName(observeTag) : document.getElementsByTagName("*");
            if (nodeList.length !== m_tagCount || IsChangesOccure(nodeList))
            {
                FillTagInfo(nodeList);
                m_callback();
            }
        }
        this.Start = function Start(callback)
        {
            m_callback = callback;
            FillTagInfo(document.getElementsByTagName(observeTag));
            m_interval = ns.SetInterval(TimeoutProcess, 10 * 1000);
            if (document.readyState !== "complete")
                ns.AddEventListener(window, "load", TimeoutProcess);
        };
        this.Stop = function Stop()
        {
            ns.ClearInterval(m_interval);
            m_callback = null;
        };
    }
    ns.GetDomChangeObserver = function GetDomChangeObserver(observeTag, pluginId)
    {
        var observeTagLowerCase = observeTag ? ns.StringToLowerCase.call(observeTag) : observeTag;
        if (window.MutationObserver && document.documentMode !== 11)    
            return new MutationChangeObserver(observeTagLowerCase, pluginId);
        if (window.addEventListener)
            return new DomEventsChangeObserver(observeTagLowerCase, pluginId);
        return new TimeoutChangeObserver(observeTagLowerCase);
    };
    return ns;
})(AvNs);
(function Md5Main(ns)
{
    function repeatElem(e, t)
    {
        var r = new ns.Array();
        for (var i = 0; i < t; i++)
            r = r.concat(e);
        return r;
    }
    var S = repeatElem(new ns.Array(7, 12, 17, 22), 4);
    S = S.concat(repeatElem(new ns.Array(5, 9, 14, 20), 4));
    S = S.concat(repeatElem(new ns.Array(4, 11, 16, 23), 4));
    S = S.concat(repeatElem(new ns.Array(6, 10, 15, 21), 4));
    var K = new ns.Array(
        0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee,
        0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
        0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be,
        0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
        0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa,
        0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
        0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed,
        0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
        0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c,
        0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
        0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05,
        0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
        0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039,
        0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
        0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1,
        0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391
    );
    var A0 = 0x67452301;
    var B0 = 0xefcdab89;
    var C0 = 0x98badcfe;
    var D0 = 0x10325476;
    function RotateLeft(i, s)
    {
        return ((i << s) | (i >>> (32 - s)));
    }
    function UnsignedSum(x, y)
    {
        return (x + y) & 0xFFFFFFFF;
    }
    function toHexString(v)
    {
        var s = "";
        for (var i = 0; i < 4; i++)
            s += ((v >>> ((i * 8) + 4)) & 0x0f).toString(16) + ((v >>> (i * 8)) & 0x0f).toString(16);
        return s;
    }
    function dataPrepare(inData)
    {
        var d = inData;
        var l = d.length;
        var res = new ns.Array();
        d += ns.StringFromCharCode(0x80);
        while (d.length % 4) d += ns.StringFromCharCode(0x0);
        for (var i = 0; i < d.length; i += 4)
        {
            res.push((ns.StringCharCodeAt.call(d, i)) | (ns.StringCharCodeAt.call(d, i + 1) << 8) |
                     (ns.StringCharCodeAt.call(d, i + 2) << 16) | (ns.StringCharCodeAt.call(d, i + 3) << 24));
        }
        while (res.length % 16 !== 14) res.push(0x0);
        res.push(l << 3);
        res.push(l >>> 29);
        return res;
    }
    ns.md5 = function md5(data)
    {
        var words = dataPrepare(data);
        var A = A0;
        var B = B0;
        var C = C0;
        var D = D0;
        for (var i = 0; i < words.length; i += 16)
        {
            var a = A;
            var b = B;
            var c = C;
            var d = D;
            var block = words.slice(i, i + 16);
            for (var j = 0; j < 64; j++)
            {
                var f = 0;
                var g = 0;
                switch (Math.floor(j / 16))
                {
                    case 0:
                        f = (b & c) | ((~b) & d);
                        g = j;
                        break;
                    case 1:
                        f = (d & b) | ((~d) & c);
                        g = (5 * j) + 1;
                        break;
                    case 2:
                        f = b ^ c ^ d;
                        g = (3 * j) + 5;
                        break;
                    case 3:
                        f = c ^ (b | (~d));
                        g = 7 * j;
                        break;
                    default:
                }
                g -= 16 * Math.floor(g / 16);
                f = UnsignedSum(UnsignedSum(f, a), UnsignedSum(K[j], block[g])); 
                a = d;
                d = c;
                c = b;
                b = UnsignedSum(b, RotateLeft(f, S[j])); 
            }
            A = UnsignedSum(A, a);
            B = UnsignedSum(B, b);
            C = UnsignedSum(C, c);
            D = UnsignedSum(D, d);
        }
        var digest = toHexString(A) + toHexString(B) + toHexString(C) + toHexString(D);
        return digest;
    };
})(AvNs);
(function AjaxTransportMain(ns)
{
var ajaxRequestProvider = (function ajaxRequestProvider()
    {
        return {
            GetAsyncRequest: function GetAsyncRequest()
                {
                    var xmlhttp = ns.XDomainRequest ? new ns.XDomainRequest() : new ns.XMLHttpRequest();
                    if (!ns.XDomainRequest)
                    {
                        xmlhttp.open = ns.XMLHttpRequestOpen;
                        xmlhttp.send = ns.XMLHttpRequestSend;
                        xmlhttp.abort = ns.XMLHttpRequestAbort;
                        xmlhttp.setRequestHeader = ns.XMLHttpRequestSetRequestHeader;
                    }
                    xmlhttp.onprogress = ns.EmptyFunc;
                    return xmlhttp;
                }
        };
    })();
var restoreSessionCallback = ns.EmptyFunc;
var PingPongCallReceiver = function PingPongCallReceiver(caller)
{
    var m_caller = caller;
    var m_isProductConnected = false;
    var m_pingWaitResponse = false;
    var m_requestDelay = ns.MaxRequestDelay;
    var m_requestTimer = null;
    var m_callCallback = ns.EmptyFunc;
    var m_errorCallback = ns.EmptyFunc;
    var m_updateCallback = ns.EmptyFunc;
    var m_pluginId = "ajax";
    var m_waitRequestsCount = 0;
    var m_stopped = false;
    function SendRequest()
    {
        try 
        {
            m_waitRequestsCount++;
            m_caller.Call(
                "from",
                null,
                null,
                function CallCallback(result, parameters, method)
                {
                    m_pingWaitResponse = false;
                    m_isProductConnected = true;
                    if (parameters === "undefined" || method === "undefined") 
                    {
                        m_errorCallback("AJAX pong is not received. Product is deactivated");
                        m_waitRequestsCount--;
                        return;
                    }
                    if (method)
                    {
                        ns.SetTimeout(function TimerCallback() { SendRequest(); }, 0, m_pluginId);
                        m_callCallback(method, parameters);
                    }
                    m_waitRequestsCount--;
                },
                function ErrorCallback(error)
                {
                    m_pingWaitResponse = false;
                    m_isProductConnected = false;
                    restoreSessionCallback();
                    m_errorCallback(error);
                    m_waitRequestsCount--;
                }
                );
            m_pingWaitResponse = true;
        }
        catch (e)
        {
            m_errorCallback("Ajax send ping exception: " + (e.message || e));
        }
    }
    function Ping()
    {
        try
        {
            if (m_stopped)
                return;
            if (m_pingWaitResponse)
            {
                m_requestTimer = ns.SetTimeout(Ping, 100, m_pluginId);
                return;
            }
            m_requestDelay = m_updateCallback();
            if (typeof (m_requestDelay) === "undefined")
                return;
            SendRequest();
            m_requestTimer = ns.SetTimeout(Ping, m_requestDelay, m_pluginId);
        }
        catch (e)
        {
            m_errorCallback("Send ping request: " + (e.message || e));
        }
    }
    this.StartReceive = function StartReceive(callCallback, errorCallback, updateCallback)
    {
        m_isProductConnected = true;
        m_callCallback = callCallback;
        m_errorCallback = errorCallback;
        m_updateCallback = updateCallback;
        m_requestDelay = m_updateCallback();
        m_requestTimer = ns.SetTimeout(Ping, m_requestDelay, m_pluginId);
        m_stopped = false;
    };
    this.ForceReceive = function ForceReceive()
    {
        ns.ClearTimeout(m_requestTimer);
        m_requestTimer = ns.SetTimeout(Ping, 0, m_pluginId);
    };
    this.StopReceive = function StopReceive()
    {
        m_stopped = true;
        if (m_requestTimer)
        {
            ns.ClearTimeout(m_requestTimer);
            m_requestTimer = null;
        }
        m_callCallback = ns.EmptyFunc;
        m_errorCallback = ns.EmptyFunc;
        m_updateCallback = ns.EmptyFunc;
    };
    this.IsStarted = function IsStarted()
    {
        return m_requestTimer !== null;
    };
    this.IsProductConnected = function IsProductConnected()
    {
        return m_isProductConnected;
    };
    this.GetWaitRequests = function GetWaitRequests()
    {
        if (m_requestTimer)
        {
            ns.ClearTimeout(m_requestTimer);
            m_requestTimer = null;
        }
        return m_waitRequestsCount;
    };
};
var LongPoolingReceiver = function LongPoolingReceiver(caller)
{
    var m_caller = caller;
    var m_isProductConnected = false;
    var m_isStarted = false;
    var m_callCallback = ns.EmptyFunc;
    var m_errorCallback = ns.EmptyFunc;
    var m_pluginId = "long_pooling";
    function SendRequest(onResponseCallback)
    {
        try 
        {
            m_isProductConnected = true;
            m_caller.Call(
                "longpooling",
                null,
                null,
                onResponseCallback,
                function ErrorCallback(error)
                {
                    m_isProductConnected = false;
                    restoreSessionCallback();
                    m_errorCallback(error);
                },
                true
                );
        }
        catch (e)
        {
            ns.SessionError(e, "ajax_longpooling");
            m_errorCallback("Ajax send ping exception: " + (e.message || e));
        }
    }
    function OnResponse(result, parameters, method)
    {
        if (!ns.IsDefined(parameters) || !ns.IsDefined(method))
        {
            m_errorCallback("AJAX pong is not received. Product is deactivated");
            return;
        }
        ns.SetTimeout(function TimerCallback() { SendRequest(OnResponse); }, 0, m_pluginId);
        if (method)
            m_callCallback(method, parameters);
    }
    this.StartReceive = function StartReceive(callCallback, errorCallback)
    {
        m_isStarted = true;
        m_callCallback = callCallback;
        m_errorCallback = errorCallback;
        SendRequest(OnResponse);
    };
    this.ForceReceive = ns.EmptyFunc;
    this.StopReceive = function StopReceive()
    {
        m_isStarted = false;
        m_callCallback = ns.EmptyFunc;
        m_errorCallback = ns.EmptyFunc;
    };
    this.IsStarted = function IsStarted()
    {
        return m_isStarted;
    };
    this.IsProductConnected = function IsProductConnected()
    {
        return m_isProductConnected;
    };
    this.GetWaitRequests = function GetWaitRequests()
    {
        return 0;
    };
};
var AjaxCallerImpl = function AjaxCallerImpl(onLongPoolingEnable)
{
    var m_path = ns.GetBaseUrl() + ns.SIGNATURE;
    var m_longPoolingRequest = null;
    var m_pluginId = "ajax_caller";
    function NoCacheParameter() 
    {
        return "&nocache=" + Math.floor((1 + Math.random()) * 0x10000).toString(16);
    }
    function PrepareRequestObject(command, commandAttribute, isPost, isSecondCall)
    {
        var request = ajaxRequestProvider.GetAsyncRequest();
        if (request)
        {
            var urlPath = m_path + "/" + command;
            if (commandAttribute)
                urlPath += "/" + commandAttribute;
            var timestampArgument = "tm=" + encodeURIComponent(ns.GetCurrentIsoDate());
            if (isPost)
            {
                urlPath += ((urlPath.indexOf("?") === -1) ? "?" : "&");
                urlPath += timestampArgument;
                if (isSecondCall)
                    urlPath += "&second=true";
                request.open("POST", urlPath);
            }
            else
            {
                if (urlPath.indexOf("?") === -1)
                    urlPath += "?get";
                urlPath += NoCacheParameter();
                urlPath += "&" + timestampArgument;
                if (isSecondCall)
                    urlPath += "&second=true";
                request.open("GET", urlPath, true);
            }
            if (request.setRequestHeader && ns.IsRelativeTransport())
                request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        }
        return request;
    }
    function ClearRequest(request)
    {
        request.onerror = ns.EmptyFunc;
        request.onload = ns.EmptyFunc;
    }
    function GetResponseText(request)
    {
        try
        {
            if (!ns.IsDefined(request.status) || request.status === 200)
                return request.responseText.toString();
        }
        catch (e)
        {
            ns.SessionLog(e);
        }
        return "";
    }
    function AsyncCall(command, commandAttribute, data, callbackResult, callbackError, isLongPoolingCall, isSecondCall)
    {
        try
        {
            var request = PrepareRequestObject(command, commandAttribute, Boolean(data), isSecondCall);
            if (!request) 
            {
                callbackError && callbackError("Cannot create AJAX request!");
                return;
            }
            request.onerror = function onerror()
                {
                    ClearRequest(request);
                    if (!ns.IsDefined(isSecondCall))
                        AsyncCall(command, commandAttribute, data, callbackResult, callbackError, isLongPoolingCall, true);
                    else
                        callbackError && callbackError("AJAX request error for calling " + command + "/" + commandAttribute);
                };
            request.onload = function onload()
                {
                    try
                    {
                        ClearRequest(request);
                        if (ns.IsDefined(request.status) && request.status === 403)
                        {
                            callbackError && callbackError("Forbidden", new ns.Object({ forbidden: true }));
                            return;
                        }
                        if (callbackResult)
                        {
                            var responseText = GetResponseText(request);
                            if (responseText)
                            {
                                callbackResult(responseText);
                                return;
                            }
                            if (!ns.IsDefined(isSecondCall))
                            {
                                AsyncCall(command, commandAttribute, data, callbackResult, callbackError, isLongPoolingCall, true);
                                return;
                            }
                            if (callbackError)
                                callbackError("AJAX request with unsupported url type!"); 
                        }
                    }
                    catch (e)
                    {
                        ns.SessionError(e, m_pluginId);
                    }
                };
            if (isLongPoolingCall)
                m_longPoolingRequest = request;
            request.send(data);
        }
        catch (e)
        {
            if (callbackError)
                callbackError("AJAX request " + command  + "/" + commandAttribute + " exception: " + (e.message || e));
        }
    }
    this.Start = function Start(callbackSuccess)
    {
        callbackSuccess();
    };
    this.SendLog = function SendLog(message)
    {
        AsyncCall("log?" + encodeURIComponent(message));
    };
    this.SendResult = function SendResult(methodName, data)
    {
        AsyncCall("callResult", methodName, data);
    };
    function TryJsonParse(str)
    {
        try
        {
            return ns.JSON.parse(str);
        }
        catch (e)
        {
            return null;
        }
    }
    this.Call = function Call(command, commandAttribute, data, callbackResult, callbackError, isLongPoolingCall) 
    {
        AsyncCall(
            command,
            commandAttribute,
            data,
            function CallCallback(responseText)
            {
                var commandResponse = TryJsonParse(responseText);
                if (!commandResponse)
                {
                    callbackError && callbackError("Wrong body of call command. Body is: '" + responseText +
                        "', command is " + command + " command attribute is " + commandAttribute);
                    return;
                }
                if (commandResponse.result === -1610612735)
                {
                    AsyncCall(
                        command,
                        commandAttribute,
                        data,
                        function callCallback(response)
                        {
                            if (!callbackResult)
                                return;
                            commandResponse = ns.JSON.parse(response);
                            callbackResult(commandResponse.result, commandResponse.parameters, commandResponse.method);
                        },
                        callbackError,
                        isLongPoolingCall
                        );
                }
                else if (callbackResult)
                {
                    callbackResult(commandResponse.result, commandResponse.parameters, commandResponse.method);
                }
            },
            callbackError,
            isLongPoolingCall
            );
    };
    this.SessionErrorCall = function SessionErrorCall(message)
    {
        AsyncCall("logerr", null, message);
    };
    this.UnhandledExceptionCall = function UnhandledExceptionCall(message)
    {
        AsyncCall("except", null, message);
    };
    this.Shutdown = function Shutdown()
    {
        if (m_longPoolingRequest)
        {
            if (m_longPoolingRequest.abort)
                m_longPoolingRequest.abort();
            ClearRequest(m_longPoolingRequest);
            m_longPoolingRequest = null;
        }
    };
    this.InitCall = function InitCall(initData, callbackResult, callbackError)
    {
        restoreSessionCallback = callbackError;
        if (ns.StartLocationHref === "data:text/html,chromewebdata")
            return callbackError();
        AsyncCall(
            "init?data=" + encodeURIComponent(ns.ToBase64(ns.JSON.stringify(initData))),
            null,
            null,
            function AsyncCallCallback(responseText)
            {
                try
                {
                    var initSettings = ns.JSON.parse(responseText);
                    m_path = ns.GetBaseUrl() + initSettings.ajaxId + "/" + initSettings.sessionId;
                    if (initSettings.longPooling)
                        onLongPoolingEnable();
                    callbackResult(initSettings);
                } 
                catch (e)
                {
                    restoreSessionCallback && restoreSessionCallback("Error " + e.name + ": " + e.message);
                }
            },
            callbackError
            );
    };
};
ns.Caller = function AjaxCaller()
{
    var m_switchToLongPooling = false;
    var m_caller = new AjaxCallerImpl(OnLongPoolingEnable);
    var m_receiver = new PingPongCallReceiver(m_caller);
    var m_callCallback = ns.EmptyFunc;
    var m_errorCallback = ns.EmptyFunc;
    function StartLongPooling(needRestartReceive)
    {
        m_receiver = new LongPoolingReceiver(m_caller);
        if (needRestartReceive)
            m_receiver.StartReceive(m_callCallback, m_errorCallback);
        ns.SessionLog("Switch to longpooling, receiver restarted: " + needRestartReceive);
    }
    function RestartReceiver()
    {
        var requestsCount = m_receiver.GetWaitRequests();
        if (requestsCount !== 0)
        {
            ns.SessionLog("Wait requests count: " + requestsCount);
            ns.SetTimeout(RestartReceiver, 100, "ajax_caller");
        }
        else
        {
            m_receiver.StopReceive();
            StartLongPooling(true);
        }
    }
    function SwitchToLongPooling()
    {
        var needRestartReceive = m_receiver.IsStarted();
        if (needRestartReceive)
            RestartReceiver();
        else
            StartLongPooling(false);
    }
    function OnLongPoolingEnable()
    {
        if (document.readyState === "complete")
            SwitchToLongPooling();
        else
            m_switchToLongPooling = true;
    }
    this.Start = function Start(callbackSuccess)
    {
        m_caller.Start(callbackSuccess);
    };
    this.SendLog = function SendLog(message)
    {
        m_caller.SendLog(message);
    };
    this.SendResult = function SendResult(methodName, data)
    {
        m_caller.SendResult(methodName, data);
    };
    this.Call = function Call(command, commandAttribute, data, callbackResult, callbackError, isLongPoolingCall)
    {
        m_caller.Call(command, commandAttribute, data, callbackResult, callbackError, isLongPoolingCall);
    };
    this.SessionErrorCall = function SessionErrorCall(message)
    {
        m_caller.SessionErrorCall(message);
    };
    this.UnhandledExceptionCall = function UnhandledExceptionCall(message)
    {
        m_caller.UnhandledExceptionCall(message);
    };
    this.Shutdown = function Shutdown()
    {
        m_caller.Shutdown();
    };
    this.InitCall = function InitCall(initData, callbackResult, callbackError)
    {
        return m_caller.InitCall(initData, callbackResult, callbackError);
    };
    this.GetReceiver = function GetReceiver()
    {
        return this;
    };
    this.StartReceive = function StartReceive(callCallback, errorCallback, updateCallback)
    {
        m_callCallback = callCallback;
        m_errorCallback = errorCallback;
        m_receiver.StartReceive(callCallback, errorCallback, updateCallback);
    };
    this.ForceReceive = function ForceReceive()
    {
        m_receiver.ForceReceive();
    };
    this.StopReceive = function StopReceive()
    {
        m_receiver.StopReceive();
    };
    this.IsStarted = function IsStarted()
    {
        return m_receiver.IsStarted();
    };
    this.IsProductConnected = function IsProductConnected()
    {
        return m_receiver.IsProductConnected();
    };
    ns.AddEventListener(window, "load", function onLoad()
    {
        if (m_switchToLongPooling)
            SwitchToLongPooling();
    }, "ajax_caller");
};
return ns;
})(AvNs);
var avSessionInstance = null;
(function SessionMain(ns)
{
    var runners = new ns.Map();
    var lastPostponedInitTime = ns.GetCurrentTime();
    var postponedInitTimeout = null;
    var enableTracing = false;
    var initPending = false;
    var restartInterval = 0;
    var sessionMarkedForbidden = false;
    var ajaxId = "";
    var sessionId = "";
    if (ns.WORK_IDENTIFIERS)
    {
        var workIdentifiers = ns.Array.from(ns.StringSplit.call(ns.WORK_IDENTIFIERS, ","));
        workIdentifiers.forEach(function ForEachWorkIdentifier(workIdentifier)
        {
            if (window[workIdentifier]) 
            {
                ns.AddRunner = ns.EmptyFunc;
                ns.AddRunner2 = ns.EmptyFunc;
                return;
            }
            window[workIdentifier] = true; 
        });
    }
    var currentScriptPath = "";
    function removeThisScriptElement(injectId)
    {
        var pattern = ns.StringToLowerCase.call(injectId);
        for (var i = 0, scriptsCount = document.scripts.length; i < scriptsCount; ++i) 
        {
            var tag = document.scripts[i]; 
            if (typeof tag.src === "string" && tag.src.length > 45 
                && ns.StringIndexOf.call(ns.StringToLowerCase.call(tag.src), pattern) > 0 
                && (/\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\/main.js/).test(tag.src))
            {
                currentScriptPath = tag.src;
                tag.parentElement.removeChild(tag);
                break; 
            }
        }
    }
    if (ns.INJECT_ID)
        removeThisScriptElement(ns.INJECT_ID);
    var CallReceiver = function CallReceiver(caller)
    {
        var m_plugins = new ns.Map();
        var m_receiver = caller.GetReceiver();
        var m_caller = caller;
        var m_selfMethods = new ns.Map();
        function GetPluginIdFromMethodName(methodName)
        {
            if (methodName)
            {
                var names = ns.StringSplit.call(methodName, ".", 2);
                if (names.length === 2)
                    return names[0];
            }
            return null;
        }
        function GetPluginMethods(pluginId)
        {
            var plugin = m_plugins.get(pluginId);
            return plugin ? plugin.methods : null;
        }
        function CheckCommonMethodName(methodName)
        {
            if (methodName)
            {
                var names = ns.StringSplit.call(methodName, ".", 2);
                if (names.length === 1 && names[0] === methodName)
                    return true;
            }
            return false;
        }
        this.RegisterMethod = function RegisterMethod(methodName, callback)
        {
            var pluginId = GetPluginIdFromMethodName(methodName);
            if (pluginId)
            {
                var methods = GetPluginMethods(pluginId);
                if (methods)
                {
                    if (methods.has(methodName))
                        return;
                    methods.set(methodName, callback);
                }
                else
                {
                    throw new Error("Cannot registered " + methodName);
                }
            }
            else if (CheckCommonMethodName(methodName))
            {
                if (m_selfMethods.has(methodName))
                    throw new Error("Already registered method " + methodName);
                m_selfMethods.set(methodName, callback);
            }
        };
        function CallPluginMethod(pluginId, methodName, args)
        {
            var callback = null;
            if (pluginId)
            {
                var methods = GetPluginMethods(pluginId);
                if (methods) 
                    callback = methods.get(methodName);
            } 
            else
            {
                callback = m_selfMethods.get(methodName);
            }
            if (callback)
            {
                var result = new ns.Object({});
                try 
                {
                    if (args)
                        callback(ns.JSON.parse(args));
                    else
                        callback();
                    result.success = true;
                    m_caller.SendResult(methodName, ns.JSON.stringify(result));
                    return true;
                }
                catch (e)
                {
                    result.success = false;
                    m_caller.SendResult(methodName, ns.JSON.stringify(result));
                    ns.SessionError(e, (pluginId ? pluginId : "common"));
                    return false;
                }
            }
            ns.SessionLog("Cannot call " + methodName + " for plugin " + (pluginId ? pluginId : "common"));
            return false;
        }
        function CallMethod(methodName, args)
        {
            var pluginId = GetPluginIdFromMethodName(methodName);
            if (pluginId || CheckCommonMethodName(methodName))
                CallPluginMethod(pluginId, methodName, args);
        }
        function ReportPluginError(pluginId, status)
        {
            var plugin = m_plugins.get(pluginId);
            if (plugin && plugin.onError)
                plugin.onError(status);
        }
        function ReportError(status)
        {
            m_plugins.forEach(function MapForEach(plugin, pluginId)
            {
                ReportPluginError(pluginId, status);
            });
        }
        function UpdateDelay()
        {
            var newDelay = ns.MaxRequestDelay;
            var currentTime = ns.GetCurrentTime();
            m_plugins.forEach(function MapForEach(plugin, pluginId)
            {
                try
                {
                    var onPing = plugin.onPing;
                    if (onPing)
                    {
                        var delay = onPing(currentTime);
                        if (delay < newDelay && delay > 0 && delay < ns.MaxRequestDelay)
                            newDelay = delay;
                    }
                }
                catch (e)
                {
                    ReportPluginError(pluginId, "UpdateDelay: " + (e.message || e));
                }
            });
            return newDelay;
        }
        this.RegisterPlugin = function RegisterPlugin(pluginId, callbackPing, callbackError, callbackShutdown)
        {
            if (m_plugins.has(pluginId))
                return;
            var plugin = {
                onError: callbackError,
                onPing: callbackPing,
                onShutdown: callbackShutdown,
                methods: new ns.Map()
            };
            m_plugins.set(pluginId, plugin);
            if (!m_receiver.IsStarted())
                m_receiver.StartReceive(CallMethod, ReportError, UpdateDelay);
        };
        function IsPluginListEmpty()
        {
            return m_plugins.size === 0;
        }
        this.UnregisterPlugin = function UnregisterPlugin(pluginId)
        {
            m_plugins.delete(pluginId);
            if (IsPluginListEmpty())
                m_receiver.StopReceive();
        };
        this.ForceReceive = function ForceReceive()
        {
            m_receiver.ForceReceive();
        };
        this.StopReceive = function StopReceive()
        {
            m_receiver.StopReceive();
        };
        this.UnregisterAll = function UnregisterAll()
        {
            if (IsPluginListEmpty())
                return;
            m_plugins.forEach(function MapForEach(plugin)
            {
                plugin.onShutdown();
            });
            m_plugins = new ns.Map();
        };
        this.IsEmpty = IsPluginListEmpty;
        this.IsProductConnected = function IsProductConnected()
        {
            return m_receiver.IsProductConnected();
        };
    };
    function LocalizationObjectFromDictionary(dictionary)
    {
        var object = new ns.Object({});
        if (dictionary)
        {
            for (var i = 0; i < dictionary.length; i++)
                object[dictionary[i].name] = dictionary[i].value; 
        }
        return object;
    }
    function SettingsObjectFromSettingsJson(settingsJson)
    {
        var object = new ns.Object({});
        if (settingsJson)
            object = ns.JSON.parse(settingsJson);
        return object;
    }
    var AvSessionClass = function AvSessionClass(caller)
    {
        var self = this;
        var m_caller = caller;
        var m_callReceiver = new CallReceiver(caller);
        function BeaconSend(command, commandAttribute, data)
        {
            try
            {
                var notEmptyData = data
                    ? data
                    : ns.JSON.stringify({
                            result: 0,
                            method: "nomethod",
                            parameters: ""
                        });
                var maxBeaconPackageSize = 64 * 1024;
                var size = maxBeaconPackageSize;
                if (typeof window.TextEncoder === "function")
                    size = new TextEncoder("utf-8").encode(notEmptyData).length;
                if (ns.SendBeacon && size < maxBeaconPackageSize)
                {
                    var urlPath = ns.GetBaseUrl() + ajaxId + "/" + sessionId + "/" + command + "/" + commandAttribute + "?tm=" + encodeURIComponent(ns.GetCurrentIsoDate());
                    return ns.SendBeacon.call(ns.Navigator, urlPath, notEmptyData);
                }
            }
            catch (e)
            {
                ns.Log("Error on beacon send " + e);
            }
            return false;
        }
        function Call(methodName, argsObj, callbackResult, callbackError)
        {
            if (!m_callReceiver.IsProductConnected())
                return;
            var callback = function callback(result, args, method)
                {
                    if (callbackResult)
                        callbackResult(result, args ? ns.JSON.parse(args) : null, method);
                };
            var data = (argsObj)
                ? ns.JSON.stringify(
                    {
                        result: 0,
                        method: methodName,
                        parameters: ns.JSON.stringify(argsObj)
                    }
                    )
                : null;
            m_caller.Call("to", methodName, data, callback, callbackError);
        }
        function OnUnloadCall(methodName, arrayOfArgs)
        {
            var data = (arrayOfArgs)
                ? ns.JSON.stringify({
                        result: 0,
                        method: methodName,
                        parameters: ns.JSON.stringify(arrayOfArgs)
                    })
                : null;
            return BeaconSend("to", methodName, data);
        }
        function StopImpl(reason)
        {
            try
            {
                m_callReceiver.UnregisterAll();
                if (m_callReceiver.IsProductConnected())
                {
                    if (!BeaconSend("shutdown", reason))
                        m_caller.Call("shutdown", reason);
                }
                m_callReceiver.StopReceive();
                if (m_caller.Shutdown)
                    m_caller.Shutdown();
            }
            catch (e)
            {
            }
        }
        function DeactivatePlugin(pluginId)
        {
            m_callReceiver.UnregisterPlugin(pluginId);
            if (m_callReceiver.IsEmpty())
                StopImpl();
        }
        function ActivatePlugin(pluginId, callbackPing, callbackError, callbackShutdown)
        {
            m_callReceiver.RegisterPlugin(
                pluginId,
                callbackPing,
                function RegisterPluginOnError(e)
                {
                    callbackError && callbackError(e);
                    m_callReceiver.UnregisterPlugin(pluginId);
                    if (m_callReceiver.IsEmpty())
                        StopImpl();
                },
                function RegisterPluginOnShutdown()
                {
                    try
                    {
                        callbackShutdown && callbackShutdown();
                    }
                    catch (ex)
                    {
                        ns.SessionError(ex, pluginId);
                    }
                }
            );
        }
        function RegisterMethod(methodName, callback)
        {
            m_callReceiver.RegisterMethod(methodName, callback);
        }
        function ReloadImpl()
        {
            if (ns.StartLocationHref !== document.location.href)
                ns.WindowHistoryPushState(0, document.title, ns.StartLocationHref);
            window.location.reload(true);
        }
        function ServiceWorkerAllowed()
        {
            try
            {
                return navigator && navigator.serviceWorker && navigator.serviceWorker.controller && navigator.serviceWorker.controller.state === "activated";
            }
            catch (e)
            {
                ns.SessionLog("Service worker not allowed. Error: " + e.message);
                return false;
            }
        }
        function Redirect(param)
        {
            document.location.href = param.targetUrl;
        }
        function ReloadPage()
        {
            if (ServiceWorkerAllowed())
            {
                ns.SetTimeout(ReloadImpl, 1000);
                navigator.serviceWorker.getRegistrations()
                    .then(function getRegistrationsThen(regs)
                        {
                            var countUnregistered = 0;
                            var rest = function rest()
                                {
                                    ++countUnregistered;
                                    if (countUnregistered === regs.length)
                                        ReloadImpl();
                                }; 
                            for (var i = 0; i < regs.length; ++i)
                            {
                                regs[i].unregister() 
                                    .then(rest, rest);
                            }
                        }, ReloadImpl);
            }
            else
            {
                ns.SetTimeout(ReloadImpl, 300);
            }
        }
        function OnStartError(injectorName)
        {
            try 
            {
                var connectionErrorCallback = runners.get(injectorName).onConnectionError;
                if (connectionErrorCallback)
                    connectionErrorCallback();
            }
            catch (e)
            {
                ns.Log(e);
            }
        }
        function StartInjector(param)
        {
            var pluginStartData = new ns.Object({});
            var runner = runners.get(param.injectorName);
            if (runner && runner.getParameters)
                pluginStartData = new ns.Object({ plugin: runner, parameters: ns.JSON.stringify(runner.getParameters()) });
            var startData =
                {
                    url: ns.StartLocationHref,
                    plugins: param.injectorName,
                    data: new ns.Object({ data: pluginStartData }),
                    isTopLevel: ns.IsTopLevel,
                    pageStartTime: ns.GetPageStartTime(),
                    navigationStartTime: ns.GetPageStartNavigationTime()
                };
            m_caller.StartCall(
                startData,
                function StartCallCallback(plugin)
                {
                    if (runner && plugin)
                    {
                        var settings = ns.IsDefined(plugin.settingsJson) ? SettingsObjectFromSettingsJson(plugin.settingsJson) : plugin.settings;
                        var localization = ns.IsDefined(plugin.localizationDictionary) ? LocalizationObjectFromDictionary(plugin.localizationDictionary) : new ns.Object({});
                        runner.runner(AvNs, avSessionInstance, settings, localization);
                    }
                },
                function StartCallOnError()
                { 
                    OnStartError(param.injectorName);
                }
                );
        }
        function OnStopError(injectorName)
        {
            ns.Log("Stop " + injectorName + "injector failed");
        }
        function StopInjector(param)
        {
            var runner = runners.get(param.injectorName);
            m_caller.StopCall(
                param.injectorName,
                function StopCallCallback(plugin)
                {
                    try
                    {
                        if (runner && plugin && runner.stop)
                            runner.stop(AvNs, avSessionInstance);
                    }
                    catch (e)
                    {
                        ns.SessionError(e, plugin);
                    }
                },
                function StopCallOnError() { OnStopError(param.injectorName); }
                );
        }
        function GetErrorMessage(error)
        {
            var msg = String(error);
            if (error instanceof Error)
            {
                msg = error.message;
                if (error.stack)
                    msg += "\r\n" + error.stack;
            }
            else if (error instanceof Object)
            {
                msg = ns.JSON.stringify(error);
            }
            return msg.length <= 2048 ? msg : (ns.StringSubstring.call(msg, 0, 2048) + "<...>");
        }
        function ExtractStackWithRegexp(stack, regexp)
        {
            var match = regexp.exec(stack);
            var result = new ns.Array();
            while (match !== null)
            {
                result.push(match[1]);
                match = regexp.exec(stack);
            }
            return result;
        }
        function ExtractChromeStack(stack)
        {
            var chromeStackRegexp = /at ([\w\s.]*) \([\w-]*:\/\/[\w.-]*((?:\/[\w.\-\d]*)*)/g; 
            return ExtractStackWithRegexp(stack, chromeStackRegexp);
        }
        function ExtractMozillaStack(stack)
        {
            var firefoxStackRegexp = /([\w.]*)@[\w-]*:\/\/[\w.-]*((?:\/[\w.-]*)*)/g; 
            return ExtractStackWithRegexp(stack, firefoxStackRegexp);
        }
        function ExtractStack(error)
        {
            if (!error.stack)
                return "";
            var extractedChromeStack = ExtractChromeStack(error.stack);
            if (extractedChromeStack)
                return extractedChromeStack.join("\n");
            var extractedFirefoxStack = ExtractMozillaStack(error.stack);
            if (extractedFirefoxStack)
                return extractedFirefoxStack.join("\n");
            return error.stack;
        }
        RegisterMethod("redirect", Redirect);
        RegisterMethod("reload", ReloadPage);
        RegisterMethod("start", StartInjector);
        RegisterMethod("stop", StopInjector);
        this.Reload = function Reload()
        {
            ReloadPage();
        };
        this.Log = function Log(error)
        {
            try
            {
                if (!(this.IsProductConnected() && enableTracing))
                    return;
                m_caller.SendLog(GetErrorMessage(error));
            }
            catch (e)
            {
                ns.Log(e.message || e);
            }
        };
        this.LogError = function LogError(error, injector)
        {
            try
            {
                if (!m_callReceiver.IsProductConnected())
                    return;
                var injectorName = injector ? injector : "common";
                var result = new ns.Object({ injector: injectorName });
                var details = new ns.Object({ topLevel: ns.IsTopLevel });
                if (typeof error === "object")
                {
                    result.error2 = error.message ? error.message : "unknown";
                    result.stack = ExtractStack(error);
                    details.errorDetails = error.details;
                    result.error = result.error2;
                    if (details.errorDetails)
                    {
                        result.error += "\n" + (typeof details.errorDetails === "object")
                            ? ns.JSON.stringify(details.errorDetails)
                            : details.errorDetails;
                    }
                    if (result.stack)
                        result.error += "\n" + result.stack;
                }
                else
                {
                    result.error  = error;
                    var m = ns.StringSplit.call(error, "\n");
                    result.error2 = m[0];
                    details.errorDetails = ns.StringSlice.call(m, 1).join("\n");
                }
                result.details = ns.JSON.stringify(details);
                m_caller.SessionErrorCall(ns.JSON.stringify(result));
            }
            catch (e)
            {
                ns.Log(e.message || e);
            }
        };
        function IsScriptletsException(message)
        {
            var match = ns.StringMatch.call(message, /^([\w]*\s)?ReferenceError:\s([a-z\d]{7,9})$/); 
            return match && match[2] && (match[2].length === 7 || match[2].length === 9);
        }
        function IsKnownError(message)
        {
            var knownErrors = new ns.Array(/^NetworkError[\s\W]/);
            return knownErrors.some(
                function MatchPattern(pattern)
                {
                    return ns.StringMatch.call(message, pattern);
                }
            );
        }
        function IsNeedSkipError(e)
        {
            if (!m_callReceiver.IsProductConnected())
                return true;
            if (!e.filename || !currentScriptPath)
                return true;
            if (ns.StringIndexOf.call(e.filename, currentScriptPath) === -1)
                return true;
            if (!e.message || typeof e.message !== "string")
                return false;
            return IsScriptletsException(e.message) || IsKnownError(e.message);
        }
        this.UnhandledException = function UnhandledException(e)
        {
            try
            {
                if (IsNeedSkipError(e))
                    return;
                var errInfo = new ns.Object({});
                errInfo.error = e.message && e.message.length > 1024 ? (ns.StringSubstring.call(e.message, 0, 1019) + "<...>") : e.message;
                errInfo.script = e.filename && e.filename.length > 1024 ? (ns.StringSubstring.call(e.filename, 0, 1019) + "<...>") : e.filename;
                errInfo.line = e.lineno;
                errInfo.column = e.colno;
                if (e.error)
                    errInfo.stack = e.error.stack && e.error.stack.length > 2048 ? (ns.StringSubstring.call(e.error.stack, 0, 2043) + "<...>") : e.error.stack;
                m_caller.UnhandledExceptionCall(ns.JSON.stringify(errInfo));
            }
            catch (ex)
            {
                ns.Log(ex.message || ex);
            }
        };
        this.ForceReceive = function ForceReceive()
        {
            m_callReceiver.ForceReceive();
        };
        this.IsProductConnected = function IsProductConnected()
        {
            return m_callReceiver.IsProductConnected();
        };
        this.InitializePlugin = function InitializePlugin(init)
        {
            init(
                function OnInitActivatePlugin()
                {
                    ActivatePlugin.apply(self, arguments);
                },
                function OnInitRegisterMethod()
                {
                    RegisterMethod.apply(self, arguments);
                },
                function OnInitCall()
                {
                    Call.apply(self, arguments);
                },
                function OnInitDeactivatePlugin()
                {
                    DeactivatePlugin.apply(self, arguments);
                },
                function OnInitOnUnloadCall()
                {
                    return OnUnloadCall.apply(self, arguments);
                }
            );
        };
        this.GetResource = function GetResource(resourcePostfix, callbackSuccess, callbackError)
        {
            if (!m_caller.ResourceCall)
                throw new Error("Not implemented on transport GetResource");
            m_caller.ResourceCall(resourcePostfix, callbackSuccess, callbackError);
        };
        this.Stop = function Stop(reason)
        {
            StopImpl(reason);
        };
    };
    ns.AddRunner = function AddRunner(pluginName, runnerFunc, initParameters, onConnectionError)
    {
        var options = {
            name: pluginName,
            runner: runnerFunc
        };
        if (initParameters)
            options.getParameters = function getParameters() { return initParameters; };
        if (onConnectionError)
            options.onConnectionError = onConnectionError;
        ns.AddRunner2(options);
    };
    ns.AddRunner2 = function AddRunner2(options)
    {
        var runnerItem = {
            runner: options.runner
        };
        if (options.stop)
            runnerItem.stop = options.stop;
        if (options.onConnectionError)
            runnerItem.onConnectionError = options.onConnectionError;
        if (options.getParameters)
            runnerItem.getParameters = options.getParameters;
        if (options.reject)
            runnerItem.reject = options.reject;
        runners.set(options.name, runnerItem);
    };
    ns.SessionLog = function SessionLog(e)
    {
        if (avSessionInstance)
        {
            avSessionInstance.Log(e);
            return;
        }
        ns.Log(e);
    };
    ns.SessionError = function SessionError(e, injector)
    {
        if (avSessionInstance && avSessionInstance.IsProductConnected())
            avSessionInstance.LogError(e, injector);
        else
            ns.Log(e);
    };
    ns.AddEventListener(window, "error", function onError(e)
    {
        if (avSessionInstance)
            avSessionInstance.UnhandledException(e);
        else
            ns.Log(e);
    });
    ns.ContentSecurityPolicyNonceAttribute = ns.CSP_NONCE;
    function IsInjectorInActiveList(plugins, injectorName)
    {
        return plugins.some(function ForEachPlugin(plugin)
        {
            return plugin.name === injectorName;
        });
    }
    function Init()
    {
        if (initPending || sessionMarkedForbidden)
            return;
        if (avSessionInstance && avSessionInstance.IsProductConnected())
            return;
        initPending = true;
        var caller = new ns.Caller();
        caller.Start(
            function StartCallback() 
            {
                var injectors = "";
                var pluginsInitData = new ns.Array();
                var injectorNames = new ns.Array();
                runners.forEach(function MapForEach(runner, runnerId)
                {
                    if (injectors)
                        injectors += "&";
                    injectors += runnerId;
                    injectorNames.push(runnerId);
                    if (runner.getParameters)
                        pluginsInitData.push(new ns.Object({ plugin: runnerId, parameters: ns.JSON.stringify(runner.getParameters()) }));
                });
                var initData = 
                    {
                        url: ns.StartLocationHref,
                        plugins: injectors,
                        data: new ns.Object({ data: pluginsInitData }),
                        isTopLevel: ns.IsTopLevel,
                        pageStartTime: ns.GetPageStartTime(),
                        navigationStartTime: ns.GetPageStartNavigationTime()
                    };
                caller.InitCall(
                    initData,
                    function InitCallCallback(initSettings)
                    {
                        ns.IsRtl = initSettings.rtl;
                        enableTracing = ns.IsDefined(initSettings.enableTracing) ? initSettings.enableTracing : true;
                        ajaxId = initSettings.ajaxId;
                        sessionId = initSettings.sessionId;
                        ns.GetCommandSrc = function GetCommandSrc()
                        {
                            return ns.GetBaseUrl() + initSettings.ajaxId + "/" + initSettings.sessionId;
                        };
                        avSessionInstance = new AvSessionClass(caller);
                        var plugins = initSettings.plugins ? ns.Array.from(initSettings.plugins) : ns.Array();
                        plugins.forEach(function ForEachPlugin(plugin)
                        {
                            try
                            {
                                var runnerItem = runners.get(plugin.name);
                                if (runnerItem)
                                {
                                    var settings = ns.IsDefined(plugin.settingsJson) ? SettingsObjectFromSettingsJson(plugin.settingsJson) : plugin.settings;
                                    var localization = ns.IsDefined(plugin.localizationDictionary) 
                                        ? LocalizationObjectFromDictionary(plugin.localizationDictionary) 
                                        : plugin.localization;
                                    runnerItem.runner(AvNs, avSessionInstance, settings, localization);
                                }
                            }
                            catch (e)
                            {
                                e.message = "Init error: " + e.message;
                                ns.SessionError(e, plugin.name);
                            }
                        });
                        injectorNames.forEach(function ForEachInjectorName(injectorName)
                        {
                            try
                            {
                                var runnerItemHolder = runners.get(injectorName);
                                if (!IsInjectorInActiveList(plugins, injectorName) && runnerItemHolder.reject)
                                    runnerItemHolder.reject();
                            }
                            catch (e)
                            {
                                ns.SessionError(e);
                            }
                        });
                        initPending = false;
                        ns.SessionLog("Session: " + initSettings.sessionId + " initialization complete time: " + ns.GetCurrentIsoDate() +
                            " document.readyState is " + document.readyState);
                    },
                    OnInitError
                    );
            },
            OnInitError
            );
    }
    function PostponeInit()
    {
        var nowPostponeTime = ns.GetCurrentTime();
        var postponeDelay = (nowPostponeTime - lastPostponedInitTime) > 5000 ? 200 : 60 * 1000;
        lastPostponedInitTime = nowPostponeTime;
        ns.ClearTimeout(postponedInitTimeout);
        postponedInitTimeout = ns.SetTimeout(Init, postponeDelay);
    }
    function OnInitError(message, details)
    {
        if (details && details.forbidden)
        {
            ns.ClearInterval(restartInterval);
            restartInterval = 0;
            sessionMarkedForbidden = true;
        }
        else
        {
            PostponeInit();
        }
        runners.forEach(function MapForEach(runner)
        {
            try
            {
                var connectionErrorCallback = runner.onConnectionError;
                if (connectionErrorCallback)
                    connectionErrorCallback();
            }
            catch (e)
            {
                AvNs.SessionLog(e);
            }
        });
        initPending = false;
    }
    ns.StartSession = function StartSession()
    {
        ns.ClearInterval(restartInterval);
        restartInterval = ns.SetInterval(PostponeInit, 30000);        
        ns.AddEventListener(document, "DOMContentLoaded", PostponeInit);
        ns.AddEventListener(window, "load", PostponeInit);
        Init();
    };
    ns.StopSession = function StopSession(reason)
    {
        if (avSessionInstance)
            avSessionInstance.Stop(reason);
    };
    if ("onpageshow" in window)
    {
        ns.AddEventListener(
            window,
            "pageshow",
            function onPageShow(event)
            {
                try
                {
                    if (event.persisted)
                        ns.StartSession();
                }
                catch (e)
                {
                    AvNs.SessionLog(e);
                }
            }
        );
    }
    ns.AddEventListener(
        window,
        ("onpagehide" in window) ? "pagehide" : "unload",
        function onShutdownEvent(evt)
        {
            ns.StopSession(evt.type);
        }
    );
})(AvNs);
AvNs.AddRunner("wsm", function AddRunnerWsm(ns, session)
{
    if (!ns.IsTopLevel)
        return;
    var m_callFunction = null;
    var m_activatedState = 0;
    var m_activatedStateChangeTimeout = null;
    var m_documentTitleIsAvailable = false;
    var m_stateChangeDelayTimeout = null;
    var m_processActivate = null;
    var m_pluginId = "wsm";
    function OnPing()
    {
        return ns.MaxRequestDelay;
    }
    function GetTitle()
    {
        if (typeof document.title !== "string")
            return "";
        return document.title;
    }
    function FireDeactivateEventImpl()
    {
        if (m_callFunction)
        {
            m_callFunction("wsm.sessionDeactivated", new ns.Object({ title: GetTitle() }), function SessionDeactivatedCallback()
            {
                if (m_activatedState === 1)
                    m_processActivate();
                m_activatedState = 0;
            });
        }
        m_activatedState = 3;
    }
    function FireDeactivateEvent()
    {
        if (m_documentTitleIsAvailable)
            FireDeactivateEventImpl();
        else
            ns.ClearTimeout(m_stateChangeDelayTimeout);
    }
    function ProcessDeactivate()
    {
        ns.ClearTimeout(m_activatedStateChangeTimeout);
        m_activatedStateChangeTimeout = ns.SetTimeout(function TimerCallback()
            {
                if (m_activatedState === 2)
                    FireDeactivateEvent();
                else if (m_activatedState === 1)
                    m_activatedState = 3;
            }, 0, m_pluginId);
    }
    function FireActivateEventImpl()
    {
        if (m_callFunction)
        {
            m_callFunction("wsm.sessionActivated", new ns.Object({ title: GetTitle() }), function SessionActivatedCallback()
            {
                if (m_activatedState === 3)
                    ProcessDeactivate();
                m_activatedState = 2;
            });
        }
        m_activatedState = 1;
    }
    function FireActivateEvent()
    {
        ns.ClearTimeout(m_stateChangeDelayTimeout);
        if (m_documentTitleIsAvailable || GetTitle())
        {
            m_documentTitleIsAvailable = true;
            FireActivateEventImpl();
        }
        else
        {
            m_stateChangeDelayTimeout = ns.SetTimeout(function TimerCallback()
                {
                    m_documentTitleIsAvailable = true;
                    m_processActivate();
                }, 500, m_pluginId);
        }
    }
    function ProcessActivate()
    {
        ns.ClearTimeout(m_activatedStateChangeTimeout);
        m_activatedStateChangeTimeout = ns.SetTimeout(function TimerCallback()
            {
                if (m_activatedState === 0)
                    FireActivateEvent();
                else if (m_activatedState === 3)
                    m_activatedState = 1;
            }, 0, m_pluginId);
    }
    function IsFocusedDocument()
    {
        return document.hasFocus && document.hasFocus();
    }
    function OnFocus()
    {
        if (m_callFunction)
            ProcessActivate();
    }
    function OnBlur()
    {
        if (m_callFunction && !IsFocusedDocument())
            ProcessDeactivate();
    }
    function OnVisibilityChange()
    {
        if (!m_callFunction)
            return;
        ns.SessionLog("Visibility changed. Hidden: " + document.hidden);
        if (document.hidden)
            ProcessDeactivate();
        else if (IsFocusedDocument())
            ProcessActivate();
    }
    function OnHashChange()
    {
        var args = new ns.Object({ newLocationUrl: ns.ToBase64(document.location.href), urlEncrypted: true });
        if (m_callFunction)
            m_callFunction("wsm.onHashChange", args);
    }
    function OnSessionShutdown()
    {
        ns.ClearTimeout(m_activatedStateChangeTimeout);
        m_activatedStateChangeTimeout = null;
        m_callFunction = null;
        ns.UnsubscribeHistoryChanged(m_pluginId);
    }
    function Initialize()
    {
        m_processActivate = ProcessActivate;
        session.InitializePlugin(function InitializePluginWsm(activatePlugin, registerMethod, callFunction)
        {
            m_callFunction = callFunction;
            activatePlugin(m_pluginId, OnPing, null, OnSessionShutdown);
        });
        if (IsFocusedDocument())
        {
            FireActivateEvent();
            ns.AddEventListener(window, "load", function OnLoad()
                {
                    if (!IsFocusedDocument())
                        ProcessDeactivate();
                }, m_pluginId);
        }
        if (window.addEventListener)
        {
            ns.AddEventListener(window, "focus", OnFocus, m_pluginId);
            ns.AddEventListener(window, "blur", OnBlur, m_pluginId);
            ns.AddEventListener(document, "visibilitychange", OnVisibilityChange, m_pluginId);
        }
        else
        {
            ns.AddEventListener(document, "focusin", OnFocus, m_pluginId);
            ns.AddEventListener(document, "focusout", OnBlur, m_pluginId);
        }
        if ("onhashchange" in window)
            ns.AddEventListener(window, "hashchange", OnHashChange, m_pluginId);
        ns.SubscribeHistoryChanged(m_pluginId, OnHashChange);
    }
    Initialize();
}, {
    referrer: document.referrer,
    stubId: (function stubId()
    {
        var scripts = new AvNs.Array();
        if (AvNs.HasDocumentQuerySelectorAll())
        {
            scripts = AvNs.Array.from(AvNs.DocumentQuerySelectorAll("[stubid]"));
        }
        else
        {
            var allElements = AvNs.Array.from(document.getElementsByTagName("*"));
            allElements.forEach(function ForEachElement(element)
            {
                if (element.getAttribute("stubid") !== null)
                    scripts.push(element);
            });
        }
        if (scripts && scripts.length > 0)
            return scripts[0].getAttribute("stubid");
        return "";
    })()
});
AvNs.AddRunner("wnt", function AddRunnerWnt(ns, session)
{
    function OnPing()
    {
        return ns.MaxRequestDelay;
    }
    function Initialize()
    {
        session.InitializePlugin(function InitializePluginWnt(activatePlugin)
            {
                activatePlugin("wnt", OnPing);
            });
    }
    Initialize();
}, new AvNs.Object({ referrer: document.referrer }));
var compromisedAccountHandler = AvNs.EmptyFunc;
var eventHandler = function eventHandler(arg) { compromisedAccountHandler(arg); };
AvNs.AddEventListener(document, "click", eventHandler, "ca");
AvNs.AddEventListener(document, "keydown", eventHandler, "ca");
AvNs.AddEventListener(document, "submit", eventHandler, "ca");
AvNs.AddRunner("ca", function AddRunnerCA(ns, session, settings)
{
    var m_callFunction = ns.EmptyFunc;
    var m_onUnloadCallFunction = ns.EmptyFunc;
    var m_bodySended = false;
    var m_lastSendedTime = 0;
    var m_domParser = ns.GetDomParser(session);
    var m_logins = new ns.Array();
    var m_passwords = new ns.Array();
    var m_forms = new ns.Array();
    var m_buttons = new ns.Array();
    var m_settings = settings;
    var m_submitCall = false;
    var m_pluginId = "ca";
    function CallService(commandName, argObject)
    {
        m_callFunction("ca." + commandName, argObject, null, null);
    }
    function TryOnUnloadCallService(commandName, argObject, resultCallback)
    {
        return m_onUnloadCallFunction("ca." + commandName, argObject, resultCallback);
    }
    function ProcessBeforeUnload()
    {
        try
        {
            if (!m_submitCall)
                return;
            var domWithWfd = m_domParser.SetWfdIds();
            if (!TryOnUnloadCallService("onHtml", new ns.Object({ dom: domWithWfd })))
                CallService("onHtml", new ns.Object({ dom: domWithWfd }));
        }
        catch (e)
        {
            if (e.message === "out of memory")
            {
                ns.SessionLog("CA: Out of memory occured. Failed send dom before unload");
                return;
            }
            throw e;
        }
    }
    function OnSubmitWithAutofill(arg)
    {
        ns.SessionLog("=> OnSubmit with autofill eventType: " + arg.type);
        if (m_submitCall)
            return;
        m_submitCall = true;
        ns.AddEventListener(window, "beforeunload", ProcessBeforeUnload, m_pluginId);
    }
    function IsInList(element, elementList)
    {
        var result = false;
        elementList.forEach(function ForEachElement(el)
        {
            if (element === el)
                result = true;
        });
        return result;
    }
    function AddButtonsToList(submitButtons)
    {
        submitButtons.forEach(function ForEachSubmitButton(button)
        {
            if (!IsInList(button, m_buttons))
                m_buttons.push(button);
        });
    }
    function GetElements(root, tag, type)
    {
        var selector = tag + "[type='" + type + "']";
        if (root === document)
        {
            if (ns.HasDocumentQuerySelectorAll())
                return ns.Array.from(ns.DocumentQuerySelectorAll(selector));
        }
        else if (ns.HasElementQuerySelectorAll())
        {
            return ns.Array.from(ns.ElementQuerySelectorAll(root, selector));
        }
        var result = new ns.Array();
        var childrens = ns.Array.from(root.getElementsByTagName(tag));
        childrens.forEach(function ForEachChild(child)
        {
            if (ns.IsStringEqualIgnoreCase(child.type, type))
                result.push(child);
        });
        return result;
    }
    function GetSingleButton()
    {
        var buttons = GetElements(document, "button", "submit"); 
        if (buttons && buttons.length > 0) 
            return buttons;
        buttons = ns.Array.from(document.getElementsByTagName("button"));
        if (buttons && buttons.length === 1) 
            return buttons;
        var result = new ns.Array();
        buttons.forEach(function ForEachButton(button)
        {
            if (ns.IsElementDisplayed(button))
                result.push(button);
        });
        return result.length === 1 ? result : ns.Array();
    }
    function OnGetPasswordSelectors(form)
    {
        return function Callback(result, selectors)
        {
            if (result !== 0 || selectors.length === 0)
            {
                ns.SessionLog("Couldn't get password selectors. Result: " + result + " selectors size: " + selectors.length);
                return;
            }
            selectors.forEach(function ForEachSelector(selector)
            {
                var passwordElement = ns.DocumentQuerySelector(selector); 
                if (!passwordElement)
                {
                    ns.SessionLog("Couldn't find element for password selector " + selector); 
                    return;
                }
                if (form.contains(passwordElement))
                {
                    ns.SessionLog("Form contains element for password selector " + selector); 
                    m_passwords.push(passwordElement);
                }
            });
        };
    }
    function AddLoginInputToList(accountElement)
    {
        if (IsInList(accountElement, m_logins))
            return;
        ns.SessionLog("setting Enter Key event handlers for " + accountElement.id);
        m_logins.push(accountElement);
        if (accountElement.form)
        {
            var parentForm = accountElement.form;
            if (!IsInList(parentForm, m_forms))
            {
                ns.SessionLog("setting form submit event handlers for " + accountElement.id);
                m_forms.push(parentForm);
                m_domParser.GetPasswordSelectors(OnGetPasswordSelectors(parentForm));
            }
            ns.SessionLog("setting button click event handlers for " + accountElement.id);
            AddButtonsToList(GetElements(parentForm, "input", "submit"));
            AddButtonsToList(GetElements(parentForm, "button", "submit"));
            AddButtonsToList(GetElements(parentForm, "button", "button"));
        }
        else
        {
            ns.SessionLog("setting button click event handlers for " + accountElement.id);
            AddButtonsToList(GetSingleButton());
        }
    }
    function OnSubmit(arg)
    {
        var target = arg.target || arg.srcElement;
        if (!target)
        {
            ns.SessionLog("OnSubmit ignored cause empty target. eventType is " + arg.type);
            return;
        }
        ns.SessionLog("=> OnSubmit eventType: " + arg.type + " , target: " + target.id);
        if (arg.type === "keydown")
        {
            if (arg.keyCode !== 13)
                return;
            if (!IsInList(target, m_buttons) && !IsInList(target, m_logins) && !IsInList(target, m_passwords) && !IsInList(target, m_forms))
                return;
        }
        else if (arg.type === "click")
        {
            if (!IsInList(target, m_buttons) && !(target.parentElement && IsInList(target.parentElement, m_buttons)))
                return;
        }
        else if (arg.type === "submit")
        {
            if (!IsInList(target, m_forms))
                return;
        }
        var currentTime = ns.GetCurrentTime();
        if (currentTime - 500 < m_lastSendedTime)
        {
            ns.SessionLog("skipping OnSubmit due to timing");
            return; 
        }
        var accounts = new ns.Array();
        m_logins.forEach(function ForEachLogin(accountElement)
        {
            if (accountElement.value)
                accounts.push(ns.ToBase64(accountElement.value));
        });
        if (accounts.length > 0)
        {
            if (!TryOnUnloadCallService("onAccount", new ns.Object({ accounts: accounts })))
                CallService("onAccount", new ns.Object({ accounts: accounts }));
            m_lastSendedTime = currentTime;
        }
        else
        {
            ns.SessionLog("CA: OnSubmit with no data occure");
        }
        ns.SessionLog("<= OnSubmit eventType: " + arg.type + " , target: " + target.id);
    }
    function OnGetLoginSelectors(result, onInputData)
    {
        m_submitCall = false;
        if (result !== 0 || onInputData.length === 0)
        {
            ns.SessionLog("Couldn't get login selectors. Result: " + result + " selectors size: " + onInputData.length);
            m_bodySended = false;
            return;
        }
        compromisedAccountHandler = OnSubmit;
        onInputData.forEach(function ForEachLoginSelector(data)
        {
            var accountElement = ns.DocumentQuerySelector(data);
            if (!accountElement)
            {
                ns.SessionLog("Couldn't find element for login selector " + data);
                return;
            }
            AddLoginInputToList(accountElement);
        });
    }
    function OnKeyDown(arg)
    {
        if (m_bodySended || arg.key === "F5")
            return;
        ns.SessionLog("Find login selectors.");
        m_bodySended = true;
        if (m_settings.submitHandlerEnabled)
            compromisedAccountHandler = OnSubmitWithAutofill;
        m_domParser.GetLoginSelectors(OnGetLoginSelectors);
    }
    function OnPing()
    {
        return ns.MaxRequestDelay;
    }
    function OnInitializeCallback(activatePlugin, registerMethod, callFunction, deactivate, onUnloadCall)
    {
        m_callFunction = callFunction;
        m_onUnloadCallFunction = onUnloadCall;
        activatePlugin(m_pluginId, OnPing);
        ns.AddEventListener(document, "keydown", OnKeyDown, m_pluginId);
    }
    function InitializePlugin()
    {
        session.InitializePlugin(OnInitializeCallback);
        ns.SessionLog("Compromised account ready.");
    }
    InitializePlugin();
});
AvNs.AddRunner("vs", function AddRunnerVs(ns, session)
{
    var VisitedSites = function VisitedSites()
    {
        var m_callFunction = ns.EmptyFunc;
        var m_domParser = ns.GetDomParser(session);
        var m_subscribedElements = new ns.Array();
        var m_flags = new ns.Map(new ns.Array(["onPasswordEntered", false], ["onAddressEntered", false], ["onCardEntered", false]));
        function OnPing()
        {
            return ns.MaxRequestDelay;
        }
        function IsElementSubscribed(element)
        {
            var res = false;
            m_subscribedElements.forEach(function ForEachSubscribedElement(subscribedElement)
            {
                if (subscribedElement === element)
                    res = true;
            });
            return res;
        }
        function MakeCallFunctionCallback(flag, onKeyDown)
        {
            return function callback()
            {
                m_flags.set(flag, true);
                if (m_flags.get("onPasswordEntered") && m_flags.get("onAddressEntered") && m_flags.get("onCardEntered"))
                {
                    ns.RemoveEventListener(document, "keydown", onKeyDown);
                    ns.RemoveEventListener(document, "change", onKeyDown);
                }
                m_callFunction("vs." + flag);
            };
        }
        function MakeCallback(flag, target, onKeyDown)
        {
            if (m_flags.get(flag) || !target)
                return ns.EmptyFunc;
            var flagCallFunction = MakeCallFunctionCallback(flag, onKeyDown);
            return function Callback(result, selectors)
            {
                if (result || m_flags.get(flag))
                    return;
                ns.Array.from(selectors).forEach(function ForEachSelector(selector)
                {
                    if (m_flags.get(flag))
                        return;
                    var element = ns.DocumentQuerySelector(selector);
                    if (window.MutationObserver && element && !ns.IsStringEqualIgnoreCase(ns.TryGetTagName(element), "input") && !IsElementSubscribed(element))
                    {
                        var mutationObserver = new MutationObserver(flagCallFunction);
                        mutationObserver.observe(element, new ns.Object({ childList: true, characterData: true, subtree: true }));
                        m_subscribedElements.push(element);
                    }
                    if (element && element === target)
                        flagCallFunction();
                });
            };
        }
        function OnKeyDown(evt)
        {
            try 
            {
                if (!AvNs.IsValidTargetProperty(evt) || !ns.IsStringEqualIgnoreCase(ns.TryGetTagName(evt.target), "input"))
                    return;
                m_domParser.GetPasswordSelectors(MakeCallback("onPasswordEntered", evt.target, OnKeyDown));
                m_domParser.GetNewPasswordSelectors(MakeCallback("onPasswordEntered", evt.target, OnKeyDown));
                m_domParser.GetAddressSelectors(MakeCallback("onAddressEntered", evt.target, OnKeyDown));
                m_domParser.GetCardSelectors(MakeCallback("onCardEntered", evt.target, OnKeyDown));
            }
            catch (e)
            {
                ns.SessionError(e, "vs");
            }
        }
        function Initialize()
        {
            session.InitializePlugin(function InitializePluginVs(activatePlugin, registerMethod, callFunction)
                {
                    m_callFunction = callFunction;
                    activatePlugin("vs", OnPing);
                    ns.AddRemovableEventListener(document, "keydown", OnKeyDown);
                    ns.AddRemovableEventListener(document, "change", OnKeyDown);
                });
        }
        Initialize();
    };
    var instance = null;
    ns.RunModule(function RunModuleVisitedSites()
    {
        if (!instance)
            instance = new VisitedSites();
    });
});
(function UrlAdvisorBalloonMain(ns)
{
ns.UrlAdvisorBalloon = function UrlAdvisorBalloon(session, locales)
{
    var m_balloon = null;
    var m_currentVerdict = null;
    var m_mouseX = 0;
    var m_mouseY = 0;
    var ratingIds = new ns.Array(
        new ns.Object({ className: "green", headerNode: locales["UrlAdvisorBalloonHeaderGood"], textNode: locales["UrlAdvisorSetLocalContentOnlineGood"] }),
        new ns.Object({ className: "grey", headerNode: locales["UrlAdvisorBalloonHeaderSuspicious"], textNode: locales["UrlAdvisorSetLocalContentOnlineSuspicious"] }),
        new ns.Object({ className: "red", headerNode: locales["UrlAdvisorBalloonHeaderDanger"], textNode: locales["UrlAdvisorSetLocalContentOnlineDanger"] }),
        new ns.Object({ className: "yellow", headerNode: locales["UrlAdvisorBalloonHeaderWmuf"], textNode: locales["UrlAdvisorSetLocalContentOnlineWmuf"] }),
        new ns.Object({ className: "orange", headerNode: locales["UrlAdvisorBalloonHeaderCompromised"], textNode: locales["UrlAdvisorSetLocalContentOnlineCompromised"] }),
        new ns.Object({ className: "yellow_shops", headerNode: locales["UrlAdvisorBalloonHeaderShop"], textNode: locales["UrlAdvisorSetLocalContentOnlineShop"] })
    );
    function OnCloseHandler(arg)
    {
        if (arg === 0)
            m_balloon.Hide();
    }
    function OnDataReceiveHandler()
    {
    }
    function GetCoord(balloonSize, clientX, clientY)
    {
        var coord = new ns.Object({ x: 0, y: 0 });
        var clientWidth = ns.GetPageWidth();
        var halfWidth = balloonSize.width / 2;
        if (halfWidth > clientX)
            coord.x = 0;
        else if (halfWidth + clientX > clientWidth)
            coord.x = clientWidth - balloonSize.width;
        else
            coord.x = clientX - halfWidth;
        var clientHeight = ns.GetPageHeight();
        coord.y = (clientY + balloonSize.height > clientHeight) ? clientY - balloonSize.height : clientY;
        if (coord.y < 0)
            coord.y = 0;
        var scroll = ns.GetPageScroll();
        coord.y += scroll.top;
        coord.x += scroll.left;
        return coord;
    }
    function GetCoordsCallback(balloonSize)
    {
        return GetCoord(balloonSize, m_mouseX, m_mouseY);
    }
    this.HideBalloon = function HideBalloon()
    {
        m_balloon.Hide();
    };
    this.ShowBalloon = function ShowBalloon(clientX, clientY, verdict)
    {
        m_mouseX = clientX;
        m_mouseY = clientY;
        m_currentVerdict = verdict;
        m_balloon.Show(ratingIds[m_currentVerdict.rating - 1].className + " " + ns.md5(verdict.url), { verdict: m_currentVerdict, locales: locales });
    };
    m_balloon = new ns.Balloon2("ua", "/ua/url_advisor_balloon.html", "/ua/balloon.css", session, GetCoordsCallback, OnCloseHandler, locales, OnDataReceiveHandler);
};
})(AvNs || {});
var PostponeCheckAtributeName = "kl_" + AvNs.GetCurrentTime();
var IconName = "kl_" + AvNs.GetCurrentTime();
var InsertType = new AvNs.Object({ INSERT_AFTER: 0, INSERT_BEFORE: 1, INSERT_INTO: 2 });
function ClearImages()
{
    var images = document.getElementsByName(IconName);
    while (images.length > 0)
        images[0].parentNode.removeChild(images[0]);
}
AvNs.AddRunner("ua", function AddRunnerUa(ns, session, settings, locales)
{
var UrlAdvisor = function UrlAdvisor()
{
    var m_urlAdvisorBalloon = new ns.UrlAdvisorBalloon(session, locales);
    var m_enabled = settings.enable;
    var m_checkOnlySearchResults = settings.mode;
    var m_linkSelector = settings.linkSelector;
    var m_elementAfterSelector = settings.elementAfterSelector;
    var m_emptySearchResultSent = false;
    var m_insertType = settings.insertType || InsertType.INSERT_AFTER;
    var m_isVerdictSuitableForContinueFunc = function AlwaysSuitable() { return true; };
    var m_linkStyle = settings.linkStyle;
    var m_postponeCategorizeStarted = false;
    var m_urlCategorizeRequestTime = 0;
    var m_observer = null;
    var m_callFunction = ns.EmptyFunc;
    var m_categorizingObjects = new ns.Map();
    var m_clearCategorizingObjectsTimerId = null;
    var m_pluginId = "ua";
    function AddToCategorizeList(url, linkElement)
    {
        if (!m_categorizingObjects.has(url))
            m_categorizingObjects.set(url, new ns.Array());
        m_categorizingObjects.get(url).push(linkElement);
    }
    function OnPing(currentTime)
    {
        var timeFormRequest = (currentTime >= m_urlCategorizeRequestTime) ? currentTime - m_urlCategorizeRequestTime : 0;
        return timeFormRequest <= 10000 ? 500 : ns.MaxRequestDelay;
    }
    function GetHref(link)
    {
        try { return link.href; } 
        catch (e) {}
        try { return link.getAttribute("href"); } 
        catch (e) {}
        return "";
    }
    function CreateIcon()
    {
        var icon = ns.DocumentCreateElement("img");
        icon.name = IconName;
        icon.width = 16;
        icon.height = 16;
        icon.style.cssText = "width: 16px!important; height: 16px!important;display: inline !important;";
        if (settings.iconStyle)
            icon.style.cssText += settings.iconStyle;
        icon.onclick = function onclick(evt) { ns.StopProcessingEvent(evt); };
        return icon;
    }
    function GetLinkIcon(linkElement)
    {
        var iconElement = linkElement.nextSibling;
        if (m_elementAfterSelector)
        {
            var insertElement = ns.ElementQuerySelector(linkElement, m_elementAfterSelector);
            if (insertElement)
            {
                if (m_insertType === InsertType.INSERT_BEFORE)
                    iconElement = insertElement.previousSibling;
                else if (m_insertType === InsertType.INSERT_INTO)
                    iconElement = insertElement.lastChild;
                else
                    iconElement = insertElement.nextSibling;
            }
        }
        return (iconElement !== null && iconElement.name === IconName) ? iconElement : null;
    }
    function CreateIconBeforeElement(targetElement)
    {
        if (targetElement.parentNode)
        {
            targetElement.parentNode.insertBefore(CreateIcon(), targetElement);
        }
        else
        {
            ns.SessionLog("Can not find parent node for: " + targetElement.nodeType);
            return null;
        }
        return targetElement.previousSibling;
    }
    function CreateIconInElement(targetElement)
    {
        ns.AppendChild(targetElement, CreateIcon());
        return targetElement.lastChild;
    }
    function CreateIconAfterElement(targetElement)
    {
        if (targetElement.parentNode)
        {
            targetElement.parentNode.insertBefore(CreateIcon(), targetElement.nextSibling);
        }
        else
        {
            ns.SessionLog("Can not find parent node for: " + targetElement.nodeType);
            return null;
        }
        return targetElement.nextSibling;
    }
    function GetOrCreateLinkIcon(linkElement)
    {
        var icon = GetLinkIcon(linkElement);
        if (icon)
            return icon;
        var targetElement = linkElement;
        if (m_elementAfterSelector)
        {
            targetElement = ns.ElementQuerySelector(linkElement, m_elementAfterSelector);
            if (!targetElement)
                targetElement = linkElement;
        }
        if (!AvNs.Object.prototype.hasOwnProperty.call(settings, "linkStyle")) 
            targetElement.style.display = "inline-block";
        else if (m_linkStyle)
            targetElement.style.display = m_linkStyle;
        if (m_insertType === InsertType.INSERT_INTO)
            return CreateIconInElement(targetElement);
        else if (m_insertType === InsertType.INSERT_BEFORE)
            return CreateIconBeforeElement(targetElement);
        return CreateIconAfterElement(targetElement);
    }
    function CheckIconInElement(elem, icon)
    {
        return (m_insertType === InsertType.INSERT_AFTER && elem.nextSibling === icon)
            || (m_insertType === InsertType.INSERT_BEFORE && elem.previousSibling === icon)
            || (m_insertType === InsertType.INSERT_INTO && elem.firstChild === icon);
    }
    function GetLinkElementByIcon(icon)
    {
        if (!m_elementAfterSelector)
        {
            if (m_insertType === InsertType.INSERT_BEFORE)
                return icon.nextSibling;
            else if (m_insertType === InsertType.INSERT_INTO)
                return icon.parentNode;
            return icon.previousSibling;
        }
        var searchLinks = ns.Array.from(ns.GetSearchLinks ? ns.GetSearchLinks() : ns.DocumentQuerySelectorAll(m_linkSelector));
        var linkElement = icon.previousSibling;
        searchLinks.forEach(function ForEachSearchLink(searchLink)
        {
            var link = searchLink.element || searchLink;
            var elem = ns.ElementQuerySelector(link, m_elementAfterSelector);
            if (link.nextSibling === icon || (elem && CheckIconInElement(elem, icon)))
                linkElement = link;
        });
        return linkElement;
    }
    function UpdateIconImage(icon, verdict)
    {
        if (verdict.rating === 1)
        {
            icon.src = locales["UrlAdvisorGoodImage.png"];
            icon["kis_status"] = 16;
        }
        else if (verdict.rating === 2)
        {
            icon.src = locales["UrlAdvisorSuspiciousImage.png"];
            icon["kis_status"] = 8;
        } 
        else if (verdict.rating === 3)
        {
            icon.src = locales["UrlAdvisorDangerImage.png"];
            icon["kis_status"] = 4;
        }
        else if (verdict.rating === 4)
        {
            icon.src = locales["UrlAdvisorwmufImage.png"];
        }
        else if (verdict.rating === 5)
        {
            icon.src = locales["UrlAdvisorCompromisedImage.png"];
        }
        else if (verdict.rating === 6)
        {
            icon.src = locales["UrlAdvisorwmufImage.png"]; 
        }
    }
    function SubscribeIconOnMouseEvents(icon, verdict)
    {
        var balloonTimerId = 0;
        ns.AddEventListener(icon, "mouseout", function OnMouseout()
            {
                if (balloonTimerId)
                {
                    ns.ClearTimeout(balloonTimerId);
                    balloonTimerId = 0;
                }
            }, m_pluginId);
        ns.AddEventListener(icon, "mouseover", function OnMouseover(args)
            {
                if (!balloonTimerId)
                {
                    var clientX = args.clientX;
                    var clientY = args.clientY;
                    balloonTimerId = ns.SetTimeout(function TimerCallback()
                        {
                            m_urlAdvisorBalloon.ShowBalloon(clientX, clientY, verdict);
                            balloonTimerId = 0;
                        }, 300, m_pluginId);
                }
            }, m_pluginId);
    }
    function IsElementEmpty(linkElement)
    {
        return !linkElement.offsetHeight && !linkElement.offsetWidth
            && !linkElement.outerText && !linkElement.text;
    }
    function SetVerdictForUrl(verdict)
    {
        try
        {
            if (!m_categorizingObjects.has(verdict.url))
                return;
            var linkElements = m_categorizingObjects.get(verdict.url);
            linkElements.forEach(function ForEachLinkElement(linkElement)
            {
                if (IsElementEmpty(linkElement))
                    return;
                linkElement[PostponeCheckAtributeName] = false; 
                if (!m_isVerdictSuitableForContinueFunc(verdict))
                    return;
                var icon = GetOrCreateLinkIcon(linkElement);
                if (!icon)
                    return;
                UpdateIconImage(icon, verdict);
                SubscribeIconOnMouseEvents(icon, verdict);
            });
        }
        catch (e)
        {
            ns.SessionError(e, m_pluginId);
        }
        m_categorizingObjects.delete(verdict.url);
    }
    function SetVerdict(argument)
    {
        ns.Array.from(argument.verdicts).forEach(SetVerdictForUrl);
    }
    function SetVerdictDelayed(argument)
    {
        ns.SetTimeout(function TimerCallback() { SetVerdict(argument); }, 1000, m_pluginId);
    }
    function SetSettingsImpl(argument)
    {
        m_enabled = argument.enable;
        if (!m_enabled)
            return;
        m_checkOnlySearchResults = argument.mode;
    }
    function ClearAttributes()
    {
        ns.Array.from(document.links).forEach(function ForEachLink(link)
        {
            if (link[PostponeCheckAtributeName]) 
                link[PostponeCheckAtributeName] = false; 
        });
    }
    function IsNeedCategorizeLink(linkElement)
    {
        try
        {
            return !linkElement.isContentEditable && Boolean(linkElement.parentNode)
                && !GetLinkIcon(linkElement) && !linkElement[PostponeCheckAtributeName] 
                && !IsElementEmpty(linkElement);
        }
        catch (e)
        {
            ns.SessionLog("check link exception: " + (e.message || e));
            return false;
        }
    }
    function UrlToBase64(url)
    {
        try
        {
            return ns.ToBase64(url);
        }
        catch (e)
        {
            return "";
        }
    }
    function CategorizeUrl()
    {
        try
        {
            if (!m_enabled)
            {
                ns.SessionLog("skip categorize links because UA disabled");
                return;
            }
            ns.SessionLog("UA: collect links for categorize");
            m_postponeCategorizeStarted = false;
            var linksForCategorize = new ns.Array();
            var linksForCheck = new ns.Array();
            if (!m_checkOnlySearchResults)
                linksForCheck = ns.Array.from(document.links);
            else if (ns.GetSearchLinks)
                linksForCheck = ns.Array.from(ns.GetSearchLinks());
            else if (m_linkSelector && m_checkOnlySearchResults)
                linksForCheck = ns.Array.from(ns.DocumentQuerySelectorAll(m_linkSelector));
            ns.SessionLog("UA: links for categorize size: " + linksForCheck.length);
            linksForCheck.forEach(function ForEachLinkForCheck(linkForCheck)
            {
                var link = linkForCheck.element || linkForCheck;
                if (IsNeedCategorizeLink(link))
                {
                    link[PostponeCheckAtributeName] = true;  
                    var href = GetHref(linkForCheck) || GetHref(link);
                    if (href)
                    {
                        if (typeof window.URL === "function" && ns.TryCreateUrl(href) === null)
                        {
                            if (m_checkOnlySearchResults)
                            {
                                var details = new ns.Object({ link: href });
                                ns.SessionError(new ns.Object({ message: "UA: unsupported link url format", details: details }), m_pluginId);
                            }
                            else
                            {
                                ns.SessionLog("UA: unsupported link url format '" + href + "' skip link");
                            }
                            return;
                        }
                        var base64Url = UrlToBase64(href);
                        if (!base64Url)
                        {
                            href = encodeURI(href);
                            base64Url = UrlToBase64(href);
                            if (!base64Url)
                                return;
                        }
                        linksForCategorize.push(base64Url);
                        AddToCategorizeList(href, link);
                    } 
                    else 
                    {
                        ns.Log("access to href blocked by browser"); 
                    }
                }
            });
            var isEmptySearchResult = m_linkSelector && m_checkOnlySearchResults && linksForCheck.length === 0;
            if (isEmptySearchResult || linksForCategorize.length)
            {
                if (isEmptySearchResult)
                {
                    if (document.readyState !== "complete" || m_emptySearchResultSent)
                        return;
                    m_emptySearchResultSent = true;
                }
                ns.SessionLog("UA send links for categorization");
                var args = new ns.Object({ links: linksForCategorize });
                args.urlEncrypted = true;
                m_callFunction("ua.categorize", args);
                m_urlCategorizeRequestTime = ns.GetCurrentTime();
                ns.ClearTimeout(m_clearCategorizingObjectsTimerId);
                m_clearCategorizingObjectsTimerId = ns.SetTimeout(function TimerCallback()
                {
                    m_categorizingObjects = new ns.Map();
                }, 1000 * 60 * 5, m_pluginId);
            }
            else
            {
                ns.SessionLog("UA not found links for categorization");
            }
        }
        catch (e)
        {
            ns.SessionError(e, m_pluginId);
        }
    }
    function ProcessDomChange()
    {
        try
        {
            ns.SessionLog("UA: Process dom change");
            if (!m_postponeCategorizeStarted)
            {
                ns.SetTimeout(CategorizeUrl, 500, m_pluginId);
                m_postponeCategorizeStarted = true;
            }
            var images = ns.Array.from(document.getElementsByName(IconName));
            images.forEach(function ForEachImage(image)
            {
                var linkNode = GetLinkElementByIcon(image);
                if (!linkNode || !linkNode.nodeName || !ns.IsStringEqualIgnoreCase(linkNode.nodeName, "a"))
                    image.parentNode.removeChild(image);
            });
        }
        catch (e)
        {
            ns.SessionError(e, m_pluginId);
        }
    }
    function SetSettings(argument)
    {
        ClearImages();
        ClearAttributes();
        SetSettingsImpl(argument);
        CategorizeUrl();
    }
    function Run()
    {
        CategorizeUrl();
        m_observer = ns.GetDomChangeObserver("a", m_pluginId);
        m_observer.Start(ProcessDomChange);
        ns.AddEventListener(window, "load", CategorizeUrl, m_pluginId);
    }
    session.InitializePlugin(function InitializePluginUa(activatePlugin, registerMethod, callFunction) 
        {
            m_callFunction = callFunction;
            if (settings.needCheckVerdicts)
            {
                m_isVerdictSuitableForContinueFunc = function CheckVerdict(verdict) 
                    {
                        return verdict.rating === 3 || verdict.rating === 4 || verdict.rating === 5 || verdict.rating === 6;
                    };
            }
            activatePlugin(m_pluginId, OnPing);
            registerMethod("ua.verdict", SetVerdictDelayed);
            registerMethod("ua.settings", SetSettings);
        });
    Run();
};
var instance = null;
ns.RunModule(function RunModuleUrlAdvisor()
{
    if (!instance)
        instance = new UrlAdvisor();
}, 2500);
}, {}, ClearImages);
(function AbpProcessor(ns)
{
function QuerySelectorAll(obj, selector)
{
    return (obj === document) ? ns.DocumentQuerySelectorAll(selector) : ns.ElementQuerySelectorAll(obj, selector);
}
function ProcessSelector(selector)
{
    var trimmed = ns.StringTrim.call(selector);
    var str = ((trimmed[0] === ">") ? ":scope " : "* ") + trimmed;
    var selectorEnding = ns.StringSlice.call(str, -1);
    if (selectorEnding === ">" || selectorEnding === "+" || selectorEnding === "~")
        str += "*";
    return str;
}
function AddSelectorProcessor(selector, processors, isPseudoSelector) 
{
    if (!selector)
        return;
    var str = !isPseudoSelector ? ProcessSelector(selector) : "";
    processors.push(function pusher(objects)
        {
            var resultObjects = new ns.Set();
            ns.Array.from(objects).forEach(function ForEachObject(object)
            {
                if (isPseudoSelector)
                {
                    if (object.matches(selector))
                        ns.SetAdd.apply(resultObjects, [object]);
                }
                else
                {
                    var list = QuerySelectorAll(object, str);
                    if (typeof list != "undefined" && list.length)
                        list.forEach(function Add(item) { ns.SetAdd.call(resultObjects, item); });
                }
            });
            return ns.Array.from(resultObjects);
        });
}
function GetTextInsideBracket(queryParts)
{
    var result = "";
    for (var parentheses = 1; queryParts.index < queryParts.parts.length; ++queryParts.index)
    {
        if (!queryParts.parts[queryParts.index])
            continue;
        var part = queryParts.parts[queryParts.index];
        if (part === ")")
        {
            --parentheses;
            if (!parentheses)
                break;
        }
        else if (part === "(")
        {
            ++parentheses;
        }
        result += part;
    }
    return result;
}
function GetQuotedText(queryParts)
{
    var result = "";
    for (; queryParts.index < queryParts.parts.length; ++queryParts.index)
    {
        if (!queryParts.parts[queryParts.index])
            continue;
        var part = queryParts.parts[queryParts.index];
        if (part === "\"")
            break;
        result += part;
    }
    return result;
}
function RemoveChilds(objects)
{
    var result = new ns.Array();
    var objs = ns.Array.from(objects);
    objs.forEach(function ForEachObject(object)
    {
        if (!objs.some(
            function checker(element)
            {
                if (element === object)
                    return false;
                return element.contains(object);
            }
            ))
            result.push(object);
    });
    return result;
}
function PreprocessProperties(properties)
{
    if (properties.length >= 2 && properties[0] === "/" && properties[properties.length - 1] === "/")
        return ns.StringSubstring.call(properties, 1, properties.length - 1);
    var props = ns.StringReplace.call(properties, /\*+/g, "*");
    props = ns.StringReplace.call(props, /\^\|$/, "^");
    props = ns.StringReplace.call(props, /\W/g, "\\$&");
    props = ns.StringReplace.call(props, /\\\*/g, ".*");
    props = ns.StringReplace.call(props, /^\\\|/, "^");
    return ns.StringReplace.call(props, /\\\|$/, "$");
}
function GetMatcherFromText(inputText)
{
    try 
    {
        var expression = "";
        var flags = ""; 
        var execResult = (/^\/(.*)\/([imu]*)$/).exec(inputText);
        if (execResult)
        {
            expression = execResult[1];
            if (execResult[2])
                flags = execResult[2];
        }
        else
        {
            expression = ns.StringReplace.call(inputText, /[-\/\\^$*+?.()|[\]{}]/g, "\\$&"); 
        }
        return new RegExp(expression, flags); 
    }
    catch (e)
    {
        return null;
    }
}
function GetMatchedStylesheetSelectors(stylesheet, propertiesMatcher)
{
    var selectors = new ns.Array();
    try 
    {
        ns.Array.from(stylesheet.cssRules).forEach(function ForEachRule(rule)
        {
            if (rule.type !== rule.STYLE_RULE)
                return;
            var properties = "";
            for (var j = 0; j < rule.style.length; j++)
            {
                var propertyName = rule.style.item(j);
                properties += propertyName + ": " + rule.style.getPropertyValue(propertyName) + ";";
            }
            if (!propertiesMatcher.test(properties))
                return;
            selectors.push(rule.selectorText);
        });
    }
    catch (e)
    {
        return new ns.Array();
    }
    return selectors;
}
function GetDomStylesStrings(propertiesMatcher)
{
    var matcher = new RegExp(propertiesMatcher, "i"); 
    var selectorsGroup = "";
    ns.Array.from(this.document.styleSheets).forEach(function ForEachStyleSheet(styleSheet)
    {
        var matchedSelectors = GetMatchedStylesheetSelectors(styleSheet, matcher);
        matchedSelectors.forEach(function ForEachMatchedSelector(matchedSelector)
        {
            selectorsGroup += matchedSelector + ", ";
        });
    });
    if (selectorsGroup.length)
        selectorsGroup = selectorsGroup.substring(0, selectorsGroup.length - 2);
    return selectorsGroup;
}
function AbpHasProcessorFactory(queryParts, queryParser)
{
    var innerSelectorsProcessor = queryParser(queryParts);
    return function AbpHasProcessor(objects)
    {
        var resultObjects = new ns.Array();
        ns.Array.from(objects).forEach(function ForEachObject(object)
        {
            if (innerSelectorsProcessor([object]).length)
                resultObjects.push(object);
        });
        return resultObjects;
    };
}
function AbpContainsProcessorFactory(queryParts)
{
    var textInsideBracket = GetTextInsideBracket(queryParts);
    var matcher = GetMatcherFromText(textInsideBracket);
    return function AbpContainsProcessor(objects)
        {
            var resultObjects = new ns.Array();
            if (!matcher)
                return resultObjects;
            var filteredObjects = RemoveChilds(objects);
            filteredObjects.forEach(function ForEachFilteredObject(object)
            {
                if (matcher.test(object.textContent))
                    resultObjects.push(object);
            });
            return resultObjects;
        };
}
function IsObjectPropertiesMatch(object, selectors)
{
    var parent = object.parentNode || document;
    if (object === document)
        return false;
    var selectedObjects = ns.Array.from(QuerySelectorAll(parent, selectors));
    return selectedObjects.some(function checker(item) { return item === object; });
}
function AbpPopertiesProcessorFactory(queryParts)
{
    var textInsideBracket = GetTextInsideBracket(queryParts);
    var selectorRegexp = PreprocessProperties(textInsideBracket);
    var selectorsGroup = GetDomStylesStrings(selectorRegexp);
    return function AbpPopertiesProcessor(objects)
    {
        var resultObjects = new ns.Array();
        if (!selectorsGroup)
            return resultObjects;
        ns.Array.from(objects).forEach(function ForEachObject(object)
        {
            if (IsObjectPropertiesMatch(object, selectorsGroup))
                resultObjects.push(object);
        });
        return resultObjects;
    };
}
function NotFactory(queryParts, queryParser)
{
    var innerSelectorsProcessor = queryParser(queryParts, true);
    return function NotSelectorProcessor(objects)
    {
        var resultObjects = new ns.Array();
        var objs = (objects.length && objects[0] === document) ? ns.Array.from(QuerySelectorAll(document, "*")) : ns.Array.from(objects);
        objs.forEach(function ForEachObject(object)
        {
            if (!innerSelectorsProcessor([object]).length)
                resultObjects.push(object);
        });
        return resultObjects;
    };
}
function ParseQuery(queryParts, isPseudoSelector)
{
    var functions = new ns.Array();
    var collectedPart = "";
    for (; queryParts.index < queryParts.parts.length; ++queryParts.index)
    {
        if (!queryParts.parts[queryParts.index])
            continue;
        var part = queryParts.parts[queryParts.index];
        if (part === ")")
            break;
        var processorFactory = void 0;
        if (part === ":-abp-has(" || part === ":has(")
            processorFactory = AbpHasProcessorFactory;
        else if (part === ":-abp-contains(")
            processorFactory = AbpContainsProcessorFactory;
        else if (part === ":-abp-properties(")
            processorFactory = AbpPopertiesProcessorFactory;
        else if (part === ":not(")
            processorFactory = NotFactory;
        if (processorFactory)
        {
            ++queryParts.index;
            AddSelectorProcessor(collectedPart, functions, isPseudoSelector);
            collectedPart = "";
            functions.push(processorFactory(queryParts, ParseQuery));
            continue;
        }
        if (part === "(")
        {
            ++queryParts.index;
            part += GetTextInsideBracket(queryParts);
            if (queryParts.index < queryParts.parts.length)
                part += queryParts.parts[queryParts.index];
        }
        if (part === "\"")
        {
            ++queryParts.index;
            part += GetQuotedText(queryParts);
            if (queryParts.index < queryParts.parts.length)
                part += queryParts.parts[queryParts.index];
        }
        collectedPart += part;
    }
    AddSelectorProcessor(collectedPart, functions, isPseudoSelector);
    return function parser(objects)
    {
        var outputObjects = objects;
        functions.forEach(function ForEachFunction(func)
        {
            var tempObjects = func(outputObjects);
            outputObjects = tempObjects;
        });
        return outputObjects;
    };
}
ns.FindElementsByAbpRule = function FindElementsByAbpRule(abpRule)
{
    var partsValues = null;
    var splitRegExp = /(:has\()|(:-abp-has\()|(:-abp-contains\()|(:-abp-properties\()|(\()|(\))|(:not\()|(")/g;
    try 
    {
        partsValues = ns.StringSplit.call(abpRule, splitRegExp).filter(function FilterSplitResult(el) { return el; });
        var operation = ParseQuery({ parts: partsValues, index: 0 });
        return operation([document]);
    }
    catch (e)
    {
        var details = {
            rule: abpRule,
            originalMessage: e.message,
            partsValues: partsValues,
            splitBy: splitRegExp.source
        };
        ns.SessionError({ message: "ERR processing abp rule", details: ns.JSON.stringify(details) }, "ab_abp");        
    }
    return new ns.Array();
};
return ns;
})(AvNs);
function GetCommonLink()
{
    var commonLink = AvNs.GetResourceSrc("/abn/main.css");
    if (!AvNs.IsRelativeTransport())
        return commonLink;
    return "/" + AvNs.StringSubstr.call(commonLink, AvNs.GetBaseUrl().length);
}
function FindCommonLink()
{
    if (AvNs.HasDocumentQuerySelector())
        return AvNs.DocumentQuerySelector("link[href^=\"" + GetCommonLink() + "\"]");
    AvNs.Array.from(AvNs.documentStyleSheets).forEach(function ForEachStyleSheet(currentStyleSheet)
    {
        if (currentStyleSheet.href && AvNs.StringIndexOf.call(currentStyleSheet.href, GetCommonLink()) !== -1)
            return currentStyleSheet.ownerNode || currentStyleSheet.owningElement;
    });
    return null;
}
var abnRunner = function abnRunner(ns, session, settings)
{
    function AntiBanner()
    {
        var m_callFunction = ns.EmptyFunc;
        var m_usingStyles = new ns.Array();
        var m_deferredProcess = null;
        var m_processedIdentifier = "kl_abn_" + ns.GetCurrentTime();
        var m_firstRun = true;
        var m_randColorAttribute = settings.randomColor;
        var m_randBackgroundColorAttribute = settings.randomBackgroundColor;
        var m_observer = null;
        var m_abpRulesApplyTimeout = null;
        var m_pluginId = "abn";
        function OnPing()
        {
            return ns.MaxRequestDelay;
        }
        function GetStyleSheetFromNode(node)
        {
            return node.sheet || node.styleSheet;
        }
        function AddAntiBannerStyleSheet(styleSheet)
        {
            if (!styleSheet)
                return;
            m_usingStyles.push(styleSheet);
        }
        function AddUsingStyle(sheetNodes)
        {
            ns.Array.from(ns.documentStyleSheets).forEach(function ForEachStyleSheet(documentStyleSheet)
            {
                var ownerNode = ns.GetOwnerNode(documentStyleSheet);
                if (sheetNodes.indexOf(ownerNode) !== -1)
                    AddAntiBannerStyleSheet(documentStyleSheet);
            });
        }
        function SendAntibannerStat(newProcessedCount)
        {
            if (m_firstRun || newProcessedCount !== 0)
            {
                m_callFunction("abn.statInfo", { count: newProcessedCount });
                m_firstRun = false;
            }
        }
        function ApplyAbpRulesDelay(rule)
        {
            ns.SetTimeout(function ApplyAbpRulesTimerCallback()
                {
                    var elements = ns.Array.from(ns.FindElementsByAbpRule(rule));
                    var newProcessedCount = 0;
                    elements.forEach(function ForEachElement(element)
                    {
                        if (!element[m_processedIdentifier]) 
                        {
                            element[m_processedIdentifier] = true; 
                            element.style.display = "none";
                            ++newProcessedCount;
                        }
                    });
                    if (newProcessedCount)
                        SendAntibannerStat(newProcessedCount);
                }, 0, m_pluginId);
        }
        function ApplyAbpRules(rules)
        {
            if (!ns.FindElementsByAbpRule)
            {
                ns.SessionError("Function for abp rules is not defined", m_pluginId);
                return;
            }
            ns.Array.from(rules).forEach(ApplyAbpRulesDelay);
        }
        function CalculateNewProcessedItemsBySelector(selector)
        {
            var newProcessedCount = 0;
            var elementList = ns.Array.from(ns.DocumentQuerySelectorAll(selector));
            elementList.forEach(function ForEachElement(element)
            {
                if (!element[m_processedIdentifier]) 
                {
                    element[m_processedIdentifier] = true; 
                    ++newProcessedCount;
                }
            });
            return newProcessedCount;
        }
        function CheckSelectors(selector)
        {
            try
            {
                var selectorsArray = ns.Array.from(ns.StringSplit.call(selector, ","));
                selectorsArray.forEach(function ForEachSelector(currentSelector)
                {
                    try
                    {
                        ns.DocumentQuerySelector(currentSelector);
                    }
                    catch (e)
                    {
                        var detailsObject = {
                            cssRule: currentSelector,
                            originalMessage: e.message
                        };
                        var errorObject = {
                            message: "Wrong selector",
                            details: JSON.stringify(detailsObject),
                            stack: e.stack
                        };
                        ns.SessionError(errorObject, m_pluginId);
                    }
                });
            }
            catch (err)
            {
                ns.SessionError(err, m_pluginId);
            }
        }
        function DeferredProcessCssRules(rule, i)
        {
            try
            {
                if (!rule.selectorText)
                {
                    ns.SessionLog("Ignore rule " + i + " cause it empty");
                    return;
                }
                SendAntibannerStat(CalculateNewProcessedItemsBySelector(rule.selectorText));
            }
            catch (e)
            {
                if (e.message && (e.message === "SyntaxError" || (e.message.includes && e.message.includes("is not a valid selector"))))
                    CheckSelectors(rule.selectorText);
                else
                    ns.SessionError(e);
            }
        }
        function GetDeferredHandler(rule, i)
        {
            return function GetDeferredHandlerImpl() { DeferredProcessCssRules(rule, i); };
        }
        function ProcessCssRules(rules)
        {
            ns.Array.from(rules).forEach(function ForEachRule(rule, i)
            {
                ns.SetTimeout(GetDeferredHandler(rule, i), 0, m_pluginId);
            });
        }
        function CalculateNewProcessedItemsByStyle()
        {
            var newProcessedCount = 0;
            var elementList = ns.Array.from(document.getElementsByTagName("*"));
            elementList.forEach(function ForEachElement(element)
            {
                if (!element[m_processedIdentifier] 
                    && element.currentStyle.color === m_randColorAttribute
                    && element.currentStyle.backgroundColor === m_randBackgroundColorAttribute)
                {
                    element[m_processedIdentifier] = true; 
                    ++newProcessedCount;
                }
            });
            return newProcessedCount;
        }
        function CalculateNewProcessedItems()
        {
            if (ns.HasDocumentQuerySelectorAll())
            {
                var atLeastOneStyleExist = false;
                m_usingStyles.forEach(function ForEachStyle(usingStyle)
                {
                    try
                    {
                        var cssRules = usingStyle.cssRules || usingStyle.rules;
                        if (cssRules && cssRules.length)
                        {
                            ProcessCssRules(cssRules);
                            atLeastOneStyleExist = true;
                        }
                    }
                    catch (e)
                    {
                        ns.SessionLog(e);
                    }
                });
                if (!atLeastOneStyleExist)
                {
                    SendAntibannerStat(0);
                    ns.SessionLog("No one style exist. Count of using styles nodes: " + m_usingStyles.length);
                }
            }
            else
            {
                SendAntibannerStat(CalculateNewProcessedItemsByStyle());
            }
        }
        function ScheduleCalculateProcessedItems()
        {
            ns.ClearTimeout(m_deferredProcess);
            m_deferredProcess = ns.SetTimeout(CalculateNewProcessedItems, 500, m_pluginId);
        }
        function SetCss(rules)
        {
            if (rules.rules)
            {
                var sheetNodes = ns.AddStyles(rules.rules);
                ns.SetTimeout(function SetCssTimerCallback() { AddUsingStyle(sheetNodes); }, 0, m_pluginId);
            }
            if (rules.abpRules && rules.abpRules.length)
            {
                var applyRulesFunc = function ApplyAbpRulesFunc() { ApplyAbpRules(rules.abpRules); };
                applyRulesFunc();
                ns.AddEventListener(window, "load", applyRulesFunc, m_pluginId);
                if (m_observer)
                    m_observer.Stop();
                m_observer = ns.GetDomChangeObserver("*", m_pluginId);
                m_observer.Start(function AntiBannerMutationObserver()
                    {
                        ns.ClearTimeout(m_abpRulesApplyTimeout);
                        m_abpRulesApplyTimeout = ns.SetTimeout(applyRulesFunc, 2000, m_pluginId);
                    });
            }
            ns.SessionLog("Calculate processed items when setting css");
            ScheduleCalculateProcessedItems();
        }
        function OnLoadCommonCssImpl(target, secondChance)
        {
            var processLoadedSheetNode = function processLoadedSheetNode(sheetNode)
            {
                AddAntiBannerStyleSheet(sheetNode);
                ns.SessionLog("Calculate processed items when loading common css");
                ScheduleCalculateProcessedItems();
            };
            var sheetNode = GetStyleSheetFromNode(target);
            if (sheetNode)
            {
                processLoadedSheetNode(sheetNode);
            }
            else if (secondChance)
            {
                ns.SessionError("OnLoadCommonCss fail with not exist sheet", m_pluginId);
            }
            else
            {
                ns.SessionLog("Sheet doesn't exist for link element. Second try after one second");
                ns.SetTimeout(function SecondChanceForLoadCss() { OnLoadCommonCssImpl(target, true); }, 1000, m_pluginId);
            }
        }
        function OnLoadCommonCss(arg, secondChance)
        {
            var target = arg.target || arg.srcElement;
            OnLoadCommonCssImpl(target, secondChance);
        }
        session.InitializePlugin(
            function InitializePluginABN(activatePlugin, registerMethod, callFunction)
            {
                m_callFunction = callFunction;
                activatePlugin(m_pluginId, OnPing);
            }
            );
        var commonLink = FindCommonLink();
        if (commonLink)
        {
            ns.AddEventListener(commonLink, "load", OnLoadCommonCss, m_pluginId);
            var sheetNode = GetStyleSheetFromNode(commonLink);
            if (sheetNode)
                AddAntiBannerStyleSheet(sheetNode);
        }
        else
        {
            ns.SessionLog("Not found inserted common link", m_pluginId);
        }
        if (settings.insertCommonLink)
        {
            var link = ns.DocumentCreateElement("link");
            ns.ElementSetAttribute.call(link, "type", "text/css");
            ns.ElementSetAttribute.call(link, "rel", "stylesheet");
            ns.ElementSetAttribute.call(link, "href", ns.GetResourceSrc("/abn/main.css"));
            ns.ElementSetAttribute.call(link, "crossorigin", "anonymous");
            ns.AddEventListener(link, "load", OnLoadCommonCss, m_pluginId);
            if (document.head)
                ns.AppendChild(document.head, link);
            else
                ns.AppendChild(document.getElementsByTagName("head")[0], link);
        }
        SetCss(settings);
    }
    var instance = null;
    ns.RunModule(function RunModuleAB()
    {
        if (!instance)
            instance = new AntiBanner();
    });
};
var abnOptions = {
    name: "abn",
    runner: abnRunner,
    getParameters: function getParameters() { return { isCssUrlInjected: Boolean(FindCommonLink()) }; }
};
AvNs.AddRunner2(abnOptions);
let ShadowRootProcessor = () => false;
let ShadowRoots = new AvNs.Array();
function GetCommonLinkForShadow()
{
    const commonLink = AvNs.GetResourceSrc("/abn/main.css");
    if (!AvNs.IsRelativeTransport())
        return commonLink;
    return "/" + commonLink.substr(AvNs.GetBaseUrl().length);
}
function FindCommonLinkForShadow()
{
    if (AvNs.HasDocumentQuerySelector())
        return AvNs.DocumentQuerySelector(`link[href^="${GetCommonLinkForShadow()}"]`);
    for (const currentStyleSheet of AvNs.documentStyleSheets)
    {
        if (currentStyleSheet.href && currentStyleSheet.href.indexOf(GetCommonLinkForShadow()) !== -1)
            return currentStyleSheet.ownerNode || currentStyleSheet.owningElement;
    }
    return null;
}
if (AvNs.ElementAttachShadow)
{
    const originalToString = Element.prototype.attachShadow.toString();
    Element.prototype.attachShadow = function AttachShadowProxy(param)
    {
        var shadowRoot = AvNs.ElementAttachShadow.call(this, param);
        try
        {
            if (param.mode === "closed" && !ShadowRootProcessor(shadowRoot))
                ShadowRoots.push(shadowRoot);
        }
        catch (e)
        {
            AvNs.SessionError(e, "abn_shadow");
        }
        return shadowRoot;
    };
    Element.prototype.attachShadow.toString = () => originalToString;
}
const shadowAbnRunner = (ns, session) =>
{
    function ShadowAntiBanner()
    {
        const m_usingStyles = new ns.Array();
        const m_pluginId = "abn_shadow";
        function OnPing()
        {
            return ns.MaxRequestDelay;
        }
        function FillStyleElement(style)
        {
            for (const abnStyle of m_usingStyles)
            {
                if (abnStyle.disabled)
                    continue;
                try
                {
                    const rules = abnStyle.cssRules || abnStyle.rules;
                    for (const rule of rules)
                        ns.AppendChild(style, document.createTextNode(rule.cssText));
                }
                catch (e)
                {
                    ns.SessionLog(e);
                }
            }
        }
        function AddSelectorsToShadowRoot(shadowRoot)
        {
            try
            {
                ns.SessionLog("Process new shadow root");
                const style = ns.DocumentCreateElement("style");
                style.type = "text/css";
                if (ns.ContentSecurityPolicyNonceAttribute)
                    ns.ElementSetAttribute.call(style, "nonce", ns.ContentSecurityPolicyNonceAttribute);
                ns.SetTimeout(() => { FillStyleElement(style, shadowRoot); }, 100, m_pluginId);
                ns.AppendChild(shadowRoot, style);
            }
            catch (e)
            {
                ns.SessionError(e, m_pluginId);
            }
            return true;
        }
        function AddAntiBannerStyleSheet(styleSheet)
        {
            if (!styleSheet)
                return;
            m_usingStyles.push(styleSheet);
        }
        function OnLoadCommonCss(arg)
        {
            const processLoadedSheetNode = () =>
            {
                if (arg)
                    AddAntiBannerStyleSheet(arg.target.sheet);
                ShadowRootProcessor = AddSelectorsToShadowRoot;
                for (const shadowRoot of ShadowRoots)
                    AddSelectorsToShadowRoot(shadowRoot);
                ShadowRoots = new ns.Array();
            };
            if (arg && arg.target && arg.target.sheet)
                processLoadedSheetNode();
            else
                ns.SetTimeout(processLoadedSheetNode, 500, m_pluginId);
        }
        session.InitializePlugin((activatePlugin) => { activatePlugin(m_pluginId, OnPing); });
        const commonLink = FindCommonLinkForShadow();
        if (commonLink)
        {
            if (commonLink.sheet)
            {
                AddAntiBannerStyleSheet(commonLink.sheet);
                OnLoadCommonCss(new ns.Object({ target: commonLink }));
            }
            else
            {
                ns.AddEventListener(commonLink, "load", OnLoadCommonCss, m_pluginId);
            }
        }
        else
        {
            ns.SessionLog("Not found inserted common link");
        }
    }
    let instance = null;
    ns.RunModule(function RunModuleShadowAntiBanner()
    {
        if (!instance)
            instance = new ShadowAntiBanner();
    });
};
const shadowAbnOptions = {
    name: "abn_shadow",
    runner: shadowAbnRunner,
    getParameters: () => (new AvNs.Object({ isCssUrlInjected: Boolean(FindCommonLinkForShadow()) }))
};
AvNs.AddRunner2(shadowAbnOptions);
AvNs.AddRunner("cb", function AddRunnerCB(ns, session)
{
    function ContentBlocker()
    {
        var m_idleStartTime = ns.GetCurrentTime();
        var m_callFunction = ns.EmptyFunc;
        function OnPing(currentTime)
        {
            var idleTime = (currentTime >= m_idleStartTime) ? currentTime - m_idleStartTime : 0;
            return idleTime <= 10000 ? 500 : ns.MaxRequestDelay;
        }
        function ReloadUrl()
        {
            m_idleStartTime = ns.GetCurrentTime();
            session.Reload();
        }
        function blockImageByPath(url, blockImageResponse)
        {
            var endsWithUrl = function endsWithUrl(pattern)
                {
                    var d = pattern.length - url.length;
                    return d >= 0 && ns.StringLastIndexOf.call(pattern, url) === d;
                };
            var images = ns.Array.from(document.getElementsByTagName("img"));
            images.forEach(function ForEachImage(image)
            {
                if (endsWithUrl(image.src) && image.style.display !== "none")
                {
                    image.style.display = "none";
                    ++blockImageResponse.blockedImagesCount;
                }
            });
        }
        function BlockImage(blockImageRequest)
        {
            var blockImageResponse = new ns.Object({ blockedImagesCount: 0, requestId: "" });
            var SendResponse = function SendResponseImpl() 
            {
                m_callFunction("cb.BlockResults", blockImageResponse);
                SendResponse = ns.EmptyFunc;
            };
            try
            {
                blockImageResponse.requestId = blockImageRequest.requestId;
                ns.Array.from(blockImageRequest.urls).forEach(function ForEachUrl(url)
                {
                    blockImageByPath(url, blockImageResponse);
                });
                SendResponse();
            }
            catch (e)
            {
                SendResponse();
                throw e;
            }
        }
        session.InitializePlugin(function InitializePluginContentBlocker(activatePlugin, registerMethod, callFunction)
        {
            m_callFunction = callFunction;
            activatePlugin("cb", OnPing);
            registerMethod("cb.reloadUrl", ReloadUrl);
            registerMethod("cb.blockImage", BlockImage);
        });
    }
    var m_contentBlocker = new ContentBlocker(); 
});
(function DomParserMain(ns)
{
var m_pluginId = "dp";
function DomParser(session)
{
    var m_callFunction = ns.EmptyFunc;
    var m_logins = new ns.Array();
    var m_passwords = new ns.Array();
    var m_newPasswords = new ns.Array();
    var m_address = new ns.Array();
    var m_card = new ns.Array();
    var m_cachedFlag = false;
    var m_pathName = GetCurrentPathname();
    var m_selectorsRequested = false;
    var m_callbacksQueue = new ns.Array();
    var m_idCounter = 0;
    var m_wfdIdCounter = 1;
    function GetCurrentPathname()
    {
        if (document.location)
            return document.location.pathname;
        var currentUrl = ns.TryCreateUrl(document.URL);
        if (currentUrl)
            return currentUrl.pathname;
        ns.SessionError("Location is empty. Can't create URL from " + document.URL + ". Pathname not accessible", m_pluginId);
        return "";
    }
    function OnGetFieldsCallback(result, selectors)
    {
        if (result === 0 && selectors)
        {
            if (selectors.loginSelectors)
                ns.Array.prototype.push.apply(m_logins, selectors.loginSelectors);
            if (selectors.passwordSelectors)
                ns.Array.prototype.push.apply(m_passwords, selectors.passwordSelectors);
            if (selectors.newPasswordSelectors)
                ns.Array.prototype.push.apply(m_newPasswords, selectors.newPasswordSelectors);
            if (selectors.addressSelectors)
                ns.Array.prototype.push.apply(m_address, selectors.addressSelectors);
            if (selectors.cardSelectors)
                ns.Array.prototype.push.apply(m_card, selectors.cardSelectors);
            m_cachedFlag = true;
        }
        else
        {
            ns.SessionLog("Get fields result: " + result);
        }
        m_selectorsRequested = false;
        ns.SessionLog("Dom parser call get field callbacks: " + m_callbacksQueue.length);
        m_callbacksQueue.forEach(function ForEachCallback(callback)
        {
            callback(result);
        });
    }
    function CleanupElements()
    {
        if (!ns.HasDocumentQuerySelectorAll())
            return;
        var elements = ns.Array.from(ns.DocumentQuerySelectorAll("[wfd-value],[wfd-invisible]"));
        elements.forEach(function ForEachElement(element)
        {
            if (element.hasAttribute("wfd-value"))
                element.removeAttribute("wfd-value");
            if (element.hasAttribute("wfd-invisible"))
                element.removeAttribute("wfd-invisible");
        });
    }
    function CallService(argObject)
    {
        m_callFunction("dp.onGetFields", argObject, OnGetFieldsCallback);
        CleanupElements();
    }
    function ProcessChilds(childNodes)
    {
        ns.Array.from(childNodes).forEach(function ForEachChildNode(element)
        {
            if (element.nodeType !== Node.ELEMENT_NODE)
                return;
            if (!ns.IsElementDisplayed(element))
            {
                ns.ElementSetAttribute.call(element, "wfd-invisible", true);
            }
            else
            {
                ns.ElementSetAttribute.call(element, "wfd-id", "id" + m_idCounter);
                ++m_idCounter;
                ProcessChilds(element.childNodes);
            }
        });
    }
    function ProcessNextGroupElement(tree, finishCallback)
    {
        var counter = 0;
        while (tree.nextNode())
        {
            ++counter;
            ns.ElementSetAttribute.call(tree.currentNode, "wfd-invisible", true);
            if (counter === 50)
            {
                ns.SetTimeout(function TimerCallback() { ProcessNextGroupElement(tree, finishCallback); }, 100, m_pluginId);
                return;
            }
        }
        finishCallback();
    }
    function GetSelectorsWithTreeWalker()
    {
        if (!document.body || !document.body.nodeType)
        {
            ns.AddEventListener(window, "load", GetSelectorsWithTreeWalker, m_pluginId);
            return;
        }
        ns.SessionLog("Get selectors with tree walker");
        var filter = {
            acceptNode: function acceptNode(node)
            {
                if (!node)
                    return NodeFilter.FILTER_SKIP;
                if (ns.TryGetTagName(node) === "INPUT")
                {
                    ns.ElementSetAttribute.call(node, "wfd-id", "id" + m_idCounter);
                    ++m_idCounter;
                }
                if (node.parentNode && typeof node.parentNode.getAttribute === "function" && node.parentNode.getAttribute("wfd-invisible") === true)
                    return NodeFilter.FILTER_REJECT;
                if (!ns.IsElementDisplayed(node))
                    return NodeFilter.FILTER_ACCEPT;
                return NodeFilter.FILTER_SKIP;
            }
        };
        var tree = ns.CreateTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, filter.acceptNode, false);
        function finishCallback()
        {
            ns.SessionLog("Get selectors with tree walker: call service");
            CallService(new ns.Object({ dom: "<body>" + (document.body ? document.body.innerHTML : "") + "</body>" }));
        }
        ProcessNextGroupElement(tree, finishCallback);
    }
    function GetSelectorsFromService()
    {
        try
        {
            ns.SessionLog("Get selectors from service");
            ProcessChilds(document.body.childNodes);
        }
        catch (e)
        {
            ns.SessionLog(e);
        }
        ns.SessionLog("Get selectors from service: call service");
        CallService(new ns.Object({ dom: document.documentElement.innerHTML }));
    }
    function GetSelectorsInternal(callback, selectors)
    {
        if (m_cachedFlag)
        {
            if (selectors.length > 0)
            {
                ns.SessionLog("Get selectors from cache");
                callback(0, selectors);
            }
            return;
        }
        function clientCallback(result) { callback(result, selectors); }
        m_callbacksQueue.push(clientCallback);
        if (!m_selectorsRequested)
        {
            m_selectorsRequested = true;
            if (document.createTreeWalker)
                GetSelectorsWithTreeWalker();
            else
                GetSelectorsFromService();
        }
    }
    function AddWfdAttribute(input, settings)
    {
        try
        {
            if (!input || !input.value)
                return;
            if (settings && settings.avoidTypes && input.type && settings.avoidTypes.includes(input.type))
                return;
            if (input.type === "password")
                return;
            ns.ElementSetAttribute.call(input, "wfd-value", ns.ToBase64(input.value));
        }
        catch (e)
        {
            ns.SessionLog(e);
        }
    }
    this.GetLoginSelectors = function GetLoginSelectors(clientCallback)
    {
        ns.SessionLog("Dom parser get Login selectors");
        GetSelectorsInternal(clientCallback, m_logins);
    };
    this.GetPasswordSelectors = function GetPasswordSelectors(clientCallback)
    {
        ns.SessionLog("Dom parser get password selectors");
        GetSelectorsInternal(clientCallback, m_passwords);
    };
    this.GetNewPasswordSelectors = function GetNewPasswordSelectors(clientCallback)
    {
        ns.SessionLog("Dom parser get new password selectors");
        GetSelectorsInternal(clientCallback, m_newPasswords);
    };
    this.GetAddressSelectors = function GetAddressSelectors(clientCallback)
    {
        ns.SessionLog("Dom parser get address selectors");
        GetSelectorsInternal(clientCallback, m_address);
    };
    this.GetCardSelectors = function GetCardSelectors(clientCallback)
    {
        ns.SessionLog("Dom parser get card selectors");
        GetSelectorsInternal(clientCallback, m_card);
    };
    function onGetCookiesFieldsCallback(clientCallback, result, selectorObject)
    {
        ns.SessionLog("Get cookie selector callback called");
        clientCallback(result, selectorObject);
    }
    this.GetCookieSelector = function GetCookieSelector(clientCallback)
    {
        ns.SessionLog("Get cookie selector called");
        var elements = new ns.Array();
        elements = ns.Array.prototype.concat.apply(elements, document.getElementsByTagName("div"));
        elements = ns.Array.prototype.concat.apply(elements, document.getElementsByTagName("a"));
        elements = ns.Array.prototype.concat.apply(elements, document.getElementsByTagName("button"));
        elements = ns.Array.prototype.concat.apply(elements, document.getElementsByTagName("input"));
        ns.SessionLog("Elements for cookie selector size: " + elements.length);
        var callback = function CallToService()
        {
            m_callFunction("dp.onGetCookiesFields",
                new ns.Object({ dom: "<body>" + (document.body ? document.body.innerHTML : "") + "</body>" }),
                function CallCallback(res, args) { onGetCookiesFieldsCallback(clientCallback, res, args); });
        };
        SetWfdIdAttribute(elements, callback);
    };
    function GetTimerCallback(elements, i, finishCallback)
    {
        return function TimerCallback() { SetWfdIdAttribute(elements.slice(i), finishCallback); };
    }
    function SetWfdIdAttribute(elements, finishCallback)
    {
        if (elements)
        {
            elements.forEach(function ForEachElement(element, i)
            {
                if (i === 50)
                {
                    ns.SetTimeout(GetTimerCallback(elements, i, finishCallback), 100, m_pluginId);
                    return;
                }
                if (!ns.IsElementDisplayed(element))
                {
                    ns.ElementSetAttribute.call(element, "wfd-invisible", true);
                }
                else
                {
                    ns.ElementSetAttribute.call(element, "wfd-id", m_wfdIdCounter);
                    m_wfdIdCounter++;
                }
            });
        }
        if (finishCallback)
            finishCallback();
    }
    this.SetWfdIds = function SetWfdIds(settings)
    {
        var inputs = document.getElementsByTagName("input");
        if (inputs)
        {
            ns.Array.from(inputs).forEach(function ForEachInput(input)
            {
                AddWfdAttribute(input, settings);
            });
        }
        if (settings && settings.wfdIdSelector)
        {
            var elements = ns.DocumentQuerySelectorAll(settings.wfdIdSelector);
            if (elements)
            {
                ns.Array.from(elements).forEach(function ForEachElement(element)
                {
                    if (!ns.IsElementDisplayed(element))
                    {
                        ns.ElementSetAttribute.call(element, "wfd-invisible", true);
                    }
                    else
                    {
                        ns.ElementSetAttribute.call(element, "wfd-id", m_wfdIdCounter);
                        m_wfdIdCounter++;
                    }
                });
            }
        }
        return document.documentElement.innerHTML;
    };
    this.Reset = function ResetDomParser()
    {
        ResetCacheFlag();
    };
    function OnPing()
    {
        return ns.MaxRequestDelay;
    }
    function OnInitializeCallback(activatePlugin, registerMethod, callFunction)
    {
        m_callFunction = callFunction;
        activatePlugin(m_pluginId, OnPing);
    }
    function ResetCacheFlag()
    {
        ns.SessionLog("Reset cache flag");
        m_cachedFlag = false;
    }
    function UpdateLocationPathName()
    {
        var currentPathName = GetCurrentPathname();
        if (m_pathName !== currentPathName)
        {
            m_pathName = currentPathName;
            ResetCacheFlag();
        }
    }
    function InitializePlugin()
    {
        session.InitializePlugin(OnInitializeCallback);
        ns.AddEventListener(window, "popstate", ResetCacheFlag, m_pluginId);
        ns.AddEventListener(document, "load", UpdateLocationPathName, m_pluginId);
        ns.SubscribeHistoryChanged(m_pluginId, ResetCacheFlag);
    }
    InitializePlugin();
}
var gDomParser = null;
ns.GetDomParser = function GetDomParser(session)
{
    if (!gDomParser)
        gDomParser = new DomParser(session);
    return gDomParser;
};
return ns;
})(AvNs);
(function BallonMain(ns)
{
ns.Balloon2 = function Balloon2(pluginName, balloonSrc, balloonCssPostfix, session, getCoordCallback, onCloseHandler, locales, onDataReceiveHandler)
{
    var m_balloon = ns.DocumentCreateElement("iframe");
    var m_shadowRoot = null;
    var m_balloonId = pluginName + "_b";
    var m_balloonClassName = "b_KlBalloonClass"; 
    var m_balloonSize = null;
    var m_sizeCache = new ns.Object({});
    var m_initStyleDataPair = new ns.Object({});
    var m_isInitSent = false;
    var m_updateTimeout = null;
    var m_balloonElementInDom = false;
    var m_isBalloonLoaded = false;
    var m_callQueue = new ns.Array();
    function ChangeSchemeIfNeed(url)
    {
        if (document.location.protocol === "https:")
            return ns.StringReplace.call(url, "http:", "https:");
        return url;
    }
    function GetResourceUrl()
    {
        return balloonCssPostfix
            ? ns.GetResourceSrc(balloonSrc) + "?cssSrc=" + encodeURIComponent(ChangeSchemeIfNeed(ns["GetResourceSrc"](balloonCssPostfix)))
            : ns.GetResourceSrc(balloonSrc);
    }
    function HideBalloon()
    {
        m_balloon.style.display = "none";
    }
    function InitializeBalloon()
    {
        if (!document.body)
        {
            ns.AddEventListener(window, "load", InitializeBalloon, m_balloonId);
            return;
        }
        m_balloon.scrolling = "no";
        m_balloon.frameBorder = "0";
        m_balloon.style.border = "0";
        m_balloon.style.height = "1px";
        m_balloon.style.width = "1px";
        m_balloon.style.left = "1px";
        m_balloon.style.top = "1px";
        m_balloon.allowTransparency = "true"; 
        m_balloon.style.zIndex = "2147483647";
        m_balloon.style.position = "absolute";
        m_balloon.id = "KlIFrameId";
        if (ns.ElementAttachShadow)
        {
            m_shadowRoot = ns.DocumentCreateElement("div");
            ns.ElementSetAttribute.call(m_shadowRoot, "class", m_balloonClassName);
            var shadowRoot = ns.ElementAttachShadow.call(m_shadowRoot, new ns.Object({ mode: "open" }));
            ns.AppendChild(shadowRoot, m_balloon);
            ns.AppendChild(document.body, m_shadowRoot);
        }
        else
        {
            ns.AppendChild(document.body, m_balloon);
        }
        m_balloonElementInDom = true;
        HideBalloon();
    }
    function IsDisplayed()
    {
        return m_balloonElementInDom && m_balloon.style.display === "";
    }
    function OnPing()
    {
        return IsDisplayed() ? 100 : ns.MaxRequestDelay;
    }
    function SendToFrame(args)
    {
        if (!m_balloon.contentWindow)
        {
            ns.SessionLog("No content window for balloon. Possible iframe detached");
            return;
        }
        if (m_isBalloonLoaded)
            m_balloon.contentWindow.postMessage(ns.JSON.stringify(args), GetResourceUrl());
        else
            m_callQueue.push(function DeferSend() { m_balloon.contentWindow.postMessage(ns.JSON.stringify(args), GetResourceUrl()); });
    }
    function SendInit(dataToFrame)
    {
        dataToFrame.style = m_initStyleDataPair.style;
        dataToFrame.data = m_initStyleDataPair.data;
        m_isInitSent = true;
        SendToFrame(dataToFrame);
        session.ForceReceive();
    }
    function PutSizeInCache(style, size)
    {
        m_sizeCache[style ? style.toString() : ""] = size;
    }
    function PositionBalloon()
    {
        if (!m_balloonSize)
            return;
        var coords = getCoordCallback(m_balloonSize);
        var newHeight = m_balloonSize.height + "px";
        var newWidth = m_balloonSize.width + "px";
        if (newHeight !== m_balloon.style.height 
            || newWidth !== m_balloon.style.width)
        {
            m_balloon.style.height = newHeight;
            m_balloon.style.width = newWidth;
            ns.SessionLog("Change balloon size " + m_balloonId + " height: " + newHeight + " width: " + newWidth);
        }
        if (!coords)
        {
            ns.SessionLog("Change balloon position skiped");
            return;
        }
        var newX = Math.round(coords.x).toString() + "px";
        var newY = Math.round(coords.y).toString() + "px";
        if (newX !== m_balloon.style.left 
            || newY !== m_balloon.style.top)
        {
            m_balloon.style.left = newX;
            m_balloon.style.top = newY;
            ns.SessionLog("Change balloon position " + m_balloonId + " x: " + newX + " y: " + newY);
        }
    }
    function SetupBalloon(balloonSize)
    {
        m_balloonSize = balloonSize;
        PositionBalloon();
    }
    function OnSizeMessage(sizeMessage)
    {
        var size = {
            height: sizeMessage.height,
            width: sizeMessage.width
        };
        if (size.height > 1 && size.width > 1)
            PutSizeInCache(sizeMessage.style, size);
        SetupBalloon(size);
    }
    function OnCloseMessage(closeData)
    {
        HideBalloon();
        if (onCloseHandler && closeData.closeAction)
            onCloseHandler(closeData.closeAction);
    }
    function OnDataMessage(data)
    {
        if (onDataReceiveHandler)
            onDataReceiveHandler(data);
    }
    function GetSizeFromCache(style)
    {
        return m_sizeCache[style ? style.toString() : ""];
    }
    function DisplayBalloon()
    {
        m_balloon.style.display = "";
        session.ForceReceive();
    }
    function UpdateBalloon(style, data)
    {
        if (!m_isInitSent)
            m_initStyleDataPair = { style: style, data: data };
        var sizeFromCache = GetSizeFromCache(style);
        ns.ClearTimeout(m_updateTimeout);
        if (sizeFromCache)
        {
            m_updateTimeout = ns.SetTimeout(function UpdateTimerCallback() { SetupBalloon(sizeFromCache); }, 0, "balloon_" + pluginName);
        }
        else
        {
            m_balloon.style.height = "1px";
            m_balloon.style.width = "1px";
            m_balloonSize = { height: 1, width: 1 };
        }
        var dataToFrame = {
            command: "update",
            style: style,
            data: data,
            needSize: !sizeFromCache
        };
        SendToFrame(dataToFrame);
    }
    function CreateBalloon(style, data, size)
    {
        if (!m_balloonElementInDom)
            InitializeBalloon();
        DisplayBalloon();
        if (m_balloon.src)
        {
            UpdateBalloon(style, data);
            return;
        }
        m_initStyleDataPair = { style: style, data: data };
        m_balloon.src = GetResourceUrl();
        var balloonSize = size ? size : GetSizeFromCache(style);
        var dataToFrame = {
            command: "init",
            pluginName: m_balloonId,
            isRtl: ns.IsRtl,
            needSize: !balloonSize,
            style: style
        };
        if (data)
            dataToFrame.data = data;
        if (size)
            dataToFrame.explicitSize = size;
        if (locales)
            dataToFrame.locales = locales;
        dataToFrame.commandUrl = ChangeSchemeIfNeed(ns.GetCommandSrc());
        ns.AddEventListener(m_balloon, "load", function onLoad()
        { 
            m_isBalloonLoaded = true;
            SendInit(dataToFrame);
            while (m_callQueue.length)
                m_callQueue.shift()();
        }, "balloon");
        if (balloonSize)
        {
            ns.ClearTimeout(m_updateTimeout);
            m_updateTimeout = ns.SetTimeout(function UpdateTimerCallback() { SetupBalloon(balloonSize); }, 0);
        }
    }
    function DestroyBalloon()
    {
        if (!m_balloonElementInDom)
            return;
        m_balloon.blur(); 
        if (m_shadowRoot)
            ns.RemoveElement(m_shadowRoot);
        else
            ns.RemoveElement(m_balloon);
        m_balloonElementInDom = false;
        m_balloonSize = null;
    }
    this.Show = function Show(style, data)
    {
        CreateBalloon(style, data);
    };
    this.ShowWithSize = function ShowWithSize(style, data, size)
    {
        CreateBalloon(style, data, size);
    };
    this.Resize = function Resize(size)
    {
        SetupBalloon(size);
    };
    this.Hide = function Hide()
    {
        HideBalloon();
    };
    this.Update = function Update(style, data)
    {
        UpdateBalloon(style, data);
    };
    this.UpdatePosition = function UpdatePosition()
    {
        PositionBalloon();
    };
    this.LightUpdatePosition = function LightUpdatePosition(x, y)
    {
        var newX = Math.round(x).toString() + "px";
        var newY = Math.round(y).toString() + "px";
        if (newX !== m_balloon.style.left 
            || newY !== m_balloon.style.top)
        {
            m_balloon.style.left = newX;
            m_balloon.style.top = newY;
        }
        var dataToFrame = {
            command: "update",
            data: new ns.Object({})
        };
        SendToFrame(dataToFrame);
    };
    this.Destroy = function Destroy()
    {
        DestroyBalloon();
    };
    this.IsFocused = function IsFocused()
    {
        if (!m_balloon)
            return false;
        return document.activeElement === m_balloon;
    };
    function OnFrameDataMessage(argument)
    {
        if (!argument)
        {
            ns.SessionLog(m_balloonId + " empty argument");
            return;
        }
        if (!argument.message)
        {
            ns.SessionLog(m_balloonId + " empty message.");
            return;
        }
        var message = ns.JSON.parse(argument.message);
        if (message.type === "size")
            OnSizeMessage(message.data);
        else if (message.type === "close")
            OnCloseMessage(message.data);
        else if (message.type === "data")
            OnDataMessage(message.data);
        else if (message.type === "trace")
            ns.SessionLog(message.data);
        else
            ns.SessionError({ message: "Unknown message type", details: "type: " + message.type }, m_balloonId);
    }
    function Init()
    {
        session.InitializePlugin(function InitializePluginBalloon(activatePlugin, registerMethod)
            {
                activatePlugin(m_balloonId, OnPing);
                registerMethod(m_balloonId + ".message", OnFrameDataMessage);
            });
    }
    Init();
};
return ns;
})(AvNs);
AvNs.StartSession();
 })();
