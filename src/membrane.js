/**
 * This class is deeply inspired by https://github.com/salesforce/observable-membrane
 * Most of the code is a direct porting of part of that library plus some necessary changes
 * to make it compatible with old browsers and remove any code that is not usefull for Alpine JS.
 */
export class SimpleObservableMembrane {
    constructor(options = null) {
        if (options !== null) {
            const { valueMutated, valueObserved } = options;
            this.valueMutated = options['valueMutated'] ? options['valueMutated'] : this.defaultValueMutated;
            this.valueObserved = options['valueObserved'] ? options['valueObserved'] : this.defaultValueObserved;
            this.proxies = new WeakMap()
            this.reverseProxies = new WeakMap()
        }
    }

    defaultValueObserved(target, key) {}

    defaultValueMutated(target, key) {}

    getProxy(value) {
        value = this.unwrapProxy(value);
        if (this.valueIsObservable(value)) {
            let proxy = this.proxies.get(value);
            if (proxy) {
                return proxy;
            }
            const reactiveHandler = this.proxyHandler(this, value);
            proxy = new Proxy(value, reactiveHandler);
            this.proxies.set(value, proxy);
            this.reverseProxies.set(proxy, value);
            return proxy
        }
        return value;
    }

    unwrapProxy(value) {
        return this.reverseProxies.get(value) || value
    }

    proxyHandler(membrane, originalTarget) {
        return {
            get(shadowTarget, key) {
                const value = originalTarget[key]
                membrane.valueObserved(originalTarget, key)
                if(!Array.isArray(originalTarget)
                    && typeof value === 'function'
                    && !originalTarget.hasOwnProperty(key)) {
                    return value.bind(originalTarget)
                }
                return membrane.getProxy(value)
            },
            set(shadowTarget, key, value) {
                const oldValue = originalTarget[key]
                if (oldValue !== value) {
                    originalTarget[key] = value
                    membrane.valueMutated(originalTarget, key)
                } else if (key === 'length' && Array.isArray(originalTarget)) {
                    // push will add the new index, and by the time length
                    // is updated, the internal length is already equal to the new length value
                    // therefore, the oldValue is equal to the value. This is the forking logic
                    // to support this use case.
                    membrane.valueMutated(originalTarget, key)
                }
                return true
            }
        }
    }

    valueIsObservable(value) {
        if (value === null) {
            return false
        }
        if (typeof value === 'function') {
            return false
        }
        if (typeof value !== 'object') {
            return false
        }
        return true
    }
}
