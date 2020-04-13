import Alpine from 'alpinejs'
import { wait } from '@testing-library/dom'

global.MutationObserver = class {
    observe() {}
}

test('x-init', async () => {
    var spanValue
    Alpine.scope('setSpanValue', (el) => {
        spanValue = el.innerHTML
    })

    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }" x-init="setSpanValue($refs.foo)">
            <span x-text="foo" x-ref="foo">baz</span>
        </div>
    `

    Alpine.start()

    expect(spanValue).toEqual('baz')
})

test('x-init from data function with callback return for "x-mounted" functionality', async () => {
    var valueA
    var valueB
    var setValueA = (el) => { valueA = el.innerHTML }
    var setValueB = (el) => { valueB = el.innerText }
    Alpine.scope('setValueA', setValueA)
    Alpine.scope('setValueB', setValueB)
    Alpine.scope('data', function() {
        return {
            foo: 'bar',
            init() {
                setValueA(this.$refs.foo)

                return () => {
                    setValueB(this.$refs.foo)
                }
            }
        }
    });

    document.body.innerHTML = `
        <div x-data="data()" x-init="init()">
            <span x-text="foo" x-ref="foo">baz</span>
        </div>
    `

    Alpine.start()

    expect(valueA).toEqual('baz')
    expect(valueB).toEqual('bar')
})

test('callbacks registered within x-init can affect reactive data changes', async () => {
    document.body.innerHTML = `
        <div x-data="{ bar: 'baz', foo() { this.$refs.foo.addEventListener('click', () => { this.bar = 'bob' }) } }" x-init="foo()">
            <button x-ref="foo"></button>

            <span x-text="bar"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').innerText).toEqual('baz')

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('span').innerText).toEqual('bob') })
})

test('callbacks registered within x-init callback can affect reactive data changes', async () => {
    document.body.innerHTML = `
        <div x-data="{ bar: 'baz', foo() { this.$refs.foo.addEventListener('click', () => { this.bar = 'bob' }) } }" x-init="() => { foo() }">
            <button x-ref="foo"></button>

            <span x-text="bar"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').innerText).toEqual('baz')

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('span').innerText).toEqual('bob') })
})

test('x-init is capable of dispatching an event', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }" @update-foo="foo = $event.detail.foo">
            <div x-data x-init="$dispatch('update-foo', { foo: 'baz' })"></div>

            <span x-text="foo"></span>
        </div>
    `

    Alpine.start()

    await wait(() => {
        expect(document.querySelector('span').innerText).toEqual('baz')
    })
})
