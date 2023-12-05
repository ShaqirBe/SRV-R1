var express = require('express');
var router = express.Router();
const { validEmailFormat, validUserEmail } = require('../middleware');

const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const { requiresAuth } = require('express-openid-connect');
const crypto = require('crypto');

// Helper function to generate a 10-digit random string
const generateRandomString = (length) => crypto.randomBytes(length).toString('hex').slice(0, length);

// POST /pictures/:email: Upload a picture for a user
router.post('/pictures/:email', validEmailFormat, validUserEmail, async function(req, res) {  
  const { email } = req.params;
  
  // Retrieve the file object from the request
  const file = req.files.file;  // Adjust based on how file upload is handled in your setup

  // Generate a unique filename
  const originalExtension = file.name.split('.').pop();  // Extracting the file extension from the original filename
  const uniqueFilename = generateRandomString(10) + '.' + originalExtension;

  // Picture metadata
  const pictureMetadata = {
    filename: uniqueFilename,
    description: file.description,  // Assuming description is provided
    fileExtension: originalExtension,
    visible: true,  // Assuming default visibility is true
    size: file.size  // Assuming you can get the size of the file
  };

  // Increment pic_count and save picture metadata in the database
  // This requires database interaction, adjust accordingly
  // Example:
  // await updateUserPicCount(email);
  // await savePictureMetadata(email, pictureMetadata);

  res.status(200).json({ message: 'Picture uploaded successfully', filename: uniqueFilename });
});


// GET /pictures/:email: Get all pictures for a user
router.get('/pictures/:email', validEmailFormat, validUserEmail, requiresAuth(), async function(req, res) {
  const { email } = req.params;
  // Logic to retrieve all pictures for a user from the database
  // Example: const pictures = await getPicturesByEmail(email);
  res.json({ email, pictures: [] }); // Replace with actual pictures array
});

// GET /pictures/visible/:email: Get all visible pictures for a user
router.get('/pictures/visible/:email', validEmailFormat, validUserEmail, requiresAuth(), async function(req, res) {
  const { email } = req.params;
  // Logic to retrieve all visible pictures for a user from the database
  // Example: const visiblePictures = await getVisiblePicturesByEmail(email);
  res.json({ email, pictures: [] }); // Replace with actual visible pictures array
});

// PUT /pictures/visible/:visible: Change the visibility of a picture
router.put('/pictures/visible/:visible', validEmailFormat, validUserEmail, requiresAuth(), async function(req, res) {
  const { visible } = req.params;
  const { email, picNumber } = req.body; // Assuming picNumber is provided in the body
  // Logic to change the visibility of a specific picture
  // Example: await setPictureVisibility(email, picNumber, visible);
  res.json({ message: 'Picture visibility updated', picNumber, visible });
});

// PUT /pictures: Set the description for a picture
router.put('/pictures', validEmailFormat, validUserEmail, requiresAuth(), async function(req, res) {
  const { email, picNumber, description } = req.body; // Assuming picNumber and description are provided in the body
  // Logic to set the description of a specific picture
  // Example: await setPictureDescription(email, picNumber, description);
  res.json({ message: 'Picture description updated', picNumber, description });
});

module.exports = router;






// var express = require('express');
// var router = express.Router();
// const { validateBodyFields, emailAlreadyRegistered, validEmailFormat } = require('../middleware');

// const AWS = require("aws-sdk");
// const s3 = new AWS.S3()
// const { requiresAuth } = require('express-openid-connect');

// /* GET pictures listing. */
// router.get('/', requiresAuth(), async function(req, res, next) {
//   var params = {
//     Bucket: process.env.CYCLIC_BUCKET_NAME,
//     Delimiter: '/',
//     Prefix: req.oidc.user.email + '/'
//   };
//   var allObjects = await s3.listObjects(params).promise();
//   var keys = allObjects?.Contents.map( x=> x.Key)
//   const pictures = await Promise.all(keys.map(async (key) => {
//     let my_file = await s3.getObject({
//       Bucket: process.env.CYCLIC_BUCKET_NAME,
//       Key: key,
//     }).promise();
//     return {
//         src: Buffer.from(my_file.Body).toString('base64'),
//         name: key.split("/").pop()
//     }
//   }))
//   res.render('pictures', { pictures: pictures});
// });

// router.get('/:pictureName', requiresAuth(), async function(req, res, next) {
//   let my_file = await s3.getObject({
//     Bucket: process.env.CYCLIC_BUCKET_NAME,
//     Key: "public/" + req.params.pictureName,
//   }).promise();
//   const picture = {
//       src: Buffer.from(my_file.Body).toString('base64'),
//       name: req.params.pictureName
//   }
//   res.render('pictureDetails', { picture: picture});
// });

// router.post('/pictures', requiresAuth(), async function(req, res, next) {  
//   const file = req.files.file;
//   console.log(req.files);
//   console.log(req.oidc.user);
//   await s3.putObject({
//     Body: file.data,
//     Bucket: process.env.CYCLIC_BUCKET_NAME,
//     Key: req.oidc.user.email + "/" + file.name,
//   }).promise()
//   res.end();
// });

// module.exports = router;