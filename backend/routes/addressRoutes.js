const express = require('express');
const { createAddress,deleteAddress,setFavouriteAddress,getAllAddresses } = require('../controllers/addressControllers');

const router = express.Router();

router.route('/create-address').post(createAddress);
router.route('/delete-address/:id').delete(deleteAddress);
router.route('/set-favourite/:id').post(setFavouriteAddress);
router.route('/get-all-addresses').get(getAllAddresses);


module.exports = router;    
