const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const presensiController = require('../controllers/presensiController');
const { addUserData } = require('../middleware/permissionMiddleware');
router.use(addUserData);
router.post('/check-in', presensiController.CheckIn);
router.post('/check-out', presensiController.CheckOut);
module.exports = router;
router.delete("/:id", presensiController.deletePresensi);
router.put(
  '/:id',
  [
    // Validasi checkIn jika dikirim
    body('checkIn')
      .optional() // hanya validasi kalau field dikirim
      .isISO8601()
      .withMessage('checkIn harus dalam format tanggal yang valid (ISO 8601)'),

    // Validasi checkOut jika dikirim
    body('checkOut')
      .optional()
      .isISO8601()
      .withMessage('checkOut harus dalam format tanggal yang valid (ISO 8601)'),
  ],
  (req, res, next) => {
    // Tangani hasil validasi
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validasi gagal',
        errors: errors.array(),
      });
    }
    next(); // lanjut ke controller updatePresensi
  },
  presensiController.updatePresensi
);