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
var class_validator_1 = require("class-validator");
var CreateCustomerInputs = /** @class */ (function () {
    function CreateCustomerInputs() {
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
    return CreateCustomerInputs;
}());
exports.CreateCustomerInputs = CreateCustomerInputs;
var EditCustomerInputs = /** @class */ (function () {
    function EditCustomerInputs() {
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
    return EditCustomerInputs;
}());
exports.EditCustomerInputs = EditCustomerInputs;
var CustomersLogin = /** @class */ (function () {
    function CustomersLogin() {
    }
    __decorate([
        (0, class_validator_1.IsEmail)(),
        __metadata("design:type", String)
    ], CustomersLogin.prototype, "email", void 0);
    __decorate([
        (0, class_validator_1.Length)(7, 12),
        __metadata("design:type", String)
    ], CustomersLogin.prototype, "password", void 0);
    return CustomersLogin;
}());
exports.CustomersLogin = CustomersLogin;
var CartItem = /** @class */ (function () {
    function CartItem() {
    }
    return CartItem;
}());
exports.CartItem = CartItem;
var OrderInputs = /** @class */ (function () {
    function OrderInputs() {
    }
    return OrderInputs;
}());
exports.OrderInputs = OrderInputs;
//# sourceMappingURL=Customer.dto.js.map