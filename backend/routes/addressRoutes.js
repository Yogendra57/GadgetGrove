const express = require('express');
const { addAddress, getAddresses,deleteAddress, updateAddress,getAddressById } = require('../controllers/addressController');
const { verifyToken } = require('../config/jwt');

const router = express.Router();

router.post('/', verifyToken, addAddress);           // Add a new address
router.get('/', verifyToken, getAddresses);  
router.delete('/:id', verifyToken, deleteAddress);   // Delete an address
router.put('/:id', verifyToken, updateAddress); 
router.get('/:id', verifyToken, getAddressById);   // Get an address by ID
module.exports = router;
