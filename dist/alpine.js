!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self).Alpine=t()}(this,(function(){"use strict";function e(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function t(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,i)}return n}function n(n){for(var i=1;i<arguments.length;i++){var r=null!=arguments[i]?arguments[i]:{};i%2?t(Object(r),!0).forEach((function(t){e(n,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(r)):t(Object(r)).forEach((function(e){Object.defineProperty(n,e,Object.getOwnPropertyDescriptor(r,e))}))}return n}function i(e){for(var t=e.concat(),n=0;n<t.length;++n)for(var i=n+1;i<t.length;++i)t[n]===t[i]&&t.splice(i--,1);return t}function r(){return navigator.userAgent.includes("Node.js")||navigator.userAgent.includes("jsdom")}function s(e,t,n={}){return new Function(["$data",...Object.keys(n)],`var result; with($data) { result = ${e} }; return result`)(t,...Object.values(n))}function a(e,t,n={}){return new Function(["dataContext",...Object.keys(n)],`with(dataContext) { ${e} }`)(t,...Object.values(n))}function o(e){const t=c(e.name);return/x-(on|bind|data|text|html|model|if|for|show|cloak|transition|ref)/.test(t)}function l(e,t){return Array.from(e.attributes).filter(o).map(e=>{const t=c(e.name),n=t.match(/x-(on|bind|data|text|html|model|if|for|show|cloak|transition|ref)/),i=t.match(/:([a-zA-Z\-:]+)/),r=t.match(/\.[^.\]]+(?=[^\]]*$)/g)||[];return{type:n?n[1]:null,value:i?i[1]:null,modifiers:r.map(e=>e.replace(".","")),expression:e.value}}).filter(e=>!t||e.type===t)}function c(e){return e.startsWith("@")?e.replace("@","x-on:"):e.startsWith(":")?e.replace(":","x-bind:"):e}function u(e,t,n=!1){if(n)return t();const i=l(e,"transition");if(i.length<1)return t();f(e,(i.find(e=>"enter"===e.value)||{expression:""}).expression.split(" ").filter(e=>""!==e),(i.find(e=>"enter-start"===e.value)||{expression:""}).expression.split(" ").filter(e=>""!==e),(i.find(e=>"enter-end"===e.value)||{expression:""}).expression.split(" ").filter(e=>""!==e),t,()=>{})}function d(e,t,n=!1){if(n)return t();const i=l(e,"transition");if(i.length<1)return t();f(e,(i.find(e=>"leave"===e.value)||{expression:""}).expression.split(" ").filter(e=>""!==e),(i.find(e=>"leave-start"===e.value)||{expression:""}).expression.split(" ").filter(e=>""!==e),(i.find(e=>"leave-end"===e.value)||{expression:""}).expression.split(" ").filter(e=>""!==e),()=>{},t)}function f(e,t,n,i,r,s){const a=e.__x_original_classes||[];e.classList.add(...n),e.classList.add(...t),requestAnimationFrame(()=>{const o=1e3*Number(getComputedStyle(e).transitionDuration.replace("s",""));r(),requestAnimationFrame(()=>{e.classList.remove(...n.filter(e=>!a.includes(e))),e.classList.add(...i),setTimeout(()=>{s(),e.isConnected&&(e.classList.remove(...t.filter(e=>!a.includes(e))),e.classList.remove(...i.filter(e=>!a.includes(e))))},o)})})}function h(e,t,n,i){const{single:r,bunch:s,iterator1:a,iterator2:o}=function(e){const t=/,([^,\}\]]*)(?:,([^,\}\]]*))?$/,n=e.match(/([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/);if(!n)return;const i={};i.bunch=n[2].trim();const r=n[1].trim().replace(/^\(|\)$/g,""),s=r.match(t);s?(i.single=r.replace(t,"").trim(),i.iterator1=s[1].trim(),s[2]&&(i.iterator2=s[2].trim())):i.single=r;return i}(n);var c=e.evaluateReturnExpression(t,s),f=t;c.forEach((n,s,c)=>{const d=function(e,t,n,i,r,s,a,o){const c=l(t,"bind").filter(e=>"key"===e.value)[0];let u={[n]:s};i&&(u[i]=a);r&&(u[r]=o);return c?e.evaluateReturnExpression(t,c.expression,()=>u):a}(e,t,r,a,o,n,s,c);let h=f.nextElementSibling;if(h&&void 0!==h.__x_for_key){if(h.__x_for_key!==d)for(var p=h;p;){if(p.__x_for_key===d){t.parentElement.insertBefore(p,h),h=p;break}p=!(!p.nextElementSibling||void 0===p.nextElementSibling.__x_for_key)&&p.nextElementSibling}delete h.__x_for_key,h.__x_for_alias=r,h.__x_for_value=n,e.updateElements(h,()=>({[h.__x_for_alias]:h.__x_for_value}))}else{const s=document.importNode(t.content,!0);t.parentElement.insertBefore(s,h),h=f.nextElementSibling,u(h,()=>{},i),h.__x_for_alias=r,h.__x_for_value=n,e.initializeElements(h,()=>({[h.__x_for_alias]:h.__x_for_value}))}h.__x_for_key=d,f=h});for(var h=!(!f.nextElementSibling||void 0===f.nextElementSibling.__x_for_key)&&f.nextElementSibling;h;){const e=h,t=h.nextElementSibling;d(h,()=>{e.remove()}),h=!(!t||void 0===t.__x_for_key)&&t}}function p(e,t,n,r,s){var a=e.evaluateReturnExpression(t,r,s);if("value"===n)if(void 0===a&&r.match(/\./).length&&(a=""),"radio"===t.type)t.checked=t.value==a;else if("checkbox"===t.type)if(Array.isArray(a)){let e=!1;a.forEach(n=>{n==t.value&&(e=!0)}),t.checked=e}else t.checked=!!a;else"SELECT"===t.tagName?function(e,t){const n=[].concat(t).map(e=>e+"");Array.from(e.options).forEach(e=>{e.selected=n.includes(e.value||e.text)})}(t,a):t.value=a;else if("class"===n)if(Array.isArray(a)){const e=t.__x_original_classes||[];t.setAttribute("class",i(e.concat(a)).join(" "))}else if("object"==typeof a)Object.keys(a).forEach(e=>{a[e]?e.split(" ").forEach(e=>t.classList.add(e)):e.split(" ").forEach(e=>t.classList.remove(e))});else{const e=t.__x_original_classes||[],n=a.split(" ");t.setAttribute("class",i(e.concat(n)).join(" "))}else["disabled","readonly","required","checked","hidden"].includes(n)?a?t.setAttribute(n,""):t.removeAttribute(n):t.setAttribute(n,a)}function m(e,t,n,i,r,s={}){if(i.includes("away")){const a=o=>{t.contains(o.target)||t.offsetWidth<1&&t.offsetHeight<1||(x(e,r,o,s),i.includes("once")&&document.removeEventListener(n,a))};document.addEventListener(n,a)}else{const a=i.includes("window")?window:i.includes("document")?document:t,o=t=>{(function(e){return["keydown","keyup"].includes(e)})(n)&&function(e,t){let n=t.filter(e=>!["window","document","prevent","stop"].includes(e));if(0===n.length)return!1;if(1===n.length&&n[0]===v(e.key))return!1;const i=["ctrl","shift","alt","meta","cmd","super"].filter(e=>n.includes(e));if(n=n.filter(e=>!i.includes(e)),i.length>0){if(i.filter(t=>("cmd"!==t&&"super"!==t||(t="meta"),e[`${t}Key`])).length===i.length&&n[0]===v(e.key))return!1}return!0}(t,i)||(i.includes("prevent")&&t.preventDefault(),i.includes("stop")&&t.stopPropagation(),x(e,r,t,s),i.includes("once")&&a.removeEventListener(n,o))};a.addEventListener(n,o)}}function x(e,t,i,r){e.evaluateCommandExpression(i.target,t,()=>n({},r(),{$event:i}))}function v(e){switch(e){case"/":return"slash";case" ":case"Spacebar":return"space";default:return e.replace(/([a-z])([A-Z])/g,"$1-$2").replace(/[_\s]/,"-").toLowerCase()}}function b(e,t,n,i,r={}){var s="select"===t.tagName.toLowerCase()||["checkbox","radio"].includes(t.type)||n.includes("lazy")?"change":"input";const a=function(e,t,n,i){var r="";r="checkbox"===t.type?Array.isArray(e.$data[i])?`$event.target.checked ? ${i}.concat([$event.target.value]) : ${i}.filter(i => i !== $event.target.value)`:"$event.target.checked":"select"===t.tagName.toLowerCase()&&t.multiple?n.includes("number")?"Array.from($event.target.selectedOptions).map(option => { return parseFloat(option.value || option.text) })":"Array.from($event.target.selectedOptions).map(option => { return option.value || option.text })":n.includes("number")?"parseFloat($event.target.value)":n.includes("trim")?"$event.target.value.trim()":"$event.target.value";"radio"===t.type&&(t.hasAttribute("name")||t.setAttribute("name",i));return`${i} = ${r}`}(e,t,n,i);m(e,t,s,n,a,r)}class _{constructor(e){this.$el=e;const t=this.$el.getAttribute("x-data"),n=""===t?"{}":t,i=this.$el.getAttribute("x-init"),r=this.$el.getAttribute("x-created"),o=this.$el.getAttribute("x-mounted"),l=this.$el.getAttribute("x-watch"),c=s(n,{});var u;this.$data=this.wrapDataInObservable(c),c.$el=this.$el,c.$refs=this.getRefsProxy(),this.nextTickStack=[],c.$nextTick=e=>{this.nextTickStack.push(e)},i&&(this.pauseReactivity=!0,u=s(this.$el.getAttribute("x-init"),this.$data),this.pauseReactivity=!1),r&&(console.warn('AlpineJS Warning: "x-created" is deprecated and will be removed in the next major version. Use "x-init" instead.'),this.pauseReactivity=!0,a(this.$el.getAttribute("x-created"),this.$data),this.pauseReactivity=!1),this.initializeElements(this.$el),this.listenForNewElementsToInitialize(),"function"==typeof u&&u.call(this.$data),o&&(console.warn('AlpineJS Warning: "x-mounted" is deprecated and will be removed in the next major version. Use "x-init" (with a callback return) for the same behavior.'),a(o,this.$data)),this.watchers={},l&&(this.watchers=s(l,{}))}triggerWatcher(e,t,n){if(!this.watchers[e])return;const i=this.watchers[e];this.evaluateCommandExpression(i,()=>({$newValue:t,$oldValue:n}))}wrapDataInObservable(e){var t=this;const n=e=>({set(n,i,r){const s=Reflect.get(n,i),a=Reflect.set(n,i,r),o=e?`${e}.${i}`:i;return t.triggerWatcher(o,r,s),t.pauseReactivity?a:((l=()=>{for(t.updateElements(t.$el);t.nextTickStack.length>0;)t.nextTickStack.shift()()},c=0,function(){var e=this,t=arguments,n=function(){u=null,l.apply(e,t)};clearTimeout(u),u=setTimeout(n,c)})(),a);var l,c,u},get(t,i){if(t[i]&&t[i].isRefsProxy)return t[i];if(t[i]&&t[i]instanceof Node)return t[i];if("object"==typeof t[i]&&null!==t[i]){const r=e?`${e}.${i}`:i;return new Proxy(t[i],n(r))}return t[i]}});return new Proxy(e,n())}walkAndSkipNestedComponents(e,t,n=(()=>{})){!function e(t,n){if(!1===n(t))return;let i=t.firstElementChild;for(;i;)e(i,n),i=i.nextElementSibling}(e,e=>e.hasAttribute("x-data")&&!e.isSameNode(this.$el)?(e.__x||n(e),!1):t(e))}initializeElements(e,t=(()=>{})){for(this.walkAndSkipNestedComponents(e,e=>{if(void 0!==e.__x_for_key)return!1;this.initializeElement(e,t)},e=>{e.__x=new _(e)});this.nextTickStack.length>0;)this.nextTickStack.shift()()}initializeElement(e,t){e.hasAttribute("class")&&l(e).length>0&&(e.__x_original_classes=e.getAttribute("class").split(" ")),this.registerListeners(e,t),this.resolveBoundAttributes(e,!0,t)}updateElements(e,t=(()=>{})){this.walkAndSkipNestedComponents(e,e=>{if(void 0!==e.__x_for_key&&!e.isSameNode(this.$el))return!1;this.updateElement(e,t)},e=>{e.__x=new _(e)})}updateElement(e,t){this.resolveBoundAttributes(e,!1,t)}registerListeners(e,t){l(e).forEach(({type:n,value:i,modifiers:r,expression:s})=>{switch(n){case"on":m(this,e,i,r,s,t);break;case"model":b(this,e,r,s,t)}})}resolveBoundAttributes(e,t=!1,n){l(e).forEach(({type:i,value:r,modifiers:s,expression:a})=>{switch(i){case"model":p(this,e,"value",a,n);break;case"bind":if("template"===e.tagName.toLowerCase()&&"key"===r)return;p(this,e,r,a,n);break;case"text":void 0===(o=this.evaluateReturnExpression(e,a,n))&&a.match(/\./).length&&(o=""),e.innerText=o;break;case"html":e.innerHTML=this.evaluateReturnExpression(e,a,n);break;case"show":var o=this.evaluateReturnExpression(e,a,n);!function(e,t,n=!1){t?u(e,()=>{1===e.style.length&&""!==e.style.display?e.removeAttribute("style"):e.style.removeProperty("display")},n):d(e,()=>{e.style.display="none"},n)}(e,o,t);break;case"if":o=this.evaluateReturnExpression(e,a,n);!function(e,t,n){"template"!==e.nodeName.toLowerCase()&&console.warn("Alpine: [x-if] directive should only be added to <template> tags. See https://github.com/alpinejs/alpine#x-if");const i=e.nextElementSibling&&!0===e.nextElementSibling.__x_inserted_me;if(t&&!i){const t=document.importNode(e.content,!0);e.parentElement.insertBefore(t,e.nextElementSibling),e.nextElementSibling.__x_inserted_me=!0,u(e.nextElementSibling,()=>{},n)}else!t&&i&&d(e.nextElementSibling,()=>{e.nextElementSibling.remove()},n)}(e,o,t);break;case"for":h(this,e,a,t);break;case"cloak":e.removeAttribute("x-cloak")}})}evaluateReturnExpression(e,t,i=(()=>{})){return s(t,this.$data,n({},i(),{$dispatch:this.getDispatchFunction(e)}))}evaluateCommandExpression(e,t,i=(()=>{})){a(t,this.$data,n({},i(),{$dispatch:this.getDispatchFunction(e)}))}getDispatchFunction(e){return(t,n={})=>{e.dispatchEvent(new CustomEvent(t,{detail:n,bubbles:!0}))}}listenForNewElementsToInitialize(){const e=this.$el;new MutationObserver(e=>{for(let t=0;t<e.length;t++){const n=e[t].target.closest("[x-data]");if(!n||!n.isSameNode(this.$el))return;if("attributes"===e[t].type&&"x-data"===e[t].attributeName){const n=s(e[t].target.getAttribute("x-data"),{});Object.keys(n).forEach(e=>{this.$data[e]!==n[e]&&(this.$data[e]=n[e])})}"attributes"===e[t].type&&"x-watch"===e[t].attributeName&&(this.watchers=s(e[t].target.getAttribute("x-watch"),{})),e[t].addedNodes.length>0&&e[t].addedNodes.forEach(e=>{1===e.nodeType&&(e.matches("[x-data]")?e.__x=new _(e):this.initializeElements(e))})}}).observe(e,{childList:!0,attributes:!0,subtree:!0})}getRefsProxy(){var e=this;return new Proxy({},{get(t,n){return"isRefsProxy"===n||(e.walkAndSkipNestedComponents(e.$el,e=>{e.hasAttribute("x-ref")&&e.getAttribute("x-ref")===n&&(i=e)}),i);var i}})}}const g={start:async function(){r()||await new Promise(e=>{"loading"==document.readyState?document.addEventListener("DOMContentLoaded",e):e()}),this.discoverComponents(e=>{this.initializeComponent(e)}),document.addEventListener("turbolinks:load",()=>{this.discoverUninitializedComponents(e=>{this.initializeComponent(e)})}),this.listenForNewUninitializedComponentsAtRunTime(e=>{this.initializeComponent(e)})},discoverComponents:function(e){document.querySelectorAll("[x-data]").forEach(t=>{e(t)})},discoverUninitializedComponents:function(e,t=null){const n=(t||document).querySelectorAll("[x-data]");Array.from(n).filter(e=>void 0===e.__x).forEach(t=>{e(t)})},listenForNewUninitializedComponentsAtRunTime:function(e){const t=document.querySelector("body");new MutationObserver(e=>{for(let t=0;t<e.length;t++)e[t].addedNodes.length>0&&e[t].addedNodes.forEach(e=>{1===e.nodeType&&(e.parentElement.closest("[x-data]")||this.discoverUninitializedComponents(e=>{this.initializeComponent(e)},e.parentElement))})}).observe(t,{childList:!0,attributes:!0,subtree:!0})},initializeComponent:function(e){e.__x||(e.__x=new _(e))}};return r()||(window.Alpine=g,window.Alpine.start()),g}));
//# sourceMappingURL=alpine.js.map
