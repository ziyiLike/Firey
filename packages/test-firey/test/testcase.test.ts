import {app} from '../app'
import {describe, expect, it} from "bun:test";



describe('FireyTestCase', () => {
    it('test-api', async () => {
        const response = await app.get('/')

        expect(await response.json()).toBe('test')
    });

    it('test-api1', async () => {
        const response = await app.get('/')

        expect(await response.json()).toBe('test')
    });

})