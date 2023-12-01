"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderInputs = exports.CartItem = exports.CustomersLogin = exports.EditCustomerInputs = exports.CreateCustomerInputs = void 0;
const class_validator_1 = require("class-validator");
class CreateCustomerInputs {
}
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateCustomerInputs.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.Length)(7, 12),
    __metadata("design:type", String)
], CreateCustomerInputs.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.Length)(7, 12),
    __metadata("design:type", String)
], CreateCustomerInputs.prototype, "password", void 0);
exports.CreateCustomerInputs = CreateCustomerInputs;
class EditCustomerInputs {
}
__decorate([
    (0, class_validator_1.Length)(3, 16),
    __metadata("design:type", String)
], EditCustomerInputs.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.Length)(3, 16),
    __metadata("design:type", String)
], EditCustomerInputs.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.Length)(6, 30),
    __metadata("design:type", String)
], EditCustomerInputs.prototype, "address", void 0);
exports.EditCustomerInputs = EditCustomerInputs;
class CustomersLogin {
}
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CustomersLogin.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.Length)(7, 12),
    __metadata("design:type", String)
], CustomersLogin.prototype, "password", void 0);
exports.CustomersLogin = CustomersLogin;
class CartItem {
}
exports.CartItem = CartItem;
class OrderInputs {
}
exports.OrderInputs = OrderInputs;
//# sourceMappingURL=Customer.dto.js.map