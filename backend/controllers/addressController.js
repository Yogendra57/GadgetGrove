const Address = require('../models/Address');

// Add new address
const addAddress = async (req, res) => {
  try {
    const { address, city, postalCode,state, country, phone, name } = req.body;

    const newAddress = await Address.create({
      user: req.user._id,
      address,
      city,
      postalCode,
      state,
      country,
      phone,
      name
    });

    return res.status(201).json({ message: 'Address added successfully', address: newAddress });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to save address' });
  }
};

// Get user's saved addresses
const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id });

    return res.status(200).json({ message: 'Addresses fetched', addresses });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to get addresses' });
  }
};
const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    if(!id){
      return res.status(400).json({ message: 'Address ID is required' });
    }
    const address = await Address.findOne({ _id: id, user: req.user._id });
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    await address.deleteOne();
    return res.status(200).json({ message: 'Address deleted successfully' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to delete address' });
  }
};

const updateAddress=async(req,res)=>{
  try{
    const {id}=req.params;
    if(!id){
      return res.status(400).json({ message: 'Address ID is required' });
    }
    const { address, city, postalCode,state, country, phone, name } = req.body;
    if(!address && !city && !postalCode && !state && !country && !phone && !name){
      return res.status(400).json({ message: 'At least one field is required to update' });
    }
    const updatedAddress = await Address.findOneAndUpdate({ _id: id, user: req.user._id }, { address, city, postalCode, state, country, phone, name }, { new: true });
    if (!updatedAddress) {
      return res.status(404).json({ message: 'Address not found' });
    }
    return res.status(200).json({ message: 'Address updated successfully', address: updatedAddress });
  }catch(error){
    console.error(error);
    return res.status(500).json({ message: 'Failed to update address' });
  } 
};
const getAddressById=async(req,res)=>{
  try{
    const {id}=req.params;
    if(!id){
      return res.status(400).json({ message: 'Address ID is required' });
    }
    const address = await Address.findOne({ _id: id, user: req.user._id });
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    return res.status(200).json({ message: 'Address fetched successfully', address });
  }catch(error){
    console.error(error);
    return res.status(500).json({ message: 'Failed to fetch address' });
  } 
};

module.exports = { addAddress, getAddresses, deleteAddress, updateAddress, getAddressById };
