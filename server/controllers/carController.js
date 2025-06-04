const { default: slugify } = require("slugify")
const carModel = require("../models/carModel")
const fs = require('fs')
const dotenv = require('dotenv')
const brandModel = require("../models/carBrand");
const multer = require('multer')
const path = require('path')

dotenv.config()

// --- Configuration multer (local uploads) ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// --- Create Car ---

const createCar = async (req, res) => {
    try {
        const { name, description, brand, price, fuelType, transmission, engineSize, mileage, safetyrating, warranty, seater, size, fuelTank } = req.body;

        const requiredFields = ['name', 'description', 'brand', 'price', 'fuelType', 'transmission', 'engineSize', 'mileage', 'safetyrating', 'warranty', 'seater', 'size', 'fuelTank'];
        for (let field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).send({ success: false, message: `${field} is Required` });
            }
        }

        const uploadedFiles = req.files.map(file => `${process.env.BASE_URL}/uploads/${file.filename}`);


        const slug = slugify(name);

        const car = new carModel({
            name,
            slug,
            description,
            brand,
            productPictures: uploadedFiles,
            price,
            fuelType,
            transmission,
            engineSize,
            mileage,
            safetyrating,
            warranty,
            seater,
            size,
            fuelTank
        });

        await car.save();

        const category = await brandModel.findById(brand);
        category.carInvoleInThisBrand.push(car);
        await category.save();

        res.status(201).send({
            success: true,
            message: 'Car Created Successfully',
            car
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            success: false,
            message: "Error in creating Car",
            error: err.message
        });
    }
};

// --- Get All Cars ---
const getAllCar = async (req, res) => {
    try {
        const cars = await carModel.find({}).populate('brand');
        res.status(200).send({
            success: true,
            totalCar: cars.length,
            message: "All cars",
            cars
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: "Error in Getting Car",
            error: err.message
        });
    }
};

// --- Get Car by Id (slug) ---
const getCarById = async (req, res) => {
    try {
        const car = await carModel.findOne({ slug: req.params.slug }).populate('brand');

        res.status(200).send({
            success: true,
            message: "Car By this Id",
            car
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: "Error in Finding Car Id",
            err
        });
    }
}

// --- Delete Car ---
const deleteCar = async (req, res) => {
    try {
        const carModel_ = await carModel.findById(req.params.pid);
        try {
            for (const x of carModel_.productPictures) {
                // Extraire juste le nom de fichier depuis l'URL
                const fileName = x.split('/').pop(); 
                const filePath = path.join(__dirname, '../uploads/', fileName);

                // Vérifier si le fichier existe avant de le supprimer
                if (fs.existsSync(filePath)) {
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.error("Unlink error:", err);
                        }
                    });
                } else {
                    console.warn("File not found:", filePath);
                }
            }
        } catch (e) {
            console.log("Delete Error: " + e);
        }

        await carModel.findByIdAndDelete(req.params.pid);
        res.status(200).send({
            success: true,
            message: "Car Deleted Successfully"
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: "Error in Deleting Car",
            err
        });
    }
};

// --- Update Car ---
const updatecar = async (req, res) => {
    try {
        const { name, description, fuelType, transmission, engineSize, mileage, safetyrating, warranty, seater, size, fuelTank, price } = req.fields

        switch (true) {
            case !name: return res.send({ message: "Name is required" })
            case !description: return res.send({ message: "Description is required" })
            case !price: return res.send({ message: "Price is required" })
            case !fuelType: return res.send({ message: "FuelType is required" })
            case !transmission: return res.send({ message: "Transmission is required" })
            case !engineSize: return res.send({ message: "EngineSize is required" })
            case !mileage: return res.send({ message: "Mileage is required" })
            case !safetyrating: return res.send({ message: "Safetyrating is required" })
            case !warranty: return res.send({ message: "Warranty is required" })
            case !seater: return res.send({ message: "Seater is required" })
            case !size: return res.send({ message: "Size is required" })
            case !fuelTank: return res.send({ message: "Fuel Tank is required" })
        }

        const car = await carModel.findByIdAndUpdate(req.params.pid, { ...req.fields, slug: slugify(name) }, { new: true })

        await car.save()
        res.status(201).send({
            success: true,
            message: 'Car Updated Successfully',
            car
        })
    } catch (err) {
        console.log(err)
        res.status(500).send({
            success: false,
            message: "Error in Updating Car",
            err
        })
    }
}

// --- Related Cars ---
const relatedCar = async (req, res) => {
    try {
        const { cid, bid } = req.params;
        const cars = await carModel.find({
            brand: bid,
            _id: { $ne: cid }
        }).populate('brand');

        res.status(200).send({
            success: true,
            message: 'Related Cars for this Brand',
            cars
        });
    } catch (err) {
        res.status(400).send({
            success: false,
            message: "Error While Fetching Related Cars",
            err
        });
    }
}

module.exports = { upload, createCar, getAllCar, getCarById, deleteCar, updatecar, relatedCar}
