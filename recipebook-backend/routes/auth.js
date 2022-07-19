const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const userRepo = require('../model/user.repository');

router.post('/login', async (req, res) => {
    let user = await userRepo.getUser(req.body.username);
    if(user  && req.body.password === user.password) {
        sendToken(req, res);
    }
    else {
        res.sendStatus(403);
    }
});

router.post('/signup', async (req, res) => {
    let existUserCount = await userRepo.existUser(req.body.username, req.body.email);
    if(!existUserCount) {
        await userRepo.signUpUser(req.body.username, req.body.password, req.body.email);
        sendToken(req, res);
    }
    else {
        res.sendStatus(403);
    }
});

function sendToken(req, res) {
    const token = jwt.sign({username: req.body.username}, process.env.SECRET_KEY);
    res.json(token);
}


module.exports = router;
