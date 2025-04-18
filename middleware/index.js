const db = require('../database/database')

function validateBodyFields(req, res, next) {

    const expectedFields = ['email', 'firstName', 'lastName'];
    const missingFields = expectedFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json({ error: `Missing fields: ${missingFields.join(', ')}` });
    }

    next();
}
// async function emailAlreadyRegistered(req, res, next) {
    
//     const user = await db.collection('users').findOne({ email: req.body.email });

//     if (user) {
//         return res.status(400).json({ error: 'Email already registered' });
//     }

//     next();
// }
async function emailAlreadyRegistered(req, res, next) {
    try {
        // Assuming 'email' is the key for the 'users' table in DynamoDB
        const user = await db.get({ email: req.body.email });

        if (user) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        next();
    } catch (error) {
        console.error(error);  // Log the error to the console
        res.status(500).json({ error: 'Error checking email registration' });
    }
}


async function validUserEmail(req, res, next) {
    const user = await db.collection('users').findOne({ email: req.params.email, active: true });

    if (!user) {
        return res.status(404).json({ error: 'User email not found or not active' });
    }

    req.user = user; 
    next();
}
function validEmailFormat(req, res, next) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const email = req.body.email || req.params.email;

    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    next();
}
module.exports = {
    validateBodyFields,
    emailAlreadyRegistered,
    validEmailFormat,
    validUserEmail
};