const express = require('express');

const usersController = require('../controller/users');

const router = express.Router();

router.post('/users', usersController.createUser)

module.exports = router;