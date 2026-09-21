/**
 * Barcode Utility
 * Generates Code128 barcode PNG buffers using bwip-js
 */

const bwipjs = require('bwip-js');

/**
 * Generate a Code128 barcode as a PNG Buffer (Square format)
 * @param {string} barcodeText - The barcode value to encode
 * @returns {Promise<Buffer>} PNG image buffer
 */
const generateBarcodeBuffer = async (barcodeText) => {
  const pngBuffer = await bwipjs.toBuffer({
    bcid: 'code128',        // Barcode type: Code128
    text: barcodeText,      // Text to encode
    scale: 4,               // 4x scaling factor (increased for square format)
    height: 12,             // Bar height in millimeters (reduced for square ratio)
    includetext: true,      // Show human-readable text below
    textxalign: 'center',   // Center-align the text
    textsize: 14,           // Text font size (increased for readability)
    paddingwidth: 25,       // Horizontal padding (increased for square)
    paddingheight: 25,      // Vertical padding (increased for square)
    backgroundcolor: 'ffffff', // White background
    barcolor: '000000',     // Black bars
  });
  return pngBuffer;
};

module.exports = { generateBarcodeBuffer };
