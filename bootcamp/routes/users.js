const express = require('express');
const router = express.Router({ mergeParams: true });

// controllers
const { getUsers, getUser, createUser, updateUser, deleteUser } = require('../controlers/users');

const {protect, authorize} = require('../middlewares/auth');

const User = require('../models/User');
const advancedResults = require('../middlewares/advancedResults');

router.use(protect);
router.use(authorize('publisher','admin'));

router
    .route('/')
    .get(advancedResults(User),getUsers)
    .post(createUser);

router
    .route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);
    

module.exports = router;