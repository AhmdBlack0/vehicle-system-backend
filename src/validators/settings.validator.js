const { z } = require('zod');

const updateSettingsSchema = z.object({
  fuelPrice: z.number()
    .positive('سعر الوقود يجب أن يكون أكبر من صفر')
    .max(10000, 'سعر الوقود يجب أن يكون أقل من 10000')
});

module.exports = { updateSettingsSchema };
