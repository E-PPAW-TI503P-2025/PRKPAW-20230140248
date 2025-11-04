const presensiRecords = require("../data/presensiData");
const { Presensi } = require("../models");
const { Op } = require("sequelize");

exports.getDailyReport = async (req, res) => {
  try {
    const { nama, tanggalMulai, tanggalSelesai } = req.query;
    let options = { where: {} };

    // 🔍 Filter berdasarkan nama (opsional)
    if (nama) {
      options.where.nama = {
        [Op.like]: `%${nama}%`,
      };
    }

    // 📅 Filter berdasarkan rentang tanggal checkIn & checkOut
    if (tanggalMulai && tanggalSelesai) {
      const startDate = new Date(tanggalMulai);
      const endDate = new Date(tanggalSelesai);

      // Validasi tanggal
      if (!isNaN(startDate) && !isNaN(endDate)) {
        // Sertakan seluruh hari terakhir (hingga 23:59:59)
        endDate.setHours(23, 59, 59, 999);

        // Filter data yang memiliki checkIn / checkOut dalam rentang tanggal
        options.where = {
          ...options.where,
          [Op.or]: [
            {
              checkIn: {
                [Op.between]: [startDate, endDate],
              },
            },
            {
              checkOut: {
                [Op.between]: [startDate, endDate],
              },
            },
          ],
        };
      }
    }

    // 🔄 Ambil data dari database
    const records = await Presensi.findAll(options);

    // 📦 Kembalikan hasil response
    res.json({
      reportDate: new Date().toLocaleDateString(),
      filter: { nama, tanggalMulai, tanggalSelesai },
      totalRecords: records.length,
      data: records,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil laporan harian",
      error: error.message,
    });
  }
};


