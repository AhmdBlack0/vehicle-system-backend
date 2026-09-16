/**
 * Vehicle Controller
 * Handles HTTP requests for vehicle endpoints
 */

const vehicleService = require('../services/vehicle.service');
const fuelLogRepository = require('../repositories/fuelLog.repository');
const { createVehicleSchema, updateVehicleSchema } = require('../validators/vehicle.validator');
const { sendSuccess } = require('../utils/response');
const jsQR = require('jsqr');
const cloudinary = require('../config/cloudinary');
const https = require('https');
const ApiError = require('../utils/ApiError');
const { PNG } = require('pngjs');
const jpeg = require('jpeg-js');

class VehicleController {
  /**
   * GET /api/vehicles
   * List vehicles with optional search, status, department filters + pagination
   */
  async listVehicles(req, res, next) {
    try {
      const result = await vehicleService.listVehicles(req.query);
      return sendSuccess(res, 200, 'Vehicles retrieved successfully', result.vehicles, {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/vehicles/:id
   * Get vehicle by ID
   */
  async getVehicleById(req, res, next) {
    try {
      const vehicle = await vehicleService.getVehicleById(parseInt(req.params.id));
      return sendSuccess(res, 200, 'Vehicle retrieved successfully', vehicle);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/vehicles/barcode/:barcode
   * Get vehicle by barcode — used in the worker scanning workflow
   */
  async getVehicleByBarcode(req, res, next) {
    try {
      const vehicle = await vehicleService.getVehicleByBarcode(req.params.barcode);
      return sendSuccess(res, 200, 'Vehicle found', vehicle);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/vehicles
   * Create a new vehicle (barcode auto-generated)
   */
  async createVehicle(req, res, next) {
    try {
      const data = createVehicleSchema.parse(req.body);
      const vehicle = await vehicleService.createVehicle(data);
      return sendSuccess(res, 201, 'Vehicle created successfully', vehicle);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/vehicles/:id
   * Update a vehicle
   */
  async updateVehicle(req, res, next) {
    try {
      const data = updateVehicleSchema.parse(req.body);
      const vehicle = await vehicleService.updateVehicle(parseInt(req.params.id), data);
      return sendSuccess(res, 200, 'Vehicle updated successfully', vehicle);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/vehicles/:id
   * Delete a vehicle
   */
  async deleteVehicle(req, res, next) {
    try {
      await vehicleService.deleteVehicle(parseInt(req.params.id));
      return sendSuccess(res, 200, 'Vehicle deleted successfully', null);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/vehicles/:id/barcode
   * Download barcode as PNG image
   */
  async downloadBarcode(req, res, next) {
    try {
      const { buffer, barcode } = await vehicleService.generateBarcodePng(
        parseInt(req.params.id),
      );

      // Set headers for PNG download
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Disposition', `attachment; filename="barcode-${barcode}.png"`);
      res.setHeader('Content-Length', buffer.length);
      return res.end(buffer);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/vehicles/scan-qr
   * Scan QR code image from Cloudinary URL and return vehicle info with fuel history
   * Workers get minimal response, Admins get full details with fuel history
   */
  async scanQRCode(req, res, next) {
    try {
      const { imageUrl } = req.body;

      if (!imageUrl) {
        throw new ApiError('Image URL is required', 400);
      }

      // Download image from Cloudinary URL
      const imageData = await this.downloadImage(imageUrl);

      // Decode QR code using jsQR
      const code = jsQR(imageData, imageData.width, imageData.height);

      if (!code || !code.data) {
        throw new ApiError('No QR code found in image', 400);
      }

      // Extract barcode from QR code data
      const barcode = code.data.trim();

      // Look up vehicle by barcode
      const vehicle = await vehicleService.getVehicleByBarcode(barcode);

      // For workers, return minimal response (just success confirmation)
      if (req.user.role !== 'ADMIN') {
        return sendSuccess(res, 200, 'Vehicle connected successfully', {
          barcode,
          vehicleNumber: vehicle.vehicleNumber,
          plateNumber: vehicle.plateNumber,
        });
      }

      // For admins, return full details with fuel history
      const fuelLogs = await fuelLogRepository.findAllWithoutPagination({
        vehicleId: vehicle.id,
      });

      const fuelSummary = fuelLogs.reduce(
        (acc, log) => {
          acc.totalQuantity += Number(log.fuelQuantity);
          acc.totalCost += Number(log.totalPrice);
          acc.totalOperations++;
          return acc;
        },
        { totalQuantity: 0, totalCost: 0, totalOperations: 0 },
      );

      return sendSuccess(res, 200, 'QR code scanned successfully', {
        barcode,
        vehicle,
        fuelHistory: {
          totalOperations: fuelSummary.totalOperations,
          totalQuantity: Math.round(fuelSummary.totalQuantity * 100) / 100,
          totalCost: Math.round(fuelSummary.totalCost * 100) / 100,
          recentLogs: fuelLogs.slice(0, 5), // Last 5 fuel logs
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Helper method to download image from URL and decode it for jsQR
   */
  async downloadImage(url) {
    return new Promise((resolve, reject) => {
      https.get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new ApiError('Failed to download image', 500));
          return;
        }

        const chunks = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => {
          const buffer = Buffer.concat(chunks);
          const contentType = response.headers['content-type'] || '';

          try {
            let imageData;

            if (contentType.includes('png')) {
              // Decode PNG
              const png = PNG.sync.read(buffer);
              imageData = {
                data: new Uint8ClampedArray(png.data),
                width: png.width,
                height: png.height,
              };
            } else if (contentType.includes('jpeg') || contentType.includes('jpg')) {
              // Decode JPEG
              const rawImageData = jpeg.decode(buffer, { useTArray: true });
              imageData = {
                data: new Uint8ClampedArray(rawImageData.data),
                width: rawImageData.width,
                height: rawImageData.height,
              };
            } else {
              // Try PNG as fallback
              const png = PNG.sync.read(buffer);
              imageData = {
                data: new Uint8ClampedArray(png.data),
                width: png.width,
                height: png.height,
              };
            }

            resolve(imageData);
          } catch (error) {
            reject(new ApiError('Failed to decode image', 400));
          }
        });
      }).on('error', reject);
    });
  }
}

module.exports = new VehicleController();
