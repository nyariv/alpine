(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Alpine = factory());
}(this, (function () { 'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  class Prop{constructor(e,t,r=!1,s=!1){this.context=e,this.prop=t,this.isConst=r,this.isGlobal=s;}}class Lisp{constructor(e){this.op=e.op,this.a=e.a,this.b=e.b;}}class If{constructor(e,t){this.t=e,this.f=t;}}class KeyVal{constructor(e,t){this.key=e,this.val=t;}}class Scope{constructor(e,t={},r=!1,s){this.const={},this.var={},this.globals={},this.parent=e,this.let=e?t:{},this.globals=e?{}:t,this.globalProp=s,this.functionScope=r||!e;}get(e,t=!1){if(!this.parent||!t||this.functionScope){if(e in this.const)return new Prop(this.const,e,!0,e in this.globals);if(e in this.var)return new Prop(this.var,e,!1,e in this.globals);if(e in this.let)return new Prop(this.let,e,!1,e in this.globals);if(!this.parent&&e in this.globals)return new Prop(this.globalProp.context.global,e,!1,!0);if(!this.parent)return new Prop(void 0,e)}return this.parent.get(e,t)}set(e,t){let r=this.get(e);if(void 0===r.context)throw new Error(`Variable '${e}' was not declared.`);if(r.isConst)throw Error(`Cannot assign to const variable '${e}'`);if(r.isGlobal)throw Error(`Cannot override global variable '${e}'`);return r.context[r]=t,r}declare(e,t=null,r,s=!1){if("var"===t&&!this.functionScope&&this.parent)this.parent.declare(e,t,r);else {if(e in this.var&&e in this.let&&e in this.const&&e in this.globals)throw Error(`Variable '${e}' already declared`);s&&(this.globals[e]=r),this[t][e]=r;}}}class SandboxGlobal{constructor(e){if(e===globalThis)return globalThis;for(let t in e)this[t]=e[t];}}function sandboxFunction(e){return function SandboxFunction(...t){let r=t.pop(),s=Sandbox.parse(r);return function(...r){const n={this:void 0};for(let e of t)n[e]=r.shift();n.this=null!=this?this:globalThis;const i=new Scope(e.globalScope,n),o=e.sandbox.executeTree(s,[i]);if(e.options.audit){for(let t in o.auditReport.globalsAccess){let r=o.auditReport.globalsAccess[t];e.auditReport.globalsAccess[t]=e.auditReport.globalsAccess[t]||new Set,r.forEach(r=>{e.auditReport.globalsAccess[t].add(r);});}for(let t in o.auditReport.prototypeAccess){let r=o.auditReport.prototypeAccess[t];e.auditReport.prototypeAccess[t]=e.auditReport.prototypeAccess[t]||new Set,r.forEach(r=>{e.auditReport.prototypeAccess[t].add(r);});}}return o.result}}}function sandboxedEval(e){return function(t){return e(t)()}}let expectTypes={op:{types:{op:/^(\/|\*\*(?!\=)|\*(?!\=)|\%(?!\=))/},next:["value","prop","exp","modifier","incrementerBefore"]},splitter:{types:{split:/^(&&|&|\|\||\||<=|>=|<|>|!==|!=|===|==|#io#|\+(?!\+)|\-(?!\-))(?!\=)/},next:["value","prop","exp","modifier","incrementerBefore"]},if:{types:{if:/^\?/,else:/^:/},next:["expEnd"]},assignment:{types:{assignModify:/^(\-=|\+=|\/=|\*\*=|\*=|%=|\^=|\&=|\|=)/,assign:/^(=)/},next:["value","prop","exp","modifier","incrementerBefore"]},incrementerBefore:{types:{incrementerBefore:/^(\+\+|\-\-)/},next:["prop"]},incrementerAfter:{types:{incrementerAfter:/^(\+\+|\-\-)/},next:["splitter","op","expEnd"]},expEdge:{types:{arrayProp:/^[\[]/,call:/^[\(]/},next:["splitter","op","expEdge","if","dot","expEnd"]},modifier:{types:{not:/^!/,inverse:/^~/,negative:/^\-(?!\-)/,positive:/^\+(?!\+)/,typeof:/^#to#/},next:["exp","modifier","value","prop","incrementerBefore"]},exp:{types:{createObject:/^\{/,createArray:/^\[/,group:/^\(/},next:["splitter","op","expEdge","if","dot","expEnd"]},dot:{types:{dot:/^\./},next:["splitter","incrementerAfter","assignment","op","expEdge","if","dot","expEnd"]},prop:{types:{prop:/^[a-zA-Z\$_][a-zA-Z\d\$_]*/},next:["splitter","incrementerAfter","assignment","op","expEdge","if","dot","expEnd"]},value:{types:{number:/^\-?\d+(\.\d+)?/,string:/^"(\d+)"/,literal:/^`(\d+)`/,boolean:/^(true|false)(?![\w$_])/,null:/^null(?![\w$_])/,und:/^undefined(?![\w$_])/,NaN:/^NaN(?![\w$_])/,Infinity:/^Infinity(?![\w$_])/},next:["splitter","op","if","dot","expEnd"]},initialize:{types:{initialize:/^#(var|let|const)#[a-zA-Z\$_][a-zA-Z\d\$_]*/},next:["value","prop","exp","modifier","incrementerBefore"]},expEnd:{types:{},next:[]},expStart:{types:{return:/^#return#/},next:["value","prop","exp","modifier","incrementerBefore","expEnd"]}},closings={"(":")","[":"]","{":"}","'":"'",'"':'"',"`":"`"};const restOfExp=(e,t,r)=>{let s=/^[\+\-~#!]/,n=!0;t=t||[expectTypes.op.types.op,expectTypes.splitter.types.split,expectTypes.if.types.if,expectTypes.if.types.else];let i,o=!1,p=!1;for(i=0;i<e.length&&!p;i++){let l=e[i];if('"'===r||"'"===r||"`"===r){if("`"!==r||"$"!==l||"{"!==e[i+1]||o){if(l===r&&!o)return e.substring(0,i)}else {i+=restOfExp(e.substring(i+2),[/^}/]).length+2;}o="\\"===l;}else if(closings[l]){i+=restOfExp(e.substring(i+1),[new RegExp("^\\"+closings[r])],l).length+1,n=!1;}else if(r){if(l===closings[r])return e.substring(0,i)}else {let r=e.substring(i);if(t.forEach(e=>{p=p||e.test(r);}),n&&(s.test(r)?p=!1:n=!1),p)break}}return e.substring(0,i)};function assignCheck(e){if(void 0===e.context)throw new Error("Cannot assign value to undefined.");if(e.isConst)throw new Error(`Cannot set value to const variable '${e.prop}'`);if(e.isGlobal)throw Error(`Cannot override property of global variable '${e.prop}'`);if(!e.context.hasOwnProperty(e.prop)&&e.prop in e.context)throw Error(`Cannot override prototype property '${e.prop}'`)}restOfExp.next=["splitter","op","expEnd"];let ops2={prop:(e,t,r,s,n)=>{if(void 0===e){let e=n.get(t);if(void 0===e.context)throw new Error(`${t} is not defined`);if(e.context===s.globalProp.context.global){if(s.options.audit&&s.auditReport.globalsAccess.add(t),s.globalProp.context.global[t]===Function)return s.Function;if(s.globalProp.context.global[t]===eval)return s.eval;const e=s.globalProp.context.global[t];if(setTimeout===e||e===setInterval)return}return e.context&&e.context[t]===globalThis?s.globalProp:e}let i=!1;if(null===e)throw new Error("Cannot get propety of null");if("number"==typeof e&&(e=new Number(e)),"string"==typeof e&&(e=new String(e)),"boolean"==typeof e&&(e=new Boolean(e)),i=e.hasOwnProperty(t)||parseInt(t,10)+""==t+"",!i&&s.options.audit&&(i=!0,"string"==typeof t&&(s.auditReport.prototypeAccess[e.constructor.name]||(s.auditReport.prototypeAccess[e.constructor.name]=new Set),s.auditReport.prototypeAccess[e.constructor.name].add(t))),!i&&s.prototypeWhitelist.has(e.constructor)){let r=s.prototypeWhitelist.get(e.constructor)||[];i=!r.length||r.includes(t);}else i||s.prototypeWhitelist.forEach((r,s)=>{!i&&e instanceof s&&(i=i||e[t]===s.prototype[t],i=i&&(!r||!r.length||r.includes(t)));});if(i){if(e[t]===Function)return s.Function;if(e[t]===globalThis)return s.globalProp;let n=r.isGlobal||e.constructor===Function&&"prototype"===t;return new Prop(e,t,!1,n)}throw Error(`Method or property access prevented: ${e.constructor.name}.${t}`)},call:(e,t,r,s,n)=>{if(s.options.forbidMethodCalls)throw new Error("Method calls are not allowed");if("function"!=typeof e)throw new Error(`${r.prop} is not a function`);return "function"==typeof r?r(...t.map(e=>exec(e,n,s))):r.context[r.prop](...t.map(e=>exec(e,n,s)))},createObject:(e,t)=>{let r={};for(let e of t)r[e.key]=e.val;return r},keyVal:(e,t)=>new KeyVal(e,t),createArray:(e,t,r,s,n)=>t.map(e=>exec(e,n,s)),group:(e,t)=>t,string:(e,t,r,s)=>s.strings[t],literal:(e,t,r,s,n)=>s.literals[t].a.replace(/(\$\$)*(\$)?\${(\d+)}/g,(e,r,i,o)=>{if(i)return e;let p=exec(s.literals[t].b[parseInt(o,10)],n,s);return p=p instanceof Prop?p.context[p.prop]:p,(r||"")+`${p}`.replace(/\$/g,"$$")}).replace(/\$\$/g,"$"),"!":(e,t)=>!t,"~":(e,t)=>~t,"++$":(e,t,r)=>++r.context[r.prop],"$++":(e,t,r)=>r.context[r.prop]++,"--$":(e,t,r)=>--r.context[r.prop],"$--":(e,t,r)=>r.context[r.prop]--,"=":(e,t,r,s,n,i)=>(assignCheck(r),r.context[r.prop]=t,new Prop(r.context,r.prop,!1,r.isGlobal)),"+=":(e,t,r)=>(assignCheck(r),r.context[r.prop]+=t),"-=":(e,t,r)=>(assignCheck(r),r.context[r.prop]-=t),"/=":(e,t,r)=>(assignCheck(r),r.context[r.prop]/=t),"*=":(e,t,r)=>(assignCheck(r),r.context[r.prop]*=t),"**=":(e,t,r)=>(assignCheck(r),r.context[r.prop]**=t),"%=":(e,t,r)=>(assignCheck(r),r.context[r.prop]%=t),"^=":(e,t,r)=>(assignCheck(r),r.context[r.prop]^=t),"&=":(e,t,r)=>(assignCheck(r),r.context[r.prop]&=t),"|=":(e,t,r)=>(assignCheck(r),r.context[r.prop]|=t),"?":(e,t)=>{if(!(t instanceof If))throw new Error("Invalid inline if");return e?t.t:t.f},">":(e,t)=>e>t,"<":(e,t)=>e<t,">=":(e,t)=>e>=t,"<=":(e,t)=>e<=t,"==":(e,t)=>e==t,"===":(e,t)=>e===t,"!=":(e,t)=>e!=t,"!==":(e,t)=>e!==t,"&&":(e,t)=>e&&t,"||":(e,t)=>e||t,"&":(e,t)=>e&t,"|":(e,t)=>e|t,":":(e,t)=>new If(e,t),"+":(e,t)=>e+t,"-":(e,t)=>e-t,"$+":(e,t)=>+t,"$-":(e,t)=>-t,"/":(e,t)=>e/t,"*":(e,t)=>e*t,"%":(e,t)=>e%t,"#to#":(e,t)=>typeof t,"#io#":(e,t)=>e instanceof t,return:(e,t)=>t,var:(e,t,r,s,n,i)=>(n.declare(e,"var",exec(t,n,s)),new Prop(n.var,e,!1,i&&i.isGlobal)),let:(e,t,r,s,n,i)=>(n.declare(e,"let",exec(t,n,s),i&&i.isGlobal),new Prop(n.let,e,!1,i&&i.isGlobal)),const:(e,t,r,s,n,i)=>(n.declare(e,"const",exec(t,n,s)),new Prop(n.const,e,!1,i&&i.isGlobal))},ops=new Map;for(let e in ops2)ops.set(e,ops2[e]);let lispTypes={},setLispType=(e,t)=>{e.forEach(e=>{lispTypes[e]=t;});};function lispify(e,t,r){if(t=t||["initialize","expStart","value","prop","exp","modifier","incrementerBefore","expEnd"],!e.length&&!t.includes("expEnd"))throw new Error("Unexpected end of expression");let s,n={lispTree:r};if(t.forEach(r=>{if("expEnd"!==r)for(let i in expectTypes[r].types){if(s)break;"expEnd"!==i&&((s=expectTypes[r].types[i].exec(e))&&(lispTypes[i](i,e,s,r,n),t=expectTypes[r].next));}}),!s&&e.length)throw Error("Unexpected token: "+e);return n.lispTree}function exec(e,t,r){if(e instanceof Prop)return e.context[e.prop];if(Array.isArray(e))return e.map(e=>exec(e,t,r));if(!(e instanceof Lisp))return e;let s=exec(e.a,t,r),n=s instanceof Prop?s.context?s.context[s.prop]:void 0:s,i=exec(e.b,t,r),o=i instanceof Prop?i.context?i.context[i.prop]:void 0:i;if(ops.has(e.op)){return ops.get(e.op)(n,o,s,r,t,i)}throw new Error("Unknown operator: "+e.op)}setLispType(["createArray","createObject","group","arrayProp","call"],(e,t,r,s,n)=>{let i,o="",p={createArray:"]",createObject:"}",group:")",arrayProp:"]",call:")"},l=[],a=!1,c=1;for(;c<t.length&&!a;)o=restOfExp(t.substring(c),[new RegExp("^\\"+p[e]),/^,/]),c+=o.length,o&&l.push(o),","!==t[c]?a=!0:c++;switch(e){case"group":case"arrayProp":i=lispify(l.pop());break;case"call":case"createArray":i=l.map(e=>lispify(e));break;case"createObject":i=l.map(e=>{let t=restOfExp(e,[/^:/]),r=lispify(t);r instanceof Lisp&&"prop"===r.op&&(r=r.b);let s=lispify(e.substring(t.length+1));return new Lisp({op:"keyVal",a:r,b:s})});}e="arrayProp"===e?"prop":e,n.lispTree=lispify(t.substring(c+1),expectTypes[s].next,new Lisp({op:e,a:n.lispTree,b:i}));}),setLispType(["op"],(e,t,r,s,n)=>{let i=restOfExp(t.substring(r[0].length));n.lispTree=new Lisp({op:r[0],a:n.lispTree,b:lispify(i)}),n.lispTree=lispify(t.substring(i.length+r[0].length),restOfExp.next,n.lispTree);}),setLispType(["inverse","not","negative","positive","typeof"],(e,t,r,s,n)=>{let i=restOfExp(t.substring(r[0].length));n.lispTree=new Lisp({op:["positive","negative"].includes(e)?"$"+r[0]:r[0],a:n.lispTree,b:lispify(i,expectTypes[s].next)}),n.lispTree=lispify(t.substring(i.length+r[0].length),restOfExp.next,n.lispTree);}),setLispType(["incrementerBefore"],(e,t,r,s,n)=>{let i=restOfExp(t.substring(2));n.lispTree=lispify(t.substring(i.length+2),restOfExp.next,new Lisp({op:r[0]+"$",a:lispify(i,expectTypes[s].next)}));}),setLispType(["incrementerAfter"],(e,t,r,s,n)=>{n.lispTree=lispify(t.substring(r[0].length),expectTypes[s].next,new Lisp({op:"$"+r[0],a:n.lispTree}));}),setLispType(["assign","assignModify"],(e,t,r,s,n)=>{n.lispTree=new Lisp({op:r[0],a:n.lispTree,b:lispify(t.substring(r[0].length),expectTypes[s].next)});}),setLispType(["split"],(e,t,r,s,n)=>{let i=restOfExp(t.substring(r[0].length),[expectTypes.splitter.types.split,expectTypes.if.types.if,expectTypes.if.types.else]);n.lispTree=new Lisp({op:r[0],a:n.lispTree,b:lispify(i,expectTypes[s].next)}),n.lispTree=lispify(t.substring(i.length+r[0].length),restOfExp.next,n.lispTree);}),setLispType(["if"],(e,t,r,s,n)=>{let i=!1,o="",p=1;for(;!i&&o.length<t.length;)o+=restOfExp(t.substring(o.length+1),[expectTypes.if.types.if,expectTypes.if.types.else]),"?"===t[o.length+1]?p++:p--,p?o+=t[o.length+1]:i=!0;n.lispTree=new Lisp({op:"?",a:n.lispTree,b:new Lisp({op:":",a:lispify(o),b:lispify(t.substring(r[0].length+o.length+1))})});}),setLispType(["dot","prop"],(e,t,r,s,n)=>{let i=r[0],o=r[0].length;if("."===r[0]){let e=t.substring(r[0].length).match(expectTypes.prop.types.prop);if(!e.length)throw Error("Hanging  dot:"+t);i=e[0],o=i.length+r[0].length;}n.lispTree=lispify(t.substring(o),expectTypes[s].next,new Lisp({op:"prop",a:n.lispTree,b:i}));}),setLispType(["number","boolean","null"],(e,t,r,s,n)=>{n.lispTree=lispify(t.substring(r[0].length),expectTypes[s].next,JSON.parse(r[0]));}),setLispType(["und"],(e,t,r,s,n)=>{n.lispTree=lispify(t.substring(r[0].length),expectTypes[s].next,void 0);}),setLispType(["NaN"],(e,t,r,s,n)=>{n.lispTree=lispify(t.substring(r[0].length),expectTypes[s].next,NaN);}),setLispType(["Infinity"],(e,t,r,s,n)=>{n.lispTree=lispify(t.substring(r[0].length),expectTypes[s].next,1/0);}),setLispType(["string","literal"],(e,t,r,s,n)=>{n.lispTree=lispify(t.substring(r[0].length),expectTypes[s].next,new Lisp({op:e,b:parseInt(JSON.parse(r[1]),10)}));}),setLispType(["return"],(e,t,r,s,n)=>{n.lispTree=new Lisp({op:"return",b:lispify(t.substring(r[0].length),expectTypes[s].next)});}),setLispType(["initialize"],(e,t,r,s,n)=>{const i=r[0].split(/#/g);t.length===r[0].length?n.lispTree=lispify(t.substring(r[0].length),expectTypes[s].next,new Lisp({op:i[1],a:i[2]})):n.lispTree=new Lisp({op:i[1],a:i[2],b:lispify(t.substring(r[0].length+1),expectTypes[s].next)});});let optimizeTypes={},setOptimizeType=(e,t)=>{e.forEach(e=>{optimizeTypes[e]=t;});};function optimize(e,t,r){if(!(e instanceof Lisp)){if(Array.isArray(e)){for(let s=0;s<e.length;s++)e[s]=optimize(e[s],t,r);return e}return e}return e.a=optimize(e.a,t,r),e.b=optimize(e.b,t,r),e.a instanceof Lisp||e.b instanceof Lisp||!optimizeTypes[e.op]?e:optimizeTypes[e.op](e,t,r)}setOptimizeType([">","<",">=","<=","==","===","!=","!==","&&","||","&","|","+","-","/","*","**","%","$+","$-","!","~","group"],e=>ops.get(e.op)(e.a,e.b)),setOptimizeType(["string"],(e,t)=>t[e.b]),setOptimizeType(["literal"],(e,t,r)=>r[e.b].b.length?e:r[e.b].a),setOptimizeType(["createArray"],e=>e.b.find(e=>e instanceof Lisp)?e:ops.get(e.op)(e.a,e.b)),setOptimizeType(["prop"],e=>"number"==typeof e.b&&e.b%1==0?e.a[e.b]:e);class Sandbox{constructor(e={},t=new Map,r={audit:!1}){let s=new Prop({global:new SandboxGlobal(e)},"global",!1,!0);this.context={sandbox:this,globals:e,prototypeWhitelist:t,options:r,globalScope:new Scope(null,e,!0,s),globalProp:s,Function:()=>()=>{},eval:()=>{},auditReport:{prototypeAccess:{},globalsAccess:new Set}},this.context.Function=sandboxFunction(this.context),this.context.eval=sandboxedEval(this.context.Function);}static get SAFE_GLOBALS(){return {Function:Function,eval:eval,console:console,isFinite:isFinite,isNaN:isNaN,parseFloat:parseFloat,parseInt:parseInt,decodeURI:decodeURI,decodeURIComponent:decodeURIComponent,encodeURI:encodeURI,encodeURIComponent:encodeURIComponent,escape:escape,unescape:unescape,Boolean:Boolean,Number:Number,String:String,Object:Object,Array:Array,Symbol:Symbol,Error:Error,EvalError:EvalError,RangeError:RangeError,ReferenceError:ReferenceError,SyntaxError:SyntaxError,TypeError:TypeError,URIError:URIError,Int8Array:Int8Array,Uint8Array:Uint8Array,Uint8ClampedArray:Uint8ClampedArray,Int16Array:Int16Array,Uint16Array:Uint16Array,Int32Array:Int32Array,Uint32Array:Uint32Array,Float32Array:Float32Array,Float64Array:Float64Array,Map:Map,Set:Set,WeakMap:WeakMap,WeakSet:WeakSet,Promise:Promise,Intl:Intl,JSON:JSON,Math:Math}}static get SAFE_PROTOTYPES(){let e=[SandboxGlobal,Function,Boolean,Object,Number,String,Date,RegExp,Error,Array,Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array,Map,Set,WeakMap,WeakSet,Promise],t=new Map;return e.forEach(e=>{t.set(e,[]);}),t}static audit(e,t=[]){let r=new Map;return new Sandbox(globalThis,r,{audit:!0}).executeTree(Sandbox.parse(e),t)}static parse(e,t=[],r=[]){let s,n=e,i="",o=!1,p=[],l=0;for(let e=0;e<n.length;e++){let a=n[e];if(o)if("$"===a&&"`"===s)a="$$";else if("u"===a){let t,r=/^[a-fA-F\d]{2,4}/.exec(n.substring(e+1));t=r?Array.from(r):Array.from(/^{[a-fA-F\d]+}/.exec(n.substring(e+1))||[""]),a=JSON.parse(`"\\u${t[0]}"`),n=n.substring(0,e-1)+a+n.substring(e+(1+t[0].length)),e-=1;}else "`"!=a&&(a=JSON.parse(`"\\${a}"`));else "$"===a&&"`"===s&&"{"!==n[e+1]&&(a="$$");if("`"===s&&"$"===a&&"{"===n[e+1]){let s=restOfExp(n.substring(e+2),[/^}/]);p.push(this.parse(s,t,r).tree[0]),l+=s.length+3,i+=`\${${p.length-1}}`,e+=s.length+2;}else if(s||"'"!==a&&'"'!==a&&"`"!==a||o)if(s!==a||o)s&&(o||"\\"!==a)&&(l+=o?1+a.length:a.length,i+=a);else {let o;"`"===s?(r.push({op:"literal",a:i,b:p}),n=n.substring(0,e-l-1)+`\`${r.length-1}\``+n.substring(e+1),o=(r.length-1).toString().length):(t.push(i),n=n.substring(0,e-i.length-1)+`"${t.length-1}"`+n.substring(e+1),o=(t.length-1).toString().length),s=null,e-=i.length-o,i="";}else p=[],l=0,s=a;o=s&&!o&&"\\"===a;}return {tree:n.replace(/ instanceof /g," #io# ").replace(/(?:(^|\s))(return)(?=[\s;])/g,"#return#").replace(/(?:(^|\s))(var|let|const)(?=[\s])/g,e=>`#${e}#`).replace(/(?:(^|\s))typeof /g,"#to#").replace(/\s/g,"").split(";").filter(e=>e.length).map(e=>lispify(e)).map(e=>optimize(e,t,r)),strings:t,literals:r}}executeTree(e,t=[]){const r=e.tree,s=Object.assign(Object.assign({},this.context),{strings:e.strings,literals:e.literals});let n,i=this.context.globalScope;for(;n=t.shift();)"object"==typeof n&&(i=n instanceof Scope?n:new Scope(i,n));let o=Object.assign({},s);s.options.audit&&(o.auditReport={globalsAccess:new Set,prototypeAccess:{}});let p=!1,l=-1,a=r.map(e=>p?null:(l++,e instanceof Lisp&&"return"===e.op&&(p=!0),exec(e,i,o)))[l];return a=a instanceof Prop?a.context[a.prop]:a,{auditReport:o.auditReport,result:a}}compile(e){const t=Sandbox.parse(e);return (...e)=>this.executeTree(t,e).result}}

  // https://github.com/stimulusjs/stimulus/blob/master/packages/%40stimulus/core/src/application.ts

  function domReady() {
    return new Promise(resolve => {
      if (document.readyState == "loading") {
        document.addEventListener("DOMContentLoaded", resolve);
      } else {
        resolve();
      }
    });
  }
  function arrayUnique(array) {
    var a = array.concat();

    for (var i = 0; i < a.length; ++i) {
      for (var j = i + 1; j < a.length; ++j) {
        if (a[i] === a[j]) a.splice(j--, 1);
      }
    }

    return a;
  }
  function isTesting() {
    return navigator.userAgent.includes("Node.js") || navigator.userAgent.includes("jsdom");
  }
  function kebabCase(subject) {
    return subject.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[_\s]/, '-').toLowerCase();
  }
  function walk(el, callback) {
    if (callback(el) === false) return;
    let node = el.firstElementChild;

    while (node) {
      walk(node, callback);
      node = node.nextElementSibling;
    }
  }
  function debounce(func, wait) {
    var timeout;
    return function () {
      var context = this,
          args = arguments;

      var later = function later() {
        timeout = null;
        func.apply(context, args);
      };

      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  function saferEval(expression, dataContext, additionalHelperVariables = {}) {
    const code = `return ${expression};`;
    const allowedGlobals = Sandbox.SAFE_GLOBALS;
    const allowedPrototypes = Sandbox.SAFE_PROTOTYPES;
    allowedPrototypes.set(CustomEvent, []);
    const sandbox = new Sandbox(allowedGlobals, allowedPrototypes);
    const exec = sandbox.compile(code);
    return exec(dataContext, additionalHelperVariables);
  }
  function saferEvalNoReturn(expression, dataContext, additionalHelperVariables = {}) {
    const code = `${expression}`;
    const allowedGlobals = Sandbox.SAFE_GLOBALS;
    const allowedPrototypes = Sandbox.SAFE_PROTOTYPES;
    allowedPrototypes.set(CustomEvent, []);
    const sandbox = new Sandbox(allowedGlobals, allowedPrototypes); // For the cases when users pass only a function reference to the caller: `x-on:click="foo"`
    // Where "foo" is a function. Also, we'll pass the function the event instance when we call it.

    if (Object.keys(dataContext).includes(expression)) {
      const exec = sandbox.compile('return ' + code);
      const methodReference = exec(dataContext, additionalHelperVariables);

      if (typeof methodReference === 'function') {
        return methodReference.call(dataContext, additionalHelperVariables['$event']);
      }

      return methodReference;
    }

    const exec = sandbox.compile(code);
    return exec(dataContext, additionalHelperVariables);
  }
  const xAttrRE = /^x-(on|bind|data|text|html|model|if|for|show|cloak|transition|ref)\b/;
  function isXAttr(attr) {
    const name = replaceAtAndColonWithStandardSyntax(attr.name);
    return xAttrRE.test(name);
  }
  function getXAttrs(el, type) {
    return Array.from(el.attributes).filter(isXAttr).map(attr => {
      const name = replaceAtAndColonWithStandardSyntax(attr.name);
      const typeMatch = name.match(xAttrRE);
      const valueMatch = name.match(/:([a-zA-Z\-:]+)/);
      const modifiers = name.match(/\.[^.\]]+(?=[^\]]*$)/g) || [];
      return {
        type: typeMatch ? typeMatch[1] : null,
        value: valueMatch ? valueMatch[1] : null,
        modifiers: modifiers.map(i => i.replace('.', '')),
        expression: attr.value
      };
    }).filter(i => {
      // If no type is passed in for filtering, bypass filter
      if (!type) return true;
      return i.type === type;
    });
  }
  function isBooleanAttr(attrName) {
    // As per HTML spec table https://html.spec.whatwg.org/multipage/indices.html#attributes-3:boolean-attribute
    // Array roughly ordered by estimated usage
    const booleanAttributes = ['disabled', 'checked', 'required', 'readonly', 'hidden', 'open', 'selected', 'autofocus', 'itemscope', 'multiple', 'novalidate', 'allowfullscreen', 'allowpaymentrequest', 'formnovalidate', 'autoplay', 'controls', 'loop', 'muted', 'playsinline', 'default', 'ismap', 'reversed', 'async', 'defer', 'nomodule'];
    return booleanAttributes.includes(attrName);
  }
  function replaceAtAndColonWithStandardSyntax(name) {
    if (name.startsWith('@')) {
      return name.replace('@', 'x-on:');
    } else if (name.startsWith(':')) {
      return name.replace(':', 'x-bind:');
    }

    return name;
  }
  function transitionIn(el, show, forceSkip = false) {
    // We don't want to transition on the initial page load.
    if (forceSkip) return show();
    const attrs = getXAttrs(el, 'transition');
    const showAttr = getXAttrs(el, 'show')[0]; // If this is triggered by a x-show.transition.

    if (showAttr && showAttr.modifiers.includes('transition')) {
      let modifiers = showAttr.modifiers; // If x-show.transition.out, we'll skip the "in" transition.

      if (modifiers.includes('out') && !modifiers.includes('in')) return show();
      const settingBothSidesOfTransition = modifiers.includes('in') && modifiers.includes('out'); // If x-show.transition.in...out... only use "in" related modifiers for this transition.

      modifiers = settingBothSidesOfTransition ? modifiers.filter((i, index) => index < modifiers.indexOf('out')) : modifiers;
      transitionHelperIn(el, modifiers, show); // Otherwise, we can assume x-transition:enter.
    } else if (attrs.length > 0) {
      transitionClassesIn(el, attrs, show);
    } else {
      // If neither, just show that damn thing.
      show();
    }
  }
  function transitionOut(el, hide, forceSkip = false) {
    if (forceSkip) return hide();
    const attrs = getXAttrs(el, 'transition');
    const showAttr = getXAttrs(el, 'show')[0];

    if (showAttr && showAttr.modifiers.includes('transition')) {
      let modifiers = showAttr.modifiers;
      if (modifiers.includes('in') && !modifiers.includes('out')) return hide();
      const settingBothSidesOfTransition = modifiers.includes('in') && modifiers.includes('out');
      modifiers = settingBothSidesOfTransition ? modifiers.filter((i, index) => index > modifiers.indexOf('out')) : modifiers;
      transitionHelperOut(el, modifiers, settingBothSidesOfTransition, hide);
    } else if (attrs.length > 0) {
      transitionClassesOut(el, attrs, hide);
    } else {
      hide();
    }
  }
  function transitionHelperIn(el, modifiers, showCallback) {
    // Default values inspired by: https://material.io/design/motion/speed.html#duration
    const styleValues = {
      duration: modifierValue(modifiers, 'duration', 150),
      origin: modifierValue(modifiers, 'origin', 'center'),
      first: {
        opacity: 0,
        scale: modifierValue(modifiers, 'scale', 95)
      },
      second: {
        opacity: 1,
        scale: 100
      }
    };
    transitionHelper(el, modifiers, showCallback, () => {}, styleValues);
  }
  function transitionHelperOut(el, modifiers, settingBothSidesOfTransition, hideCallback) {
    // Make the "out" transition .5x slower than the "in". (Visually better)
    // HOWEVER, if they explicitly set a duration for the "out" transition,
    // use that.
    const duration = settingBothSidesOfTransition ? modifierValue(modifiers, 'duration', 150) : modifierValue(modifiers, 'duration', 150) / 2;
    const styleValues = {
      duration: duration,
      origin: modifierValue(modifiers, 'origin', 'center'),
      first: {
        opacity: 1,
        scale: 100
      },
      second: {
        opacity: 0,
        scale: modifierValue(modifiers, 'scale', 95)
      }
    };
    transitionHelper(el, modifiers, () => {}, hideCallback, styleValues);
  }

  function modifierValue(modifiers, key, fallback) {
    // If the modifier isn't present, use the default.
    if (modifiers.indexOf(key) === -1) return fallback; // If it IS present, grab the value after it: x-show.transition.duration.500ms

    const rawValue = modifiers[modifiers.indexOf(key) + 1];
    if (!rawValue) return fallback;

    if (key === 'scale') {
      // Check if the very next value is NOT a number and return the fallback.
      // If x-show.transition.scale, we'll use the default scale value.
      // That is how a user opts out of the opacity transition.
      if (!isNumeric(rawValue)) return fallback;
    }

    if (key === 'duration') {
      // Support x-show.transition.duration.500ms && duration.500
      let match = rawValue.match(/([0-9]+)ms/);
      if (match) return match[1];
    }

    if (key === 'origin') {
      // Support chaining origin directions: x-show.transition.top.right
      if (['top', 'right', 'left', 'center', 'bottom'].includes(modifiers[modifiers.indexOf(key) + 2])) {
        return [rawValue, modifiers[modifiers.indexOf(key) + 2]].join(' ');
      }
    }

    return rawValue;
  }

  function transitionHelper(el, modifiers, hook1, hook2, styleValues) {
    // If the user set these style values, we'll put them back when we're done with them.
    const opacityCache = el.style.opacity;
    const transformCache = el.style.transform;
    const transformOriginCache = el.style.transformOrigin; // If no modifiers are present: x-show.transition, we'll default to both opacity and scale.

    const noModifiers = !modifiers.includes('opacity') && !modifiers.includes('scale');
    const transitionOpacity = noModifiers || modifiers.includes('opacity');
    const transitionScale = noModifiers || modifiers.includes('scale'); // These are the explicit stages of a transition (same stages for in and for out).
    // This way you can get a birds eye view of the hooks, and the differences
    // between them.

    const stages = {
      start() {
        if (transitionOpacity) el.style.opacity = styleValues.first.opacity;
        if (transitionScale) el.style.transform = `scale(${styleValues.first.scale / 100})`;
      },

      during() {
        if (transitionScale) el.style.transformOrigin = styleValues.origin;
        el.style.transitionProperty = [transitionOpacity ? `opacity` : ``, transitionScale ? `transform` : ``].join(' ').trim();
        el.style.transitionDuration = `${styleValues.duration / 1000}s`;
        el.style.transitionTimingFunction = `cubic-bezier(0.4, 0.0, 0.2, 1)`;
      },

      show() {
        hook1();
      },

      end() {
        if (transitionOpacity) el.style.opacity = styleValues.second.opacity;
        if (transitionScale) el.style.transform = `scale(${styleValues.second.scale / 100})`;
      },

      hide() {
        hook2();
      },

      cleanup() {
        if (transitionOpacity) el.style.opacity = opacityCache;
        if (transitionScale) el.style.transform = transformCache;
        if (transitionScale) el.style.transformOrigin = transformOriginCache;
        el.style.transitionProperty = null;
        el.style.transitionDuration = null;
        el.style.transitionTimingFunction = null;
      }

    };
    transition(el, stages);
  }
  function transitionClassesIn(el, directives, showCallback) {
    const enter = (directives.find(i => i.value === 'enter') || {
      expression: ''
    }).expression.split(' ').filter(i => i !== '');
    const enterStart = (directives.find(i => i.value === 'enter-start') || {
      expression: ''
    }).expression.split(' ').filter(i => i !== '');
    const enterEnd = (directives.find(i => i.value === 'enter-end') || {
      expression: ''
    }).expression.split(' ').filter(i => i !== '');
    transitionClasses(el, enter, enterStart, enterEnd, showCallback, () => {});
  }
  function transitionClassesOut(el, directives, hideCallback) {
    const leave = (directives.find(i => i.value === 'leave') || {
      expression: ''
    }).expression.split(' ').filter(i => i !== '');
    const leaveStart = (directives.find(i => i.value === 'leave-start') || {
      expression: ''
    }).expression.split(' ').filter(i => i !== '');
    const leaveEnd = (directives.find(i => i.value === 'leave-end') || {
      expression: ''
    }).expression.split(' ').filter(i => i !== '');
    transitionClasses(el, leave, leaveStart, leaveEnd, () => {}, hideCallback);
  }
  function transitionClasses(el, classesDuring, classesStart, classesEnd, hook1, hook2) {
    const originalClasses = el.__x_original_classes || [];
    const stages = {
      start() {
        el.classList.add(...classesStart);
      },

      during() {
        el.classList.add(...classesDuring);
      },

      show() {
        hook1();
      },

      end() {
        // Don't remove classes that were in the original class attribute.
        el.classList.remove(...classesStart.filter(i => !originalClasses.includes(i)));
        el.classList.add(...classesEnd);
      },

      hide() {
        hook2();
      },

      cleanup() {
        el.classList.remove(...classesDuring.filter(i => !originalClasses.includes(i)));
        el.classList.remove(...classesEnd.filter(i => !originalClasses.includes(i)));
      }

    };
    transition(el, stages);
  }
  function transition(el, stages) {
    stages.start();
    stages.during();
    requestAnimationFrame(() => {
      // Note: Safari's transitionDuration property will list out comma separated transition durations
      // for every single transition property. Let's grab the first one and call it a day.
      let duration = Number(getComputedStyle(el).transitionDuration.replace(/,.*/, '').replace('s', '')) * 1000;
      stages.show();
      requestAnimationFrame(() => {
        stages.end();
        setTimeout(() => {
          stages.hide(); // Adding an "isConnected" check, in case the callback
          // removed the element from the DOM.

          if (el.isConnected) {
            stages.cleanup();
          }
        }, duration);
      });
    });
  }
  function isNumeric(subject) {
    return !isNaN(subject);
  }

  function handleForDirective(component, templateEl, expression, initialUpdate, extraVars) {
    warnIfNotTemplateTag(templateEl);
    let iteratorNames = parseForExpression(expression);
    let items = evaluateItemsAndReturnEmptyIfXIfIsPresentAndFalseOnElement(component, templateEl, iteratorNames, extraVars); // As we walk the array, we'll also walk the DOM (updating/creating as we go).

    let currentEl = templateEl;
    items.forEach((item, index) => {
      let iterationScopeVariables = getIterationScopeVariables(iteratorNames, item, index, items);
      let currentKey = generateKeyForIteration(component, templateEl, index, iterationScopeVariables);
      let nextEl = currentEl.nextElementSibling; // If there's no previously x-for processed element ahead, add one.

      if (!nextEl || nextEl.__x_for_key === undefined) {
        nextEl = addElementInLoopAfterCurrentEl(templateEl, currentEl); // And transition it in if it's not the first page load.

        transitionIn(nextEl, () => {}, initialUpdate);
        nextEl.__x_for = iterationScopeVariables;
        component.initializeElements(nextEl, () => nextEl.__x_for);
      } else {
        nextEl = lookAheadForMatchingKeyedElementAndMoveItIfFound(nextEl, currentKey); // Temporarily remove the key indicator to allow the normal "updateElements" to work

        delete nextEl.__x_for_key;
        nextEl.__x_for = iterationScopeVariables;
        component.updateElements(nextEl, () => nextEl.__x_for);
      }

      currentEl = nextEl;
      currentEl.__x_for_key = currentKey;
    });
    removeAnyLeftOverElementsFromPreviousUpdate(currentEl);
  } // This was taken from VueJS 2.* core. Thanks Vue!

  function parseForExpression(expression) {
    let forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
    let stripParensRE = /^\(|\)$/g;
    let forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/;
    let inMatch = expression.match(forAliasRE);
    if (!inMatch) return;
    let res = {};
    res.items = inMatch[2].trim();
    let item = inMatch[1].trim().replace(stripParensRE, '');
    let iteratorMatch = item.match(forIteratorRE);

    if (iteratorMatch) {
      res.item = item.replace(forIteratorRE, '').trim();
      res.index = iteratorMatch[1].trim();

      if (iteratorMatch[2]) {
        res.collection = iteratorMatch[2].trim();
      }
    } else {
      res.item = item;
    }

    return res;
  }

  function getIterationScopeVariables(iteratorNames, item, index, items) {
    let scopeVariables = {
      [iteratorNames.item]: item
    };
    if (iteratorNames.index) scopeVariables[iteratorNames.index] = index;
    if (iteratorNames.collection) scopeVariables[iteratorNames.collection] = items;
    return scopeVariables;
  }

  function generateKeyForIteration(component, el, index, iterationScopeVariables) {
    let bindKeyAttribute = getXAttrs(el, 'bind').filter(attr => attr.value === 'key')[0]; // If the dev hasn't specified a key, just return the index of the iteration.

    if (!bindKeyAttribute) return index;
    return component.evaluateReturnExpression(el, bindKeyAttribute.expression, () => iterationScopeVariables);
  }

  function warnIfNotTemplateTag(el) {
    if (el.tagName.toLowerCase() !== 'template') console.warn('Alpine: [x-for] directive should only be added to <template> tags.');
  }

  function evaluateItemsAndReturnEmptyIfXIfIsPresentAndFalseOnElement(component, el, iteratorNames, extraVars) {
    let ifAttribute = getXAttrs(el, 'if')[0];

    if (ifAttribute && !component.evaluateReturnExpression(el, ifAttribute.expression)) {
      return [];
    }

    return component.evaluateReturnExpression(el, iteratorNames.items, extraVars);
  }

  function addElementInLoopAfterCurrentEl(templateEl, currentEl) {
    let clone = document.importNode(templateEl.content, true);
    if (clone.childElementCount !== 1) console.warn('Alpine: <template> tag with [x-for] encountered with multiple element roots. Make sure <template> only has a single child node.');
    currentEl.parentElement.insertBefore(clone, currentEl.nextElementSibling);
    return currentEl.nextElementSibling;
  }

  function lookAheadForMatchingKeyedElementAndMoveItIfFound(nextEl, currentKey) {
    // If the the key's DO match, no need to look ahead.
    if (nextEl.__x_for_key === currentKey) return nextEl; // If the don't, we'll look ahead for a match.
    // If we find it, we'll move it to the current position in the loop.

    let tmpNextEl = nextEl;

    while (tmpNextEl) {
      if (tmpNextEl.__x_for_key === currentKey) {
        return tmpNextEl.parentElement.insertBefore(tmpNextEl, nextEl);
      }

      tmpNextEl = tmpNextEl.nextElementSibling && tmpNextEl.nextElementSibling.__x_for_key !== undefined ? tmpNextEl.nextElementSibling : false;
    }
  }

  function removeAnyLeftOverElementsFromPreviousUpdate(currentEl) {
    var nextElementFromOldLoop = currentEl.nextElementSibling && currentEl.nextElementSibling.__x_for_key !== undefined ? currentEl.nextElementSibling : false;

    while (nextElementFromOldLoop) {
      let nextElementFromOldLoopImmutable = nextElementFromOldLoop;
      let nextSibling = nextElementFromOldLoop.nextElementSibling;
      transitionOut(nextElementFromOldLoop, () => {
        nextElementFromOldLoopImmutable.remove();
      });
      nextElementFromOldLoop = nextSibling && nextSibling.__x_for_key !== undefined ? nextSibling : false;
    }
  }

  function handleAttributeBindingDirective(component, el, attrName, expression, extraVars) {
    var value = component.evaluateReturnExpression(el, expression, extraVars);

    if (attrName === 'value') {
      // If nested model key is undefined, set the default value to empty string.
      if (value === undefined && expression.match(/\./).length) {
        value = '';
      }

      if (el.type === 'radio') {
        el.checked = el.value == value;
      } else if (el.type === 'checkbox') {
        if (Array.isArray(value)) {
          // I'm purposely not using Array.includes here because it's
          // strict, and because of Numeric/String mis-casting, I
          // want the "includes" to be "fuzzy".
          let valueFound = false;
          value.forEach(val => {
            if (val == el.value) {
              valueFound = true;
            }
          });
          el.checked = valueFound;
        } else {
          el.checked = !!value;
        } // If we are explicitly binding a string to the :value, set the string,
        // If the value is a boolean, leave it alone, it will be set to "on"
        // automatically.


        if (typeof value === 'string') {
          el.value = value;
        }
      } else if (el.tagName === 'SELECT') {
        updateSelect(el, value);
      } else {
        el.value = value;
      }
    } else if (attrName === 'class') {
      if (Array.isArray(value)) {
        const originalClasses = el.__x_original_classes || [];
        el.setAttribute('class', arrayUnique(originalClasses.concat(value)).join(' '));
      } else if (typeof value === 'object') {
        Object.keys(value).forEach(classNames => {
          if (value[classNames]) {
            classNames.split(' ').forEach(className => el.classList.add(className));
          } else {
            classNames.split(' ').forEach(className => el.classList.remove(className));
          }
        });
      } else {
        const originalClasses = el.__x_original_classes || [];
        const newClasses = value.split(' ');
        el.setAttribute('class', arrayUnique(originalClasses.concat(newClasses)).join(' '));
      }
    } else if (isBooleanAttr(attrName)) {
      // Boolean attributes have to be explicitly added and removed, not just set.
      if (!!value) {
        el.setAttribute(attrName, '');
      } else {
        el.removeAttribute(attrName);
      }
    } else {
      el.setAttribute(attrName, value);
    }
  }

  function updateSelect(el, value) {
    const arrayWrappedValue = [].concat(value).map(value => {
      return value + '';
    });
    Array.from(el.options).forEach(option => {
      option.selected = arrayWrappedValue.includes(option.value || option.text);
    });
  }

  function handleShowDirective(component, el, value, modifiers, initialUpdate = false) {
    const hide = () => {
      el.style.display = 'none';
    };

    const show = () => {
      if (el.style.length === 1 && el.style.display === 'none') {
        el.removeAttribute('style');
      } else {
        el.style.removeProperty('display');
      }
    };

    if (initialUpdate === true) {
      if (value) {
        show();
      } else {
        hide();
      }

      return;
    }

    const handle = resolve => {
      if (!value) {
        if (el.style.display !== 'none') {
          transitionOut(el, () => {
            resolve(() => {
              hide();
            });
          });
        } else {
          resolve(() => {});
        }
      } else {
        if (el.style.display !== '') {
          transitionIn(el, () => {
            show();
          });
        } // Resolve immediately, only hold up parent `x-show`s for hidin.


        resolve(() => {});
      }
    }; // The working of x-show is a bit complex because we need to
    // wait for any child transitions to finish before hiding
    // some element. Also, this has to be done recursively.
    // If x-show.immediate, foregoe the waiting.


    if (modifiers.includes('immediate')) {
      handle(finish => finish());
      return;
    } // x-show is encountered during a DOM tree walk. If an element
    // we encounter is NOT a child of another x-show element we
    // can execute the previous x-show stack (if one exists).


    if (component.showDirectiveLastElement && !component.showDirectiveLastElement.contains(el)) {
      component.executeAndClearRemainingShowDirectiveStack();
    } // We'll push the handler onto a stack to be handled later.


    component.showDirectiveStack.push(handle);
    component.showDirectiveLastElement = el;
  }

  function handleIfDirective(component, el, expressionResult, initialUpdate, extraVars) {
    if (el.nodeName.toLowerCase() !== 'template') console.warn(`Alpine: [x-if] directive should only be added to <template> tags. See https://github.com/alpinejs/alpine#x-if`);
    const elementHasAlreadyBeenAdded = el.nextElementSibling && el.nextElementSibling.__x_inserted_me === true;

    if (expressionResult && !elementHasAlreadyBeenAdded) {
      const clone = document.importNode(el.content, true);
      el.parentElement.insertBefore(clone, el.nextElementSibling);
      transitionIn(el.nextElementSibling, () => {}, initialUpdate);
      component.initializeElements(el.nextElementSibling, extraVars);
      el.nextElementSibling.__x_inserted_me = true;
    } else if (!expressionResult && elementHasAlreadyBeenAdded) {
      transitionOut(el.nextElementSibling, () => {
        el.nextElementSibling.remove();
      }, initialUpdate);
    }
  }

  function registerListener(component, el, event, modifiers, expression, extraVars = {}) {
    if (modifiers.includes('away')) {
      let handler = e => {
        // Don't do anything if the click came form the element or within it.
        if (el.contains(e.target)) return; // Don't do anything if this element isn't currently visible.

        if (el.offsetWidth < 1 && el.offsetHeight < 1) return; // Now that we are sure the element is visible, AND the click
        // is from outside it, let's run the expression.

        runListenerHandler(component, expression, e, extraVars);

        if (modifiers.includes('once')) {
          document.removeEventListener(event, handler);
        }
      }; // Listen for this event at the root level.


      document.addEventListener(event, handler);
    } else {
      let listenerTarget = modifiers.includes('window') ? window : modifiers.includes('document') ? document : el;

      let handler = e => {
        // Remove this global event handler if the element that declared it
        // has been removed. It's now stale.
        if (listenerTarget === window || listenerTarget === document) {
          if (!document.body.contains(el)) {
            listenerTarget.removeEventListener(event, handler);
            return;
          }
        }

        if (isKeyEvent(event)) {
          if (isListeningForASpecificKeyThatHasntBeenPressed(e, modifiers)) {
            return;
          }
        }

        if (modifiers.includes('prevent')) e.preventDefault();
        if (modifiers.includes('stop')) e.stopPropagation();
        const returnValue = runListenerHandler(component, expression, e, extraVars);

        if (returnValue === false) {
          e.preventDefault();
        } else {
          if (modifiers.includes('once')) {
            listenerTarget.removeEventListener(event, handler);
          }
        }
      };

      if (modifiers.includes('debounce')) {
        let nextModifier = modifiers[modifiers.indexOf('debounce') + 1] || 'invalid-wait';
        let wait = isNumeric(nextModifier.split('ms')[0]) ? Number(nextModifier.split('ms')[0]) : 250;
        handler = debounce(handler, wait);
      }

      listenerTarget.addEventListener(event, handler);
    }
  }

  function runListenerHandler(component, expression, e, extraVars) {
    return component.evaluateCommandExpression(e.target, expression, () => {
      return _objectSpread2({}, extraVars(), {
        '$event': e
      });
    });
  }

  function isKeyEvent(event) {
    return ['keydown', 'keyup'].includes(event);
  }

  function isListeningForASpecificKeyThatHasntBeenPressed(e, modifiers) {
    let keyModifiers = modifiers.filter(i => {
      return !['window', 'document', 'prevent', 'stop'].includes(i);
    });

    if (keyModifiers.includes('debounce')) {
      let debounceIndex = keyModifiers.indexOf('debounce');
      keyModifiers.splice(debounceIndex, isNumeric((keyModifiers[debounceIndex + 1] || 'invalid-wait').split('ms')[0]) ? 2 : 1);
    } // If no modifier is specified, we'll call it a press.


    if (keyModifiers.length === 0) return false; // If one is passed, AND it matches the key pressed, we'll call it a press.

    if (keyModifiers.length === 1 && keyModifiers[0] === keyToModifier(e.key)) return false; // The user is listening for key combinations.

    const systemKeyModifiers = ['ctrl', 'shift', 'alt', 'meta', 'cmd', 'super'];
    const selectedSystemKeyModifiers = systemKeyModifiers.filter(modifier => keyModifiers.includes(modifier));
    keyModifiers = keyModifiers.filter(i => !selectedSystemKeyModifiers.includes(i));

    if (selectedSystemKeyModifiers.length > 0) {
      const activelyPressedKeyModifiers = selectedSystemKeyModifiers.filter(modifier => {
        // Alias "cmd" and "super" to "meta"
        if (modifier === 'cmd' || modifier === 'super') modifier = 'meta';
        return e[`${modifier}Key`];
      }); // If all the modifiers selected are pressed, ...

      if (activelyPressedKeyModifiers.length === selectedSystemKeyModifiers.length) {
        // AND the remaining key is pressed as well. It's a press.
        if (keyModifiers[0] === keyToModifier(e.key)) return false;
      }
    } // We'll call it NOT a valid keypress.


    return true;
  }

  function keyToModifier(key) {
    switch (key) {
      case '/':
        return 'slash';

      case ' ':
      case 'Spacebar':
        return 'space';

      default:
        return kebabCase(key);
    }
  }

  function registerModelListener(component, el, modifiers, expression, extraVars) {
    // If the element we are binding to is a select, a radio, or checkbox
    // we'll listen for the change event instead of the "input" event.
    var event = el.tagName.toLowerCase() === 'select' || ['checkbox', 'radio'].includes(el.type) || modifiers.includes('lazy') ? 'change' : 'input';
    const listenerExpression = `${expression} = rightSideOfExpression($event, ${expression})`;
    registerListener(component, el, event, modifiers, listenerExpression, () => {
      return _objectSpread2({}, extraVars(), {
        rightSideOfExpression: generateModelAssignmentFunction(el, modifiers, expression)
      });
    });
  }

  function generateModelAssignmentFunction(el, modifiers, expression) {
    if (el.type === 'radio') {
      // Radio buttons only work properly when they share a name attribute.
      // People might assume we take care of that for them, because
      // they already set a shared "x-model" attribute.
      if (!el.hasAttribute('name')) el.setAttribute('name', expression);
    }

    return (event, currentValue) => {
      // Check for event.detail due to an issue where IE11 handles other events as a CustomEvent.
      if (event instanceof CustomEvent && event.detail) {
        return event.detail;
      } else if (el.type === 'checkbox') {
        // If the data we are binding to is an array, toggle it's value inside the array.
        if (Array.isArray(currentValue)) {
          return event.target.checked ? currentValue.concat([event.target.value]) : currentValue.filter(i => i !== event.target.value);
        } else {
          return event.target.checked;
        }
      } else if (el.tagName.toLowerCase() === 'select' && el.multiple) {
        return modifiers.includes('number') ? Array.from(event.target.selectedOptions).map(option => {
          const rawValue = option.value || option.text;
          const number = rawValue ? parseFloat(rawValue) : null;
          return isNaN(number) ? rawValue : number;
        }) : Array.from(event.target.selectedOptions).map(option => {
          return option.value || option.text;
        });
      } else {
        const rawValue = event.target.value;
        const number = rawValue ? parseFloat(rawValue) : null;
        return modifiers.includes('number') ? isNaN(number) ? rawValue : number : modifiers.includes('trim') ? rawValue.trim() : rawValue;
      }
    };
  }

  /**
   * Copyright (C) 2017 salesforce.com, inc.
   */
  const { isArray } = Array;
  const { getPrototypeOf, create: ObjectCreate, defineProperty: ObjectDefineProperty, defineProperties: ObjectDefineProperties, isExtensible, getOwnPropertyDescriptor, getOwnPropertyNames, getOwnPropertySymbols, preventExtensions, hasOwnProperty, } = Object;
  const { push: ArrayPush, concat: ArrayConcat, map: ArrayMap, } = Array.prototype;
  function isUndefined(obj) {
      return obj === undefined;
  }
  function isFunction(obj) {
      return typeof obj === 'function';
  }
  function isObject(obj) {
      return typeof obj === 'object';
  }
  const proxyToValueMap = new WeakMap();
  function registerProxy(proxy, value) {
      proxyToValueMap.set(proxy, value);
  }
  const unwrap = (replicaOrAny) => proxyToValueMap.get(replicaOrAny) || replicaOrAny;

  function wrapValue(membrane, value) {
      return membrane.valueIsObservable(value) ? membrane.getProxy(value) : value;
  }
  /**
   * Unwrap property descriptors will set value on original descriptor
   * We only need to unwrap if value is specified
   * @param descriptor external descrpitor provided to define new property on original value
   */
  function unwrapDescriptor(descriptor) {
      if (hasOwnProperty.call(descriptor, 'value')) {
          descriptor.value = unwrap(descriptor.value);
      }
      return descriptor;
  }
  function lockShadowTarget(membrane, shadowTarget, originalTarget) {
      const targetKeys = ArrayConcat.call(getOwnPropertyNames(originalTarget), getOwnPropertySymbols(originalTarget));
      targetKeys.forEach((key) => {
          let descriptor = getOwnPropertyDescriptor(originalTarget, key);
          // We do not need to wrap the descriptor if configurable
          // Because we can deal with wrapping it when user goes through
          // Get own property descriptor. There is also a chance that this descriptor
          // could change sometime in the future, so we can defer wrapping
          // until we need to
          if (!descriptor.configurable) {
              descriptor = wrapDescriptor(membrane, descriptor, wrapValue);
          }
          ObjectDefineProperty(shadowTarget, key, descriptor);
      });
      preventExtensions(shadowTarget);
  }
  class ReactiveProxyHandler {
      constructor(membrane, value) {
          this.originalTarget = value;
          this.membrane = membrane;
      }
      get(shadowTarget, key) {
          const { originalTarget, membrane } = this;
          const value = originalTarget[key];
          const { valueObserved } = membrane;
          valueObserved(originalTarget, key);
          return membrane.getProxy(value);
      }
      set(shadowTarget, key, value) {
          const { originalTarget, membrane: { valueMutated } } = this;
          const oldValue = originalTarget[key];
          if (oldValue !== value) {
              originalTarget[key] = value;
              valueMutated(originalTarget, key);
          }
          else if (key === 'length' && isArray(originalTarget)) {
              // fix for issue #236: push will add the new index, and by the time length
              // is updated, the internal length is already equal to the new length value
              // therefore, the oldValue is equal to the value. This is the forking logic
              // to support this use case.
              valueMutated(originalTarget, key);
          }
          return true;
      }
      deleteProperty(shadowTarget, key) {
          const { originalTarget, membrane: { valueMutated } } = this;
          delete originalTarget[key];
          valueMutated(originalTarget, key);
          return true;
      }
      apply(shadowTarget, thisArg, argArray) {
          /* No op */
      }
      construct(target, argArray, newTarget) {
          /* No op */
      }
      has(shadowTarget, key) {
          const { originalTarget, membrane: { valueObserved } } = this;
          valueObserved(originalTarget, key);
          return key in originalTarget;
      }
      ownKeys(shadowTarget) {
          const { originalTarget } = this;
          return ArrayConcat.call(getOwnPropertyNames(originalTarget), getOwnPropertySymbols(originalTarget));
      }
      isExtensible(shadowTarget) {
          const shadowIsExtensible = isExtensible(shadowTarget);
          if (!shadowIsExtensible) {
              return shadowIsExtensible;
          }
          const { originalTarget, membrane } = this;
          const targetIsExtensible = isExtensible(originalTarget);
          if (!targetIsExtensible) {
              lockShadowTarget(membrane, shadowTarget, originalTarget);
          }
          return targetIsExtensible;
      }
      setPrototypeOf(shadowTarget, prototype) {
      }
      getPrototypeOf(shadowTarget) {
          const { originalTarget } = this;
          return getPrototypeOf(originalTarget);
      }
      getOwnPropertyDescriptor(shadowTarget, key) {
          const { originalTarget, membrane } = this;
          const { valueObserved } = this.membrane;
          // keys looked up via hasOwnProperty need to be reactive
          valueObserved(originalTarget, key);
          let desc = getOwnPropertyDescriptor(originalTarget, key);
          if (isUndefined(desc)) {
              return desc;
          }
          const shadowDescriptor = getOwnPropertyDescriptor(shadowTarget, key);
          if (!isUndefined(shadowDescriptor)) {
              return shadowDescriptor;
          }
          // Note: by accessing the descriptor, the key is marked as observed
          // but access to the value, setter or getter (if available) cannot observe
          // mutations, just like regular methods, in which case we just do nothing.
          desc = wrapDescriptor(membrane, desc, wrapValue);
          if (!desc.configurable) {
              // If descriptor from original target is not configurable,
              // We must copy the wrapped descriptor over to the shadow target.
              // Otherwise, proxy will throw an invariant error.
              // This is our last chance to lock the value.
              // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor#Invariants
              ObjectDefineProperty(shadowTarget, key, desc);
          }
          return desc;
      }
      preventExtensions(shadowTarget) {
          const { originalTarget, membrane } = this;
          lockShadowTarget(membrane, shadowTarget, originalTarget);
          preventExtensions(originalTarget);
          return true;
      }
      defineProperty(shadowTarget, key, descriptor) {
          const { originalTarget, membrane } = this;
          const { valueMutated } = membrane;
          const { configurable } = descriptor;
          // We have to check for value in descriptor
          // because Object.freeze(proxy) calls this method
          // with only { configurable: false, writeable: false }
          // Additionally, method will only be called with writeable:false
          // if the descriptor has a value, as opposed to getter/setter
          // So we can just check if writable is present and then see if
          // value is present. This eliminates getter and setter descriptors
          if (hasOwnProperty.call(descriptor, 'writable') && !hasOwnProperty.call(descriptor, 'value')) {
              const originalDescriptor = getOwnPropertyDescriptor(originalTarget, key);
              descriptor.value = originalDescriptor.value;
          }
          ObjectDefineProperty(originalTarget, key, unwrapDescriptor(descriptor));
          if (configurable === false) {
              ObjectDefineProperty(shadowTarget, key, wrapDescriptor(membrane, descriptor, wrapValue));
          }
          valueMutated(originalTarget, key);
          return true;
      }
  }

  function wrapReadOnlyValue(membrane, value) {
      return membrane.valueIsObservable(value) ? membrane.getReadOnlyProxy(value) : value;
  }
  class ReadOnlyHandler {
      constructor(membrane, value) {
          this.originalTarget = value;
          this.membrane = membrane;
      }
      get(shadowTarget, key) {
          const { membrane, originalTarget } = this;
          const value = originalTarget[key];
          const { valueObserved } = membrane;
          valueObserved(originalTarget, key);
          return membrane.getReadOnlyProxy(value);
      }
      set(shadowTarget, key, value) {
          return false;
      }
      deleteProperty(shadowTarget, key) {
          return false;
      }
      apply(shadowTarget, thisArg, argArray) {
          /* No op */
      }
      construct(target, argArray, newTarget) {
          /* No op */
      }
      has(shadowTarget, key) {
          const { originalTarget, membrane: { valueObserved } } = this;
          valueObserved(originalTarget, key);
          return key in originalTarget;
      }
      ownKeys(shadowTarget) {
          const { originalTarget } = this;
          return ArrayConcat.call(getOwnPropertyNames(originalTarget), getOwnPropertySymbols(originalTarget));
      }
      setPrototypeOf(shadowTarget, prototype) {
      }
      getOwnPropertyDescriptor(shadowTarget, key) {
          const { originalTarget, membrane } = this;
          const { valueObserved } = membrane;
          // keys looked up via hasOwnProperty need to be reactive
          valueObserved(originalTarget, key);
          let desc = getOwnPropertyDescriptor(originalTarget, key);
          if (isUndefined(desc)) {
              return desc;
          }
          const shadowDescriptor = getOwnPropertyDescriptor(shadowTarget, key);
          if (!isUndefined(shadowDescriptor)) {
              return shadowDescriptor;
          }
          // Note: by accessing the descriptor, the key is marked as observed
          // but access to the value or getter (if available) cannot be observed,
          // just like regular methods, in which case we just do nothing.
          desc = wrapDescriptor(membrane, desc, wrapReadOnlyValue);
          if (hasOwnProperty.call(desc, 'set')) {
              desc.set = undefined; // readOnly membrane does not allow setters
          }
          if (!desc.configurable) {
              // If descriptor from original target is not configurable,
              // We must copy the wrapped descriptor over to the shadow target.
              // Otherwise, proxy will throw an invariant error.
              // This is our last chance to lock the value.
              // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor#Invariants
              ObjectDefineProperty(shadowTarget, key, desc);
          }
          return desc;
      }
      preventExtensions(shadowTarget) {
          return false;
      }
      defineProperty(shadowTarget, key, descriptor) {
          return false;
      }
  }
  function createShadowTarget(value) {
      let shadowTarget = undefined;
      if (isArray(value)) {
          shadowTarget = [];
      }
      else if (isObject(value)) {
          shadowTarget = {};
      }
      return shadowTarget;
  }
  const ObjectDotPrototype = Object.prototype;
  function defaultValueIsObservable(value) {
      // intentionally checking for null
      if (value === null) {
          return false;
      }
      // treat all non-object types, including undefined, as non-observable values
      if (typeof value !== 'object') {
          return false;
      }
      if (isArray(value)) {
          return true;
      }
      const proto = getPrototypeOf(value);
      return (proto === ObjectDotPrototype || proto === null || getPrototypeOf(proto) === null);
  }
  const defaultValueObserved = (obj, key) => {
      /* do nothing */
  };
  const defaultValueMutated = (obj, key) => {
      /* do nothing */
  };
  const defaultValueDistortion = (value) => value;
  function wrapDescriptor(membrane, descriptor, getValue) {
      const { set, get } = descriptor;
      if (hasOwnProperty.call(descriptor, 'value')) {
          descriptor.value = getValue(membrane, descriptor.value);
      }
      else {
          if (!isUndefined(get)) {
              descriptor.get = function () {
                  // invoking the original getter with the original target
                  return getValue(membrane, get.call(unwrap(this)));
              };
          }
          if (!isUndefined(set)) {
              descriptor.set = function (value) {
                  // At this point we don't have a clear indication of whether
                  // or not a valid mutation will occur, we don't have the key,
                  // and we are not sure why and how they are invoking this setter.
                  // Nevertheless we preserve the original semantics by invoking the
                  // original setter with the original target and the unwrapped value
                  set.call(unwrap(this), membrane.unwrapProxy(value));
              };
          }
      }
      return descriptor;
  }
  class ReactiveMembrane {
      constructor(options) {
          this.valueDistortion = defaultValueDistortion;
          this.valueMutated = defaultValueMutated;
          this.valueObserved = defaultValueObserved;
          this.valueIsObservable = defaultValueIsObservable;
          this.objectGraph = new WeakMap();
          if (!isUndefined(options)) {
              const { valueDistortion, valueMutated, valueObserved, valueIsObservable } = options;
              this.valueDistortion = isFunction(valueDistortion) ? valueDistortion : defaultValueDistortion;
              this.valueMutated = isFunction(valueMutated) ? valueMutated : defaultValueMutated;
              this.valueObserved = isFunction(valueObserved) ? valueObserved : defaultValueObserved;
              this.valueIsObservable = isFunction(valueIsObservable) ? valueIsObservable : defaultValueIsObservable;
          }
      }
      getProxy(value) {
          const unwrappedValue = unwrap(value);
          const distorted = this.valueDistortion(unwrappedValue);
          if (this.valueIsObservable(distorted)) {
              const o = this.getReactiveState(unwrappedValue, distorted);
              // when trying to extract the writable version of a readonly
              // we return the readonly.
              return o.readOnly === value ? value : o.reactive;
          }
          return distorted;
      }
      getReadOnlyProxy(value) {
          value = unwrap(value);
          const distorted = this.valueDistortion(value);
          if (this.valueIsObservable(distorted)) {
              return this.getReactiveState(value, distorted).readOnly;
          }
          return distorted;
      }
      unwrapProxy(p) {
          return unwrap(p);
      }
      getReactiveState(value, distortedValue) {
          const { objectGraph, } = this;
          let reactiveState = objectGraph.get(distortedValue);
          if (reactiveState) {
              return reactiveState;
          }
          const membrane = this;
          reactiveState = {
              get reactive() {
                  const reactiveHandler = new ReactiveProxyHandler(membrane, distortedValue);
                  // caching the reactive proxy after the first time it is accessed
                  const proxy = new Proxy(createShadowTarget(distortedValue), reactiveHandler);
                  registerProxy(proxy, value);
                  ObjectDefineProperty(this, 'reactive', { value: proxy });
                  return proxy;
              },
              get readOnly() {
                  const readOnlyHandler = new ReadOnlyHandler(membrane, distortedValue);
                  // caching the readOnly proxy after the first time it is accessed
                  const proxy = new Proxy(createShadowTarget(distortedValue), readOnlyHandler);
                  registerProxy(proxy, value);
                  ObjectDefineProperty(this, 'readOnly', { value: proxy });
                  return proxy;
              }
          };
          objectGraph.set(distortedValue, reactiveState);
          return reactiveState;
      }
  }
  /** version: 0.26.0 */

  function wrap(data, mutationCallback) {

    let membrane = new ReactiveMembrane({
      valueMutated(target, key) {
        mutationCallback(target, key);
      }

    });
    return {
      data: membrane.getProxy(data),
      membrane: membrane
    };
  }
  function unwrap$1(membrane, observable) {
    let unwrappedData = membrane.unwrapProxy(observable);
    let copy = {};
    Object.keys(unwrappedData).forEach(key => {
      if (['$el', '$refs', '$nextTick', '$watch'].includes(key)) return;
      copy[key] = unwrappedData[key];
    });
    return copy;
  }

  class Component {
    constructor(el, seedDataForCloning = null) {
      this.$el = el;
      const dataAttr = this.$el.getAttribute('x-data');
      const dataExpression = dataAttr === '' ? '{}' : dataAttr;
      const initExpression = this.$el.getAttribute('x-init');
      this.unobservedData = seedDataForCloning ? seedDataForCloning : saferEval(dataExpression, window);
      // Construct a Proxy-based observable. This will be used to handle reactivity.

      let {
        membrane,
        data
      } = this.wrapDataInObservable(this.unobservedData);
      this.$data = data;
      this.membrane = membrane; // After making user-supplied data methods reactive, we can now add
      // our magic properties to the original data for access.

      this.unobservedData.$el = this.$el;
      this.unobservedData.$refs = this.getRefsProxy();
      this.nextTickStack = [];

      this.unobservedData.$nextTick = callback => {
        this.nextTickStack.push(callback);
      };

      this.watchers = {};

      this.unobservedData.$watch = (property, callback) => {
        if (!this.watchers[property]) this.watchers[property] = [];
        this.watchers[property].push(callback);
      };

      this.showDirectiveStack = [];
      this.showDirectiveLastElement;
      var initReturnedCallback; // If x-init is present AND we aren't cloning (skip x-init on clone)

      if (initExpression && !seedDataForCloning) {
        // We want to allow data manipulation, but not trigger DOM updates just yet.
        // We haven't even initialized the elements with their Alpine bindings. I mean c'mon.
        this.pauseReactivity = true;
        initReturnedCallback = this.evaluateReturnExpression(this.$el, initExpression);
        this.pauseReactivity = false;
      } // Register all our listeners and set all our attribute bindings.


      this.initializeElements(this.$el); // Use mutation observer to detect new elements being added within this component at run-time.
      // Alpine's just so darn flexible amirite?

      this.listenForNewElementsToInitialize();

      if (typeof initReturnedCallback === 'function') {
        // Run the callback returned form the "x-init" hook to allow the user to do stuff after
        // Alpine's got it's grubby little paws all over everything.
        initReturnedCallback.call(this.$data);
      }
    }

    getUnobservedData() {
      return unwrap$1(this.membrane, this.$data);
    }

    wrapDataInObservable(data) {
      var self = this;
      let updateDom = debounce(function () {
        self.updateElements(self.$el);
      }, 0);
      return wrap(data, (target, key) => {
        if (self.watchers[key]) {
          // If there's a watcher for this specific key, run it.
          self.watchers[key].forEach(callback => callback(target[key]));
        } else {
          // Let's walk through the watchers with "dot-notation" (foo.bar) and see
          // if this mutation fits any of them.
          Object.keys(self.watchers).filter(i => i.includes('.')).forEach(fullDotNotationKey => {
            let dotNotationParts = fullDotNotationKey.split('.'); // If this dot-notation watcher's last "part" doesn't match the current
            // key, then skip it early for performance reasons.

            if (key !== dotNotationParts[dotNotationParts.length - 1]) return; // Now, walk through the dot-notation "parts" recursively to find
            // a match, and call the watcher if one's found.

            dotNotationParts.reduce((comparisonData, part) => {
              if (Object.is(target, comparisonData)) {
                // Run the watchers.
                self.watchers[fullDotNotationKey].forEach(callback => callback(target[key]));
              }

              return comparisonData[part];
            }, self.getUnobservedData());
          });
        } // Don't react to data changes for cases like the `x-created` hook.


        if (self.pauseReactivity) return;
        updateDom();
      });
    }

    walkAndSkipNestedComponents(el, callback, initializeComponentCallback = () => {}) {
      walk(el, el => {
        // We've hit a component.
        if (el.hasAttribute('x-data')) {
          // If it's not the current one.
          if (!el.isSameNode(this.$el)) {
            // Initialize it if it's not.
            if (!el.__x) initializeComponentCallback(el); // Now we'll let that sub-component deal with itself.

            return false;
          }
        }

        return callback(el);
      });
    }

    initializeElements(rootEl, extraVars = () => {}) {
      this.walkAndSkipNestedComponents(rootEl, el => {
        // Don't touch spawns from for loop
        if (el.__x_for_key !== undefined) return false; // Don't touch spawns from if directives

        if (el.__x_inserted_me !== undefined) return false;
        this.initializeElement(el, extraVars);
      }, el => {
        el.__x = new Component(el);
      });
      this.executeAndClearRemainingShowDirectiveStack(); // Walk through the $nextTick stack and clear it as we go.

      while (this.nextTickStack.length > 0) {
        this.nextTickStack.shift()();
      }
    }

    initializeElement(el, extraVars) {
      // To support class attribute merging, we have to know what the element's
      // original class attribute looked like for reference.
      if (el.hasAttribute('class') && getXAttrs(el).length > 0) {
        el.__x_original_classes = el.getAttribute('class').split(' ');
      }

      this.registerListeners(el, extraVars);
      this.resolveBoundAttributes(el, true, extraVars);
    }

    updateElements(rootEl, extraVars = () => {}) {
      this.walkAndSkipNestedComponents(rootEl, el => {
        // Don't touch spawns from for loop (and check if the root is actually a for loop in a parent, don't skip it.)
        if (el.__x_for_key !== undefined && !el.isSameNode(this.$el)) return false;
        this.updateElement(el, extraVars);
      }, el => {
        el.__x = new Component(el);
      });
      this.executeAndClearRemainingShowDirectiveStack(); // Walk through the $nextTick stack and clear it as we go.

      while (this.nextTickStack.length > 0) {
        this.nextTickStack.shift()();
      }
    }

    executeAndClearRemainingShowDirectiveStack() {
      // The goal here is to start all the x-show transitions
      // and build a nested promise chain so that elements
      // only hide when the children are finished hiding.
      this.showDirectiveStack.reverse().map(thing => {
        return new Promise(resolve => {
          thing(finish => {
            resolve(finish);
          });
        });
      }).reduce((nestedPromise, promise) => {
        return nestedPromise.then(() => {
          return promise.then(finish => finish());
        });
      }, Promise.resolve(() => {})); // We've processed the handler stack. let's clear it.

      this.showDirectiveStack = [];
      this.showDirectiveLastElement = undefined;
    }

    updateElement(el, extraVars) {
      this.resolveBoundAttributes(el, false, extraVars);
    }

    registerListeners(el, extraVars) {
      getXAttrs(el).forEach(({
        type,
        value,
        modifiers,
        expression
      }) => {
        switch (type) {
          case 'on':
            registerListener(this, el, value, modifiers, expression, extraVars);
            break;

          case 'model':
            registerModelListener(this, el, modifiers, expression, extraVars);
            break;
        }
      });
    }

    resolveBoundAttributes(el, initialUpdate = false, extraVars) {
      let attrs = getXAttrs(el);
      attrs.forEach(({
        type,
        value,
        modifiers,
        expression
      }) => {
        switch (type) {
          case 'model':
            handleAttributeBindingDirective(this, el, 'value', expression, extraVars);
            break;

          case 'bind':
            // The :key binding on an x-for is special, ignore it.
            if (el.tagName.toLowerCase() === 'template' && value === 'key') return;
            handleAttributeBindingDirective(this, el, value, expression, extraVars);
            break;

          case 'text':
            var output = this.evaluateReturnExpression(el, expression, extraVars); // If nested model key is undefined, set the default value to empty string.

            if (output === undefined && expression.match(/\./).length) {
              output = '';
            }

            el.innerText = output;
            break;

          case 'html':
            el.innerHTML = this.evaluateReturnExpression(el, expression, extraVars);
            break;

          case 'show':
            var output = this.evaluateReturnExpression(el, expression, extraVars);
            handleShowDirective(this, el, output, modifiers, initialUpdate);
            break;

          case 'if':
            // If this element also has x-for on it, don't process x-if.
            // We will let the "x-for" directive handle the "if"ing.
            if (attrs.filter(i => i.type === 'for').length > 0) return;
            var output = this.evaluateReturnExpression(el, expression, extraVars);
            handleIfDirective(this, el, output, initialUpdate, extraVars);
            break;

          case 'for':
            handleForDirective(this, el, expression, initialUpdate, extraVars);
            break;

          case 'cloak':
            el.removeAttribute('x-cloak');
            break;
        }
      });
    }

    evaluateReturnExpression(el, expression, extraVars = () => {}) {
      return saferEval(expression, this.$data, _objectSpread2({}, extraVars(), {
        $dispatch: this.getDispatchFunction(el)
      }));
    }

    evaluateCommandExpression(el, expression, extraVars = () => {}) {
      return saferEvalNoReturn(expression, this.$data, _objectSpread2({}, extraVars(), {
        $dispatch: this.getDispatchFunction(el)
      }));
    }

    getDispatchFunction(el) {
      return (event, detail = {}) => {
        el.dispatchEvent(new CustomEvent(event, {
          detail,
          bubbles: true
        }));
      };
    }

    listenForNewElementsToInitialize() {
      const targetNode = this.$el;
      const observerOptions = {
        childList: true,
        attributes: true,
        subtree: true
      };
      const observer = new MutationObserver(mutations => {
        for (let i = 0; i < mutations.length; i++) {
          // Filter out mutations triggered from child components.
          const closestParentComponent = mutations[i].target.closest('[x-data]');
          if (!(closestParentComponent && closestParentComponent.isSameNode(this.$el))) return;

          if (mutations[i].type === 'attributes' && mutations[i].attributeName === 'x-data') {
            const rawData = saferEval(mutations[i].target.getAttribute('x-data'), {});
            Object.keys(rawData).forEach(key => {
              if (this.$data[key] !== rawData[key]) {
                this.$data[key] = rawData[key];
              }
            });
          }

          if (mutations[i].addedNodes.length > 0) {
            mutations[i].addedNodes.forEach(node => {
              if (node.nodeType !== 1 || node.__x_inserted_me) return;

              if (node.matches('[x-data]')) {
                node.__x = new Component(node);
                return;
              }

              this.initializeElements(node);
            });
          }
        }
      });
      observer.observe(targetNode, observerOptions);
    }

    getRefsProxy() {
      var self = this;
      var refObj = {};
      // One of the goals of this is to not hold elements in memory, but rather re-evaluate
      // the DOM when the system needs something from it. This way, the framework is flexible and
      // friendly to outside DOM changes from libraries like Vue/Livewire.
      // For this reason, I'm using an "on-demand" proxy to fake a "$refs" object.

      return new Proxy(refObj, {
        get(object, property) {
          if (property === '$isAlpineProxy') return true;
          var ref; // We can't just query the DOM because it's hard to filter out refs in
          // nested components.

          self.walkAndSkipNestedComponents(self.$el, el => {
            if (el.hasAttribute('x-ref') && el.getAttribute('x-ref') === property) {
              ref = el;
            }
          });
          return ref;
        }

      });
    }

  }

  const Alpine = {
    start: async function start() {
      if (!isTesting()) {
        await domReady();
      }

      this.discoverComponents(el => {
        this.initializeComponent(el);
      }); // It's easier and more performant to just support Turbolinks than listen
      // to MutationObserver mutations at the document level.

      document.addEventListener("turbolinks:load", () => {
        this.discoverUninitializedComponents(el => {
          this.initializeComponent(el);
        });
      });
      this.listenForNewUninitializedComponentsAtRunTime(el => {
        this.initializeComponent(el);
      });
    },
    discoverComponents: function discoverComponents(callback) {
      const rootEls = document.querySelectorAll('[x-data]');
      rootEls.forEach(rootEl => {
        callback(rootEl);
      });
    },
    discoverUninitializedComponents: function discoverUninitializedComponents(callback, el = null) {
      const rootEls = (el || document).querySelectorAll('[x-data]');
      Array.from(rootEls).filter(el => el.__x === undefined).forEach(rootEl => {
        callback(rootEl);
      });
    },
    listenForNewUninitializedComponentsAtRunTime: function listenForNewUninitializedComponentsAtRunTime(callback) {
      const targetNode = document.querySelector('body');
      const observerOptions = {
        childList: true,
        attributes: true,
        subtree: true
      };
      const observer = new MutationObserver(mutations => {
        for (let i = 0; i < mutations.length; i++) {
          if (mutations[i].addedNodes.length > 0) {
            mutations[i].addedNodes.forEach(node => {
              // Discard non-element nodes (like line-breaks)
              if (node.nodeType !== 1) return; // Discard any changes happening within an existing component.
              // They will take care of themselves.

              if (node.parentElement && node.parentElement.closest('[x-data]')) return;
              this.discoverUninitializedComponents(el => {
                this.initializeComponent(el);
              }, node.parentElement);
            });
          }
        }
      });
      observer.observe(targetNode, observerOptions);
    },
    initializeComponent: function initializeComponent(el) {
      if (!el.__x) {
        el.__x = new Component(el);
      }
    },
    clone: function clone(component, newEl) {
      if (!newEl.__x) {
        newEl.__x = new Component(newEl, component.getUnobservedData());
      }
    }
  };

  if (!isTesting()) {
    window.Alpine = Alpine;

    if (window.deferLoadingAlpine) {
      window.deferLoadingAlpine(function () {
        window.Alpine.start();
      });
    } else {
      window.Alpine.start();
    }
  }

  return Alpine;

})));
