const mongoose = require('mongoose')

const Notificationschema = new mongoose.Schema({
  description:{
    type:String,
    default: null
  },
  isRead:{
    type: Boolean,
    default: false
  },
});

const Notifications = mongoose.models.Notifications || mongoose.model("Notifications", Notificationschema);

module.exports = Notifications