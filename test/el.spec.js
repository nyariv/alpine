import Alpine from 'alpinejs'
import { wait } from '@testing-library/dom'

global.MutationObserver = class {
    observe() {}
}

test('$el', async () => {
    document.body.innerHTML = `
        <div x-data>
            <button @click="$el.innerHTML = 'foo'"></button>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('div').innerHTML).not.toEqual('foo')

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('div').innerHTML).toEqual('foo') })
})

test('$el doesnt return a proxy', async () => {
    window.isProxy
    Alpine.scope('data', {
        setIsProxy: function (el) {
            window.isProxy = !! el.isProxy
        }
    })

    document.body.innerHTML = `
        <div x-data="data">
            <button @click="setIsProxy($el)"></button>
        </div>
    `

    Alpine.start()

    document.querySelector('button').click()

    expect(window.isProxy).toEqual(false)
})
