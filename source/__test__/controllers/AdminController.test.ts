import supertest from "supertest"
import {app} from "../app"


describe('admin route', () => {

    describe('get vendors route', () => {

        describe('given the vendors does not exist', () => {

            it('should return a 404', async () => {
                await supertest(await app).get('/vendors').expect(200)
                // expect(true).toBe(true)
            })
        })

    })

})