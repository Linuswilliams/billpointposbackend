const mongoose = require('mongoose')


const PosApplicationschema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  posType: { type: String, required: true },
  businessName: { type: String, required: true },
  areYouAMerchant: { type: String, required: true },
  address: { type: String, required: true },
  state: { type: String, required: true },
  additionalComments: { type: String },
  imageUrl: { type: String }, // Store the uploaded image URL
});

const PosApplications = mongoose.models.PosApplications || mongoose.model("PosApplications", PosApplicationschema);

module.exports = PosApplications