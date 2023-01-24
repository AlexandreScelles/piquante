const express = require('express');
const router = express.Router();
//importation du middleware/password
const password = require('../middleware/password')

const userCtrl = require('../controllers/user');

router.post('/signup', password, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;