const express=require('express');
const router=express.Router();
const {isAdmin}=require('../middleware/authMiddleware');
const { verifyToken } = require('../config/jwt');
const User=require('../models/User')
// Get User Profile: GET /api/users/profile
router.get('/profile',verifyToken,async(req,res)=>{
    const id=req.user._id;
    if (!id) {
    return res.status(400).json({ message: 'Invalid token or user ID missing' });
}
    try {
        const user=await User.findById(id).select('-password');
        if(!user){
            return res.status(404).json({message:'No user found or invalid userId'})
        }
        res.status(200).json({message:'Profile details fetched successfully',user});
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({message:'Failed to load profile try agian!'})
    }
});


// Update User Profile: PUT /api/users/profile
router.put('/profile',verifyToken,async(req,res)=>{
    const userId=req.user._id;
    if(!userId){
        return res.status(400).json({message:'You are not authenticate or invalid token try agian!'})
    }
    try{
        const user=await User.findById(userId);
        if(!user){
            return res.status(404).json({message:'User not found or invalid user id'});
        }
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        // Update shopping address (nested object)
        if (req.body.shopingAddress) {
            user.shopingAddress.street = req.body.shopingAddress.street || user.shopingAddress.street;
            user.shopingAddress.city = req.body.shopingAddress.city || user.shopingAddress.city;
            user.shopingAddress.state = req.body.shopingAddress.state || user.shopingAddress.state;
            user.shopingAddress.zip = req.body.shopingAddress.zip || user.shopingAddress.zip;
            user.shopingAddress.country = req.body.shopingAddress.country || user.shopingAddress.country;
        }


        const updatedUser = await user.save();

        return res.status(200).json({
           
            message: 'Profile updated successfully',
            user: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                shopingAddress: updatedUser.shopingAddress
            }
        });

    }catch(error){
        console.error(error);
        return res.status(500).json({message:'Internal server error failed to update profile try again!'})
    }
})

// Get All Users: GET /api/users (Admin only)
router.get('/',verifyToken,isAdmin,async(req,res)=>{
    try {
        const users=await User.find().select('-password');
        if(!users || users.length===0){
            return res.status(404).json({message:'No users found or no users in the database'});
        }
        return res.status(200).json({message:'Users fetched sucessfully',count: users.length,users})
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({message:'Failed to fetch users try again!'});
    }
});

// Delete User: DELETE /api/users/:id (Admin only)
router.delete('/:id',verifyToken,isAdmin,async(req,res)=>{
    const {id}=req.params;
    if(!id){
        return res.status(400).json({message:'Invalid id'})
    }
    try {
        const user=await User.findOneAndDelete({_id:id});
        if(!user){
            return res.status(404).json({message:'User not deleted try again'});
        }
        return res.status(200).json({message:'User deleted successfully',user});
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({message:'Failed to delete user please try again!'})
    }
});
module.exports=router;