const express = require('express');
const { getNotifications, markAllNotificationsAsRead } = require('../controllers/notification');
const router = express.Router();

// Route to get all notifications
router.get('/notifications/get', getNotifications);

// Route to mark a notification as read
router.patch('/notifications/update', markAllNotificationsAsRead);


module.exports = router;
