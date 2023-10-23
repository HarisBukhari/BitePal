import bcrypt from 'bcrypt'
// const saltRounds = 10; // You can adjust the number of salt rounds as needed.

//Function to generate salt
export const generateSalt = async () => {
    return await bcrypt.genSalt()
}

// Function to hash a password
export const hashPassword = async (plainPassword: string, salt: string) => {
    return await bcrypt.hash(plainPassword, salt);
}

// Function to verify a password
export const verifyPassword = async (plainPassword: string, hashedPassword: string) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

