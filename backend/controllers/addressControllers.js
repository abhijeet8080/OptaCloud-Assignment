const { getUserDetailsFromToken } = require("../middleware/auth");
const mongoose = require('mongoose');

const Address = require('../model/AddressModel');

const createAddress = async (req, res) => {
  try {
      const token = req.body.token || "";
      const user = await getUserDetailsFromToken(token);
      if (!user || !user._id) {
          return res.status(403).json({ error: "Invalid or expired token." });
      }

      const { coordinates, flatDetails, areaDetails, category, isFavourite } = req.body;
      // Validate required fields
      if (!coordinates || !coordinates.latitude || !coordinates.longitude) {
          return res.status(400).json({ error: "Coordinates (latitude and longitude) are required." });
      }
      if (!category || !['Home', 'Office', 'Friends'].includes(category)) {
          return res.status(400).json({ error: "Invalid or missing category." });
      }

      const address = new Address({
          coordinates,
          flatDetails,
          areaDetails,
          user: user._id, 
          category,
          isFavourite: isFavourite || false
      });

      await address.save();
      res.status(201).json({ message: 'Address created successfully', address });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};


const getAllAddresses = async (req, res) => {
  try {
    // Extract token from Authorization header
    const token = req.headers.authorization?.split(' ')[1] || ""; // Get token from Bearer token

    if (!token) {
      return res.status(401).json({ error: "Authentication token is required." });
    }

    const user = await getUserDetailsFromToken(token);
    if (!user || !user._id) {
      return res.status(403).json({ error: "Invalid or expired token." });
    }

    const addresses = await Address.find({ user: user._id });
    res.status(200).json({ addresses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const deleteAddress = async (req, res) => {
    try {
    const token = req.headers.authorization?.split(' ')[1] || ""; // Get token from Bearer token

      if (!token) {
        return res.status(401).json({ error: "Authentication token is required." });
      }
  
      const user = await getUserDetailsFromToken(token);
      if (!user || !user._id) {
        return res.status(403).json({ error: "Invalid or expired token." });
      }
  
      const addressId = req.params.id;
      if (!addressId) {
        return res.status(400).json({ error: "Address ID is required." });
      }
      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(addressId)) {
        return res.status(400).json({ error: "Invalid Address ID format." });
      }
  
      const address = await Address.findOne({ _id: addressId, user: user._id });
      if (!address) {
        return res.status(404).json({ error: "Address not found or not owned by the user." });
      }
  
      await Address.deleteOne({ _id: addressId });

      res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


  const setFavouriteAddress = async (req, res) => {
    try {
      console.log('setFavouriteAddress')
      const token = req.headers.authorization?.split(' ')[1] || ""; 
      // const token = req.body.token || "";
      if (!token) {
        return res.status(401).json({ error: "Authentication token is required." });
      }
  
      const user = await getUserDetailsFromToken(token);

      if (!user || !user._id) {
        return res.status(403).json({ error: "Invalid or expired token." });
      }
      
      const addressId = req.params.id;
      console.log(addressId)
      if (!addressId) {
        return res.status(400).json({ error: "Address ID is required." });
      }
  
      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(addressId)) {
        console.log("Invalid Address ID format.")
        return res.status(400).json({ error: "Invalid Address ID format." });
      }

  
      const address = await Address.findOne({ _id: addressId, user: user._id });
      if (!address) {
        return res.status(404).json({ error: "Address not found or not owned by the user." });
      }

  
      // Optional: Unset other favourite addresses
      if (!address.isFavourite) {
        await Address.updateMany(
          { user: user._id, isFavourite: true },
          { $set: { isFavourite: false } }
        );
      }

  
      // Toggle `isFavourite` status
      address.isFavourite = !address.isFavourite;
      await address.save();
  
      res.status(200).json({
        message: 'Favourite status updated successfully',
        address,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

module.exports = {getAllAddresses,
  createAddress,deleteAddress,
  setFavouriteAddress
};
