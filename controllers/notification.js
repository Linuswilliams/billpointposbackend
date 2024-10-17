const customError = require("../customError");
const Notifications = require("../models/notification");

// Controller to get all notifications
async function getNotifications (req, res, next) {
  try {
    const notifications = await Notifications.find({}).sort({ createdAt: -1 });

    if (!notifications || notifications.length === 0) {
      return next(customError('Notifications not found' ));
    }

    return res.status(200).json({ message: notifications });
  } catch (error) {
    console.error(error);
    next(customError(error)); // Custom error handler or use res.status(500)
  }
};

// Controller to update notification as read
async function markAllNotificationsAsRead(req, res, next) {
  try {
    // Update all notifications to mark them as read
    const updatedNotifications = await Notifications.updateMany(
      {},
      { isRead: true }
    );

    return res.status(200).json({ message: `${updatedNotifications.modifiedCount} notifications marked as read.` });
  } catch (error) {
    console.error(error);
    return next(customError(error)); // Custom error handler or use res.status(500)
  }
}


module.exports = {
    getNotifications,
    markAllNotificationsAsRead
}