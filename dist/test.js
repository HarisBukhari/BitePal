var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { generateSalt, hashPassword, verifyPassword } = require('./utilities/GeneratePassword');
const fun = () => __awaiter(this, void 0, void 0, function* () {
    const salt = yield generateSalt();
    const password = 'HelloWord';
    const genPassword = yield hashPassword(password, salt);
    console.log(genPassword);
    console.log(yield verifyPassword(password, genPassword));
});
fun();
//# sourceMappingURL=test.js.map