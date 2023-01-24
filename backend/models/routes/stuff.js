const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const multer = require('../../middleware/multer')
const stuffCtrl = require('../controllers/stuff');

// Création des routes pour l'API
router.post('/', auth, multer, stuffCtrl.createSauce);
router.get('/:id', auth, stuffCtrl.findOneSauce);
router.put('/:id', auth, stuffCtrl.modifySauce);
router.delete('/:id', auth, stuffCtrl.deleteSauce);
router.get('/', auth, stuffCtrl.findAllSauce);
router.post('/:id/like', auth, stuffCtrl.createLike);

module.exports = router;