const multer = require('multer');
const crypto = require('crypto');
const PDFParser = require('pdf-parse');
const { processPDF } = require('../utils/processPDF');
const Acronym = require('../models/Acronym');

// Set up Multer to store files in memory
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

// Controller function to handle PDF upload and processing
exports.uploadPDF = async (req, res) => {
  try {
    if (!req.file) {
      throw new Error("No file uploaded");
    }

    const fileBuffer = req.file.buffer;

    // Process the PDF and extract acronyms
    const pairs = await processPDF(fileBuffer);
    console.log("Extracted pairs:", pairs);

    // Save acronym-definition pairs to MongoDB
    for (const pair of pairs) {
      const acronym = new Acronym(pair);
      await acronym.save();
    }

    res.status(200).json({ message: 'Acronyms extracted and stored successfully' });
  } catch (error) {
    console.error("Error in uploadPDF function:", error);
    res.status(500).json({ error: error.message });
  }
};

// Controller function to get all acronyms
exports.getAcronyms = async (req, res) => {
  try {
    const acronyms = await Acronym.find({});
    res.status(200).json(acronyms);
  } catch (error) {
    console.error("Error in getAcronyms function:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteAllAcronyms = async (req, res) => {
    try {
      await Acronym.deleteMany({});
      res.status(200).json({ message: 'All acronyms deleted successfully' });
    } catch (error) {
      console.error("Error in deleteAllAcronyms function:", error);
      res.status(500).json({ error: error.message });
    }
  };
  
