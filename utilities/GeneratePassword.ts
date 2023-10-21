import bcrypt from 'bcrypt'
// const saltRounds = 10; // You can adjust the number of salt rounds as needed.

// Function to hash a password
export const hashPassword = (plainPassword: string, saltRounds: number) => {
    return bcrypt.hash(plainPassword, saltRounds);
};

// Function to verify a password
export const verifyPassword = (plainPassword: string, hashedPassword: string) => {
    return bcrypt.compare(plainPassword, hashedPassword);
};

// Example usage
// const plainPassword = 'mySecretPassword';

// hashPassword(plainPassword)
//   .then((hashedPassword:string) => {
//     console.log('Hashed Password:', hashedPassword);

//     // Later, when verifying the password
//     verifyPassword(plainPassword, hashedPassword)
//       .then((result:string) => {
//         if (result) {
//           console.log('Password is correct');
//         } else {
//           console.log('Password is incorrect');
//         }
//       })
//       .catch((error:string) => {
//         console.error('Password verification error:', error);
//       });
//   })
//   .catch((error:string) => {
//     console.error('Password hashing error:', error);
//   });
