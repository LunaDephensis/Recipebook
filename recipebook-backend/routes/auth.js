const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const userRepo = require('../model/user.repository');
const tagRepo = require('../model/tag.repository');
const AuthService = require('../services/auth.services');

router.post('/login', async (req, res) => {
    try {
        let user = await userRepo.getUser(req.body.username);
        if(user && req.body.password === user.password) {
            sendToken(req, res);
        }
        else {
            res.sendStatus(403);
        }
    }
    catch(ex) {
        res.sendStatus(500);
    }
});

router.post('/signup', async (req, res) => {
    try {
        let existUser = await userRepo.existUser(req.body.username, req.body.email);
        if(!existUser) {
            await userRepo.signUpUser(req.body.username, req.body.password, req.body.email);
            sendToken(req, res);
        }
        else {
            res.sendStatus(403);
        }
    }
    catch(ex) {
        res.sendStatus(500);
    }
});

router.get('/healthcheck', AuthService.verifyToken, (req, res) => {
    res.sendStatus(200);
});

function sendToken(req, res) {
    const token = AuthService.signToken(req.body.username);
    res.json(token);
}


module.exports = router;
