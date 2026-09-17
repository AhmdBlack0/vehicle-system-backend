/**
 * Barcode Utility
 * Generates Code128 barcode PNG buffers using bwip-js
 */

const bwipjs = require('bwip-js');

/**
 * Generate a Code128 barcode as a PNG Buffer
 * @param {string} barcodeText - The barcode value to encode
 * @returns {Promise<Buffer>} PNG image buffer
 */
const generateBarcodeBuffer = async (barcodeText) => {
  const pngBuffer = await bwipjs.toBuffer({
    bcid: 'code128',        // Barcode type: Code128
    text: barcodeText,      // Text to encode
    scale: 3,               // 3x scaling factor
    height: 15,             // Bar height in millimeters
    includetext: true,      // Show human-readable text below
    textxalign: 'center',   // Center-align the text
    textsize: 12,           // Text font size
    paddingwidth: 20,       // Horizontal padding
    paddingheight: 10,      // Vertical padding
    backgroundcolor: 'ffffff', // White background
    barcolor: '000000',     // Black bars
  });
  return pngBuffer;
};

module.exports = { generateBarcodeBuffer };
