import express from 'express';
import cors from 'cors';

//DATABASE
import mongoose from 'mongoose';
const connect = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/taphoa', {
            dbName: 'taphoa',
        });
        console.log("database connected")
    } catch (error) {
        console.log("database NOT connected")
    }
}
connect();

const Schema = mongoose.Schema;

const prodSchema = new Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    barCode: {type: String, required: true},
});
    
const Production = mongoose.model('Production', prodSchema);

//APP
const app = express();
const router = express.Router();
const PORT = process.env.PORT || 3000;

const getProductions = async (req, res) => {
    const productions = await Production.find();
    res.status(200).json(productions);
}

const testSend = async (req, res) => {
    const barCode = req.body.content;
    if (!barCode) {
        return res.status(400).json({ message: "Thiếu mã vạch" });
    }

    let production = await Production.findOne({ barCode });
    if (production) {
        return res.status(200).json({ message: "Sản phẩm đã tồn tại", production });
    }
    // Nếu chưa có, tạo sản phẩm với tên và giá mặc định
    production = new Production({
        name: "Trà đào KIRIN",
        price: 12000,
        barCode
    });
    await production.save();

    res.status(201).json({ message: "Đã thêm sản phẩm mới với tên và giá mặc định", production });
}

router.get('/get_prod', getProductions);
router.post('/testSend', testSend);

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api/production', router);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
