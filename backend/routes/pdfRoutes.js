const express = require('express');
const multer = require('multer');
const router = express.Router();
const pdfController = require('../controllers/pdfController');

// Route to handle PDF upload and processing
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

router.post('/upload', upload.single('file'),pdfController.uploadPDF);

// Route to get all stored acronyms
router.get('/acronyms', pdfController.getAcronyms);
router.delete('/acronyms', pdfController.deleteAllAcronyms);

module.exports = router;
