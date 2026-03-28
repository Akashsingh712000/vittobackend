const express = require('express');
const { createLead, getLead } = require('../controllers/leadController');

const router = express.Router();

router.post('/', createLead);
router.get('/:id', getLead);

module.exports = router;
