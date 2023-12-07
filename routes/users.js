var express = require('express');
var router = express.Router();
const { validateBodyFields, emailAlreadyRegistered, validEmailFormat, validUserEmail } = require('../middleware');

const CyclicDB = require('@cyclic.sh/dynamodb');
const db = CyclicDB(process.env.CYCLIC_DB);
let users = db.collection('users');

// GET all users
router.get('/', async function(req, res, next) {
  let list = await users.list();
  res.send(list);
});

// GET a specific user
router.get('/:key', async function(req, res, next) {
  let item = await users.get(req.params.key);
  res.send(item);
});

// POST /register: Register a new user
router.post('/register', validateBodyFields, validEmailFormat, emailAlreadyRegistered, async function(req, res) {
  try {
    const { email, firstName, lastName } = req.body;
    await users.set(email, {
      firstName,
      lastName,
      active: true,  
      pic_count: 0   
    });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT /: Activate a user
router.put('/', validateBodyFields, validEmailFormat, validUserEmail, async function(req, res, next) {
  const { email } = req.body;
  
  let user = await users.get(email);
  if (user) {
    user.active = true;
    await users.set(email, user);
    res.json({ message: 'User activated successfully' });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// DELETE /: Deactivate a user
router.delete('/', validateBodyFields, validEmailFormat, validUserEmail, async function(req, res, next) {
  const { email } = req.body;
  
  let user = await users.get(email);
  if (user) {
    user.active = false;
    await users.set(email, user);
    res.json({ message: 'User deactivated successfully' });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

module.exports = router;






// var express = require('express');
// var router = express.Router();
// const { validateBodyFields, emailAlreadyRegistered, validEmailFormat } = require('../middleware');

// const CyclicDB = require('@cyclic.sh/dynamodb')
// const db = CyclicDB(process.env.CYCLIC_DB)
// let users = db.collection('users')

// router.get('/users', async function(req, res, next) {
//   let list = await users.list();
//   res.send(list);
// });

// router.get('/:key', async function(req, res, next) {
//   let item = await users.get(req.params.key);
//   res.send(item);
// });

// router.post('/register', validateBodyFields, validEmailFormat, emailAlreadyRegistered, async function(req, res, next) {
//   console.log('Request body:', req.body);
//   const {email, firstName, lastName} = req.body;
//   await users.set(email, {
//     firstName: firstName,
//     secondName: lastName
//   })
//   res.end();
// });

// router.put('/users', async function(req, res, next) {
//   const {email, firstName, lastName} = req.body;
//   await users.set(email, {
//     firstName: firstName,
//     secondName: lastName
//   })
//   res.end();
// });

// router.delete('/:key', async function(req, res, next) {
//   await users.delete(req.params.key);
//   res.end();
// });


// module.exports = router;
