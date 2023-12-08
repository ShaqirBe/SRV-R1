
var express = require('express');
var router = express.Router();
const JSend = require('jsend');
const { validateBodyFields, emailAlreadyRegistered, validUserEmail, validEmailFormat } = require('../middleware/index');
const users = require('../database/database');

// Register a new user
router.post('/register', validateBodyFields, validEmailFormat,  async function(req, res) {
  const {email, firstName, lastName} = req.body;
  try {
    await users.set(email, {
      firstName: firstName,
      lastName: lastName,
      active: true,
      pic_count: 0,
      pictures: []
    });
    res.json(JSend.success(null));
  } catch (error) {
    console.error(error);
    res.json(JSend.error("Error registering user"));
  }
});

// Get all users
router.get('/', async function(req, res) {
  try {
    let list = await users.list();
    let formattedUsers = list.map(user => ({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      active: user.active
    }));
    res.json(JSend.success(formattedUsers));
  } catch (error) {
    res.json(JSend.error("Error retrieving users"));
  }
});

// Activate a user
router.put('/', validateBodyFields, validEmailFormat, validUserEmail, async function(req, res) {
  const { email } = req.body;
  try {
    let user = await users.get(email);
    user.active = true;
    await users.set(email, user);
    res.json(JSend.success(null));
  } catch (error) {
    res.json(JSend.error("Error activating user"));
  }
});

// Deactivate a user
router.delete('/', validateBodyFields, validEmailFormat, validUserEmail, async function(req, res) {
  const { email } = req.body;
  try {
    let user = await users.get(email);
    user.active = false;
    await users.set(email, user);
    res.json(JSend.success(null));
  } catch (error) {
    res.json(JSend.error("Error deactivating user"));
  }
});


module.exports = router;
