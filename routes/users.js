const express = require('express');
const { getUsers } = require('../controllers/users');
const router = express.Router();

router.get('/users/get', getUsers);

module.exports = router;
