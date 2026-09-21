const settingsService = require('../services/settings.service');
const { updateSettingsSchema } = require('../validators/settings.validator');

class SettingsController {
  async getSettings(req, res) {
    try {
      const settings = await settingsService.getSettings();
      res.json({
        success: true,
        data: settings
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateSettings(req, res) {
    try {
      const { fuelPrice } = req.body;
      const validatedData = updateSettingsSchema.parse({ fuelPrice });
      const settings = await settingsService.updateSettings(validatedData.fuelPrice);
      res.json({
        success: true,
        data: settings,
        message: 'تم تحديث الإعدادات بنجاح'
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        res.status(400).json({
          success: false,
          message: error.errors[0].message
        });
      } else {
        res.status(500).json({
          success: false,
          message: error.message
        });
      }
    }
  }
}

module.exports = new SettingsController();
