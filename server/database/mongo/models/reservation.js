const mongoose = require("mongoose");

const { MONGO_HOST, MONGO_DBNAME } = process.env;
const conn = mongoose.createConnection(
  `mongodb://${MONGO_HOST}/${MONGO_DBNAME}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// 參賽組別借用雷切機的資訊
const ReserveLaserCutterSchema = new mongoose.Schema(
  // 排到了就將 reserveStatus=0 (不確定哪個比較好)
  {
    teamId: {
      type: String,
      required: true,
    },
    material: {
      type: String,
      required: true,
    },
    thickness: {
      type: String,
      required: true,
    },
    reserveStatus: {
      type: Number, // 0:無預約 1:預約中--> 用在user介面 預約管理的功能(0/無資料:可預約; 1:可取消)
      required: true,
    },
  },
  // created_at決定排序先後，排序數值透過前端render table時的index計算
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const ReserveLaserCutter = conn.model(
  "ReserveLaserCutter",
  ReserveLaserCutterSchema
);

module.exports = {
  ReserveLaserCutter,
};
