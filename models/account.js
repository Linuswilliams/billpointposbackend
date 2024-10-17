const mongoose = require('mongoose')

const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    default: null,
    unique: true,
    required: true
  },
  sessionExpireAt: {
    type: Number,
    default: 0
  },
  authId:{
    type: String,
    default: null
  }
}, {timestamps:true});

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

module.exports = Admin