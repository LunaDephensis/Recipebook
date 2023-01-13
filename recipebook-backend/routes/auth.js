const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const userRepo = require('../model/user.repository');
const tagRepo = require('../model/tag.repository');
const AuthService = require('../services/auth.services');
const bcrypt = require('bcrypt');

router.post('/login', async (req, res) => {
        let user = await userRepo.getUser(req.body.username);
        if(user && bcrypt.compareSync(req.body.password, user.password)) {
            sendToken(req, res);
        }
        else {
            res.sendStatus(403);
        }
});

router.get('/logout', (req, res) => {
    res.clearCookie('accessToken', {httpOnly: true});
    res.sendStatus(200);
});

router.post('/signup', async (req, res) => {
        let existUser = await userRepo.existUser(req.body.username, req.body.email);
        if(!existUser) {
            const hash = bcrypt.hashSync(req.body.password, 10);
            await userRepo.signUpUser(req.body.username, hash, req.body.email);
            sendToken(req, res);
        }
        else {
            res.sendStatus(403);
        }
   
});

router.get('/healthcheck', AuthService.verifyToken, (req, res) => {
    res.sendStatus(200);
});

function sendToken(req, res) {
    const token = AuthService.signToken(req.body.username);
    res.cookie('accessToken', token, {httpOnly: true});
    res.sendStatus(200);
}


module.exports = router;
