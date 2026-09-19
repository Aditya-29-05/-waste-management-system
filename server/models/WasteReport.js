const mongoose = require('mongoose');

const wasteReportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Report title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Report description is required'],
      trim: true
    },
    wasteType: {
      type: String,
      required: [true, 'Waste type is required'],
      trim: true
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },
    image: {
      type: String,
      default: null
    },
    status: {
      type: String,
      enum: ['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CANCELLED'],
      default: 'PENDING'
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required']
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

const WasteReport = mongoose.model('WasteReport', wasteReportSchema);

module.exports = WasteReport;
