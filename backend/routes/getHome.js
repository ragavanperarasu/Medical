const express = require('express')
const router = express.Router()

router.get('/', async (req, res, next) => {
 res.send(`<h1>Medical App</h1>`);
});


module.exports = router