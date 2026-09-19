const mongoose = require('mongoose');

const collectionRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required']
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },
    wasteType: {
      type: String,
      required: [true, 'Waste type is required'],
      trim: true
    },
    preferredDate: {
      type: Date,
      required: [true, 'Preferred collection date is required']
    },
    preferredTime: {
      type: String,
      required: [true, 'Preferred collection time slot is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['REQUESTED', 'ASSIGNED', 'COLLECTING', 'COMPLETED', 'CANCELLED'],
      default: 'REQUESTED'
    },
    assignedWorker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true
  }
);

const CollectionRequest = mongoose.model('CollectionRequest', collectionRequestSchema);

module.exports = CollectionRequest;
