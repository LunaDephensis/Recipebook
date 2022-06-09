const express = require('express');
const router = express.Router();
const authService = require('../services/auth.services');
const tagRepo = require('../model/tag.repository');

router.get('/', authService.verifyToken, async (req, res, next) => {
    let tags = await tagRepo.getUserTags(req.username);
    res.json(tags);
});

module.exports = router;