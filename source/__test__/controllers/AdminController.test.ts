import supertest from "supertest"
import { shutdown } from "../app"
import { app } from "../../index.ts"

//IMP
//This function is called because the redis connection is not closed after Jest testing
shutdown()

describe('admin route', () => {
    describe('get vendors route', () => {
        describe('given the vendors does not exist', () => {
            it('should return a 200', async () => {
                const { body, statusCode } = await supertest(app).get('/vendor')
                console.log(body)
                expect(statusCode).toBe(200)
            })
        })
    })
})
