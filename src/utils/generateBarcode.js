/**
 * Barcode String Generator
 * Produces unique barcode strings for vehicles using timestamp + random suffix
 */

const { v4: uuidv4 } = require('uuid');

/**
 * Generate a unique, human-readable barcode string
 * Format: VH-{YEAR}-{SHORT_UUID} (Square format)
 * Example: VH-2024-A3F9
 * @returns {string} Unique barcode string
 */
const generateUniqueBarcode = () => {
  const year = new Date().getFullYear();
  // Take the first 4 characters of a UUID (without dashes) and uppercase for square format
  const shortId = uuidv4().replace(/-/g, '').substring(0, 4).toUpperCase();
  return `VH-${year}-${shortId}`;
};

module.exports = { generateUniqueBarcode };
