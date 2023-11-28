const  { generateSalt, hashPassword, verifyPassword } = require('./utilities/GeneratePassword')



const fun = async () => {
    const salt = await generateSalt()

    const password = 'HelloWord'

    const genPassword = await hashPassword(password, salt)

    console.log(genPassword)

    console.log(await verifyPassword(password,genPassword))
}


fun()