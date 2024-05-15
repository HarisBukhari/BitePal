import supertest from "supertest"
import { redis_instance_shutdown, test_data } from "../utills"
import { app } from "../../services/ExpressApp"
import { CreateVendorInput } from "../../dto"
import { Vendor, Food } from "../../models"
import { generateSalt, hashPassword } from "../../utilities"



//IMP
//This function is called because the redis connection is not closed after Jest testing
redis_instance_shutdown()

describe('admin route', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Reset mocks before each test
    });

    describe('get vendors route', () => {
        describe('given the vendors does not exist', () => {
            it('should return a 200', async () => {
                const { body, statusCode } = await supertest(app).get('/vendor')
                expect(statusCode).toBe(200)
            })
        })


        describe('GetVendors function', () => {
            it('retrieves all vendors successfully (if any exist)', async () => {
                const mockVendors = [ // Array of mock vendor objects
                    test_data.vendor,
                    test_data.vendor
                ];
                // Mock Vendor.find to return the mock vendors
                //@ts-ignore
                jest.spyOn(Vendor, 'find').mockResolvedValueOnce(mockVendors);
                const res = await supertest(app)
                    .get('/admin/vendors') // Adjust path if necessary
                    .expect(200); // Expect successful retrieval status code
                expect(res.body).toBeInstanceOf(Array); // Ensure response is an array
                expect(res.body.length).toBe(mockVendors.length); // Check for retrieved vendors
                // You can add further assertions for specific vendor properties here
                expect(res.body[0]).toHaveProperty('name', mockVendors[0].name);
            });
        })

        // describe('GetVendor by ID function', () => {
        //     it('retrieves all vendors successfully (if any exist)', async () => {
        //         const mockVendor = test_data.DB_Vendor
        //         const id = '65393010e9d811ef1be6c39c'
        //         // Mock Vendor.find to return the mock vendors
        //         //@ts-ignore
        //         // jest.spyOn(Vendor, 'find').mockResolvedValueOnce(mockVendor)
        //         const { body, statusCode } = await supertest(app)
        //             .get(`/admin/vendor/${id}`) // Adjust path if necessary
        //             .expect(200); // Expect successful retrieval status code
        //         expect(body).toBeInstanceOf(Object) // Ensure response is an array
        //         expect(body.name).toBe(mockVendor.name)
        //     },1000000)
        // })

    })
})

describe('CreateVendor function', () => {

        // it('creates a new vendor successfully', async () => {
        //     //@ts-ignore
        //     const mockVendorData: CreateVendorInput = test_data.vendor

        //     //@ts-ignore
        //     jest.spyOn(Vendor, 'create').mockResolvedValueOnce(mockVendorData)
        //     //@ts-ignore
        //     jest.spyOn(Vendor, 'find').mockResolvedValueOnce(null)


        //     const res = await supertest(app)
        //         .post('/admin/vendor') // Adjust path if necessary
        //         .send(mockVendorData)
        //         .expect(201); // Expect successful creation status code
        //     console.log(res.body)
        //     expect(res.body.success).toHaveProperty('name', mockVendorData.name); // Check name in response
        //     expect(res.body.success).toHaveProperty('email', mockVendorData.email);

        // });

        // it('Get Food object array', async () => {
        //     //@ts-ignore
        //     jest.spyOn(Vendor, 'find').mockResolvedValueOnce(null)
        //     const { body, statusCode } = await supertest(app)
        //     .get('/vendor/food/')
        //     .set('Authorization', `Bearer ${test_data.jwtToken}`)
        //     expect(statusCode).toBe(200)
        //     expect(body).toMatchObject(Array);
        // });

    //     // it('handles errors during creation', async () => {
    //     //     const mockError = new Error('Database error');
    //     //     //@ts-ignore
    //     //     Vendor.create.mockRejectedValueOnce(mockError);

    //     //     const res = await supertest(app)
    //     //         .post('/admin/vendor')
    //     //         .send({}) // Send invalid data to trigger error
    //     //         .expect(500); // Expect internal server error status code

    //     //     expect(res.body.error).toBeDefined(); // Expect an error response
    //     // });
});