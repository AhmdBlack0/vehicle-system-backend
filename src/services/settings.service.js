const settingsRepository = require('../repositories/settings.repository');

class SettingsService {
  async getSettings() {
    return await settingsRepository.getSettings();
  }

  async updateSettings(fuelPrice) {
    if (fuelPrice <= 0) {
      throw new Error('سعر الوقود يجب أن يكون أكبر من صفر');
    }
    return await settingsRepository.updateSettings(fuelPrice);
  }
}

module.exports = new SettingsService();
