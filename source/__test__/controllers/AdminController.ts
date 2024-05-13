import { Request, Response, NextFunction } from "express"
import mongoose from "mongoose"
import { CreateVendorInput } from "../../dto"
import { CreateVendor, GetDeliveryUsers, GetTransactionById, GetTransactions, GetVendorById, GetVendors, VerifyDeliveryUser, findVendor } from "../../controllers"
import { DeliveryUser, Transaction, Vendor } from "../../models"
import { generateSalt, hashPassword } from "../../utilities"
import { BadRequestError, NotFoundError, UnauthenticatedError } from "../../error"

// test('findVendor by email returns the vendor', async () => {
//     const mockVendor = { email: 'test@example.com' };
//     (Vendor.findOne as jest.Mock).mockResolvedValueOnce(mockVendor); // Cast to Jest Mock
  
//     const vendor = await findVendor('', mockVendor.email);
  
//     expect(vendor).toEqual(mockVendor);
//     expect(Vendor.findOne).toHaveBeenCalledWith({ email: mockVendor.email });
//   });
  

// test('findVendor by ID returns the vendor', async () => {
//     const mockVendorId = 'valid_id';
//     const mockVendor = { _id: mockVendorId };
//     (Vendor.findOne as jest.Mock).mockResolvedValueOnce(mockVendor);

//     const vendor = await findVendor(mockVendorId, '');

//     expect(vendor).toEqual(mockVendor);
//     expect(Vendor.findOne).toHaveBeenCalledWith({ _id: mockVendorId });
// });

// test('findVendor throws NotFoundError when no vendor found by email', async () => {
//     (Vendor.findOne as jest.Mock).mockResolvedValueOnce(null);

//     await expect(findVendor('', 'not-existing@example.com')).toThrow(NotFoundError);
// });

// test('findVendor throws NotFoundError when no vendor found by ID', async () => {
//     const invalidId = 'invalid_id';
//     (Vendor.findOne as jest.Mock).mockResolvedValueOnce(null);

//     await expect(findVendor(invalidId, '')).toThrow(NotFoundError);
// });

// test('CreateVendor creates a new vendor with unique email', async () => {
//     const mockVendorData = {
//         name: 'Test Vendor',
//         email: 'unique@example.com',
//         // ... other vendor properties
//     };
//     const mockFindVendor = jest.fn().mockReturnValue(null); // Simulate no existing vendor
//     const mockGenerateSalt = jest.fn().mockResolvedValue('salt');
//     const mockHashPassword = jest.fn().mockResolvedValue('hashed_password');
//     const mockVendorCreate = jest.fn().mockReturnValue(mockVendorData);

//     Vendor.findOne = mockFindVendor;
//     generateSalt = mockGenerateSalt;
//     hashPassword = mockHashPassword;
//     Vendor.create = mockVendorCreate;

//     const req = { body: mockVendorData };
//     const res = { status: jest.fn(), json: jest.fn() };
//     const next = jest.fn();

//     await CreateVendor(req, res, next);

//     expect(mockFindVendor).toHaveBeenCalledWith({ email: mockVendorData.email });
//     expect(mockGenerateSalt).toHaveBeenCalled();
//     expect(mockHashPassword).toHaveBeenCalledWith(mockVendorData.password, 'salt');
//     expect(mockVendorCreate).toHaveBeenCalledWith({
//         ...mockVendorData,
//         password: 'hashed_password',
//         salt: 'salt',
//     });
//     expect(res.status).toHaveBeenCalledWith(201);
//     expect(res.json).toHaveBeenCalledWith({ success: mockVendorData });
// });

// test('CreateVendor throws BadRequestError when vendor already exists', async () => {
//     const mockVendorData = { email: 'existing@example.com' };
//     const mockFindVendor = jest.fn().mockReturnValue({}); // Simulate existing vendor

//     Vendor.findOne = mockFindVendor;

//     const req = { body: mockVendorData };
//     const res = { status: jest.fn(), json: jest.fn() };
//     const next = jest.fn();

//     await expect(CreateVendor(req, res, next)).toThrow(BadRequestError);
// });
// test('GetVendors returns all vendors', async () => {
//     const mockVendors = [{}, {}]; // Example array of vendors
//     Vendor.find.jest.fn().mockResolvedValueOnce(mockVendors);

//     const req = {};
//     const res = { status: jest.fn(), json: jest.fn() };
//     const next = jest.fn();

//     await GetVendors(req, res, next);

//     expect(Vendor.find).toHaveBeenCalled();
//     expect(res.status).toHaveBeenCalledWith(200);
// })
// test('GetVendorById returns vendor with valid ID', async () => {
//     const mockVendorId = 'valid_id';
//     const mockVendor = { _id: mockVendorId };
//     (Vendor.findOne as jest.Mock).mockResolvedValueOnce(mockVendor);

//     const req = { params: { id: mockVendorId } };
//     const res = { status: jest.fn(), json: jest.fn() };
//     const next = jest.fn();

//     await GetVendorById(req, res, next);

