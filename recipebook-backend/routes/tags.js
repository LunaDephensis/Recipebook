const express = require('express');
const router = express.Router();
const authService = require('../services/auth.services');
const tagRepo = require('../model/tag.repository');

router.get('/', authService.verifyToken, async (req, res, next) => {
    try {
        let tags = await tagRepo.getUserTags(req.username);
        res.json(tags);
    }
    catch(ex) {
        res.sendStatus(500);
    }
});

router.post('/newtag', authService.verifyToken, async (req, res, next) => {
    try {
        await tagRepo.createNewTag(req.username, req.body.tagname);
        res.sendStatus(200);
    }
    catch(ex) {
        res.sendStatus(500);
    }
});

module.exports = router;