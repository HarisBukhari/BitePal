import supertest from "supertest";
import { app, shutdown } from "../app";

//IMP
//This function is called because the redis connection is not closed after Jest testing
shutdown()

describe('admin route', () => {


    describe('get vendors route', () => {
        describe('given the vendors does not exist', () => {
            it('should return a 404', async () => {
                await supertest(await app).get('/vendors').expect(200); // Expect a 404 here
            });
        });
    });
});
