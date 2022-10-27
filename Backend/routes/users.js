const express = require('express');

const usersController = require('../controller/users');
const authenticator=require('../controller/auth')
const mailer=require('../controller/mailer')

const router = express.Router();

router.post('/users', usersController.createUser)

router.get('/users/:creds', usersController.findUser)

router.put('/users', authenticator.authenticate, usersController.updateUser)

router.get('/users', authenticator.authenticate, usersController.isPremium)

router.get('/forgotPassword/:email', mailer.sendMail)

module.exports = router;