//     expect(Vendor.findOne).toHaveBeenCalledWith({ _id: mockVendorId });
//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith(mockVendor);
// });

// test('GetVendorById throws NotFoundError with invalid ID format', async () => {
//     const invalidId = 'invalid_format';

//     const req = { params: { id: invalidId } };
//     const res = { status: jest.fn(), json: jest.fn() };
//     const next = jest.fn();

//     await expect(GetVendorById(req, res, next)).toThrow(BadRequestError);
// });

// test('GetVendorById throws NotFoundError when no vendor found', async () => {
//     const mockVendorId = 'not_found_id';
//     (Vendor.findOne as jest.Mock).mockResolvedValueOnce(null);

//     const req = { params: { id: mockVendorId } };
//     const res = { status: jest.fn(), json: jest.fn() };
//     const next = jest.fn();

//     await expect(GetVendorById(req, res, next)).toThrow(NotFoundError);
// });
// test('GetTransactions returns all transactions', async () => {
//     const mockTransactions = [{}, {}]; // Example array of transactions
//     Transaction.find.jest.fn().mockResolvedValueOnce(mockTransactions);

//     const req = {};
//     const res = { status: jest.fn(), json: jest.fn() };
//     const next = jest.fn();

//     await GetTransactions(req, res, next);

//     expect(Transaction.find).toHaveBeenCalled();
//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith(mockTransactions);
// });

// test('GetTransactions throws NotFoundError when no transactions found', async () => {
//     Transaction.find.jest.fn().mockResolvedValueOnce([]);

//     const req = {};
//     const res = { status: jest.fn(), json: jest.fn() };
//     const next = jest.fn();

//     await expect(GetTransactions(req, res, next)).toThrow(NotFoundError);
// });
// test('GetTransactionById returns transaction with valid ID', async () => {
//     const mockTransactionId = 'valid_id';
//     const mockTransaction = { _id: mockTransactionId };
//     Transaction.findById.jest.fn().mockResolvedValueOnce(mockTransaction);

//     const req = { params: { id: mockTransactionId } };
//     const res = { status: jest.fn(), json: jest.fn() };
//     const next = jest.fn();

//     await GetTransactionById(req, res, next);

//     expect(Transaction.findById).toHaveBeenCalledWith(mockTransactionId);
//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith(mockTransaction);
// });

// test('GetTransactionById throws NotFoundError when no transaction found', async () => {
//     const mockTransactionId = 'not_found_id';
//     Transaction.findById.jest.fn().mockResolvedValueOnce(null);

//     const req = { params: { id: mockTransactionId } };
//     const res = { status: jest.fn(), json: jest.fn() };
//     const next = jest.fn();

//     await expect(GetTransactionById(req, res, next)).toThrow(NotFoundError);
// });
// test('VerifyDeliveryUser updates delivery user status', async () => {
//     const mockDeliveryUserId = 'valid_id';
//     const mockStatus = true;
//     const mockProfile = { _id: mockDeliveryUserId, verified: !mockStatus }; // Update status

//     DeliveryUser.findById.jest.fn().mockResolvedValueOnce(mockProfile);
//     mockProfile.save = jest.fn().mockResolvedValue(mockProfile);

//     const req = { body: { _id: mockDeliveryUserId, status: mockStatus } };
//     const res = { status: jest.fn(), json: jest.fn() };
//     const next = jest.fn();

//     await VerifyDeliveryUser(req, res, next);

//     expect(DeliveryUser.findById).toHaveBeenCalledWith(mockDeliveryUserId);
//     expect(mockProfile.save).toHaveBeenCalled();
//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith(mockProfile);
// });

// test('VerifyDeliveryUser throws BadRequestError when no delivery user found', async () => {
//     const mockDeliveryUserId = 'not_found_id';

//     DeliveryUser.findById.jest.fn().mockResolvedValueOnce(null);

//     const req = { body: { _id: mockDeliveryUserId } };
//     const res = { status: jest.fn(), json: jest.fn() };
//     const next = jest.fn();

//     await expect(VerifyDeliveryUser(req, res, next)).toThrow(BadRequestError);
// });
// test('GetDeliveryUsers returns all delivery users', async () => {
//     const mockDeliveryUsers = [{}, {}]; // Example array of delivery users
//     DeliveryUser.find.jest.fn().mockResolvedValueOnce(mockDeliveryUsers);

//     const req = {};
//     const res = { status: jest.fn(), json: jest.fn() };
//     const next = jest.fn();

//     await GetDeliveryUsers(req, res, next);

//     expect(DeliveryUser.find).toHaveBeenCalled();
//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith(mockDeliveryUsers);
// });

// test('GetDeliveryUsers throws BadRequestError when no delivery users found', async () => {
//     DeliveryUser.find.jest.fn().mockResolvedValueOnce([]);

//     const req = {};
//     const res = { status: jest.fn(), json: jest.fn() };
//     const next = jest.fn();

//     await expect(GetDeliveryUsers(req, res, next)).toThrow(BadRequestError);
// });



