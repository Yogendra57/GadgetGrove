const express = require('express');

const isAdmin = async (req, res, next) => {
    if (req.user && req.user.isAdmin === true) {
        return next();  // stop here if admin
    } else {
        return res.status(403).json({ message: 'This route is for admin only' });
    }
};

module.exports = { isAdmin };