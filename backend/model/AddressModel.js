    const mongoose = require('mongoose');

    const addressSchema = new mongoose.Schema({
    coordinates: {
        latitude: { 
        type: Number, 
        required: true 
        },
        longitude: { 
        type: Number, 
        required: true 
        }
    },
    flatDetails: {
        type: String,
        required: false,
        trim: true
    },
    areaDetails: {
        type: String,
        required: false,
        trim: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        enum: ['Home', 'Office', 'Friends'], // Limiting to specific categories
        required: true
    },
    isFavourite: {
        type: Boolean,
        default: false
    }
    }, 
    
    {
    timestamps: true 
    });

    module.exports = mongoose.model('Address', addressSchema);
