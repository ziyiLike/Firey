import {app} from '../app'
import {beforeEach, afterEach} from "bun:test";
import {expect, it} from "bun:test";

beforeEach(() => {
    app.run()
});


it('test-api', async () => {
    const response = await app.get('/')

    expect(await response.json()).toBe('test')
});


afterEach(() => {
    app.exit()
});