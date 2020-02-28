import Alpine from 'alpinejs'
import { fireEvent, wait } from '@testing-library/dom'

global.MutationObserver = class {
    observe() {}
}

test('RegExp objects work correctly', async () => {
    document.body.innerHTML = `
        <div x-data="test()">
            <span x-text="bar()"></span>

            <button x-on:click="foo = /[0-9]+/"></button>
        </div>
    `

    test = function() {
        return {
            foo: /[a-z]+/,
            bar() {
                return this.foo.test('justCharsHere')
            }
        }
    }

    Alpine.start()

    expect(document.querySelector('span').innerText).toEqual(true)

    document.querySelector('button').click()

    await wait(() => {
        expect(document.querySelector('span').innerText).toEqual(false)
    })
})

test('Date objects work correctly', async () => {
    document.body.innerHTML = `
        <div x-data="test()">
            <span x-text="foo.toISOString()"></span>

            <button x-on:click="bar()"></button>
        </div>
    `

    test = function() {
        return {
            foo: (new Date('2020-01-01')),
            bar() {
                return this.foo.setDate(2)
            }
        }
    }

    Alpine.start()

    expect(document.querySelector('span').innerText).toEqual('2020-01-01T00:00:00.000Z')

    document.querySelector('button').click()

    await wait(() => {
        expect(document.querySelector('span').innerText).toEqual('2020-01-02T00:00:00.000Z')
    })
})

test('Promise objects work correctly', async () => {
    document.body.innerHTML = `
        <div x-data="test()">
            <span x-text="foo"></span>

            <button x-on:click="baz()"></button>
        </div>
    `

    test = function() {
        return {
            foo: '',
            bar: new Promise((resolve, reject) => {
                resolve('42');
            }),
            baz() {
                this.bar.then(val => {
                    this.foo = val
                });
            }
        }
    }

    Alpine.start()

    expect(document.querySelector('span').innerText).toEqual('')

    document.querySelector('button').click()

    await wait(() => {
        expect(document.querySelector('span').innerText).toEqual('42')
    })
})
