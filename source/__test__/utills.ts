import { Redis } from 'ioredis'
import { client } from "../services/Redis"


export const test_data = {
    vendor: {
        name: "Loc DIne Restaurant",
        ownerName: "Mr ABC",
        foodType: ["Veg","Non Veg"],
        pincode: "400421",
        address: "ABC Street AB House 123",
        phone: "9246756931756",
        email: "sfj1232sddaa@gmail.com",
        password: "testsd1223"
    },
    DB_Vendor: {
        "foodType": [
            "Veg",
            "Non Veg"
        ],
        "coverImage": [
            "2023-10-26T07-22-03.318Z_burger.jpeg",
            "2023-10-26T07-22-03.320Z_burger1.jpeg"
        ],
        "foods": [
            "6539304ae9d811ef1be6c3a1",
            "653930c2e9d811ef1be6c3a8",
            "653941619f4a79f02b7f83d0",
            "653941b4630131f273224dc6",
            "653941ba630131f273224dca",
            "6539f56189001b37d4210cc4",
            "6539f58789001b37d4210cc8",
            "6539f8c391457c28c33ed85c",
            "6539f8ed91457c28c33ed860",
            "6539ff3e3069a400dcef22c0",
            "6539ff69c74b8f9fdf4a37af",
            "653a0030472cb3cf31add1ac",
            "653a01e5a4cb98c36e7fc1da",
            "653a0a2cb5c7dad9ca98faf6"
        ],
        "_id": "65393010e9d811ef1be6c39c",
        "name": "Second Restaurant",
        "ownerName": "Mr ABC",
        "pincode": "400421",
        "phone": "9246756931756",
        "email": "abcd123@gmail.com",
        "serviceAvailable": true,
        "rating": 6
    },
    jwtToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTM5MzAxMGU5ZDgxMWVmMWJlNmMzOWMiLCJuYW1lIjoiU2Vjb25kIFJlc3RhdXJhbnQiLCJlbWFpbCI6ImFiY2QxMjNAZ21haWwuY29tIiwiZm9vZFR5cGUiOlsiVmVnIiwiTm9uIFZlZyJdLCJpYXQiOjE3MTU3ODUwNzIsImV4cCI6MTcxNjM4OTg3Mn0.sOPyTEK3rcHWzPqh5XlWzU5qZqk5lhgnm_P1CJGCOZI"
}



export async function redis_instance_shutdown() {
    async function closeRedisConnection(client: Redis): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            client.quit((err) => {
                if (err) {
                    reject(err)
                    return // Exit early if error occurs
                }
                resolve()
            })

            client.once('end', () => resolve())
        })
    }

    (async () => {
        try {
            await closeRedisConnection(client)
            // console.log('Redis connection closed:', client.status === 'end')
        } catch (error) {
            // console.error('Error closing Redis connection:', error)
        }
    })()
}