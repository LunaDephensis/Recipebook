const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const userRepo = require('../model/user.repository');

router.post('/login', async (req, res) => {
    let user = await userRepo.getUser(req.body.username);
    if(user  && req.body.password === user.password) {
        const token = jwt.sign({username: req.body.username}, process.env.SECRET_KEY);
        res.json(token);
    }
    else {
        res.sendStatus(403);
    }
});


module.exports = router;
