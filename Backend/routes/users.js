const express = require('express');

const usersController = require('../controller/users');
const authenticator=require('../controller/auth')

const router = express.Router();

router.post('/users', usersController.createUser)

router.get('/users/:creds', usersController.findUser)

router.put('/users', authenticator.authenticate, usersController.updateUser)

router.get('/users', authenticator.authenticate, usersController.isPremium)

module.exports = router;