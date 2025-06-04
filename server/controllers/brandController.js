const { default: slugify } = require('slugify');
const brandModel = require('../models/carBrand');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Create Brand
const createBrand = async (req, res) => {
    try {
        const { name } = req.body;
        const brandPictures = req.file?.filename; // We store only filename, not full path

        if (!name || !brandPictures) {
            return res.status(400).send({ success: false, message: 'Name and Image are required' });
        }

        const existBrand = await brandModel.findOne({ name });
        if (existBrand) {
            return res.status(400).send({
                success: false,
                message: 'Brand already exists',
            });
        }

        const brand = new brandModel({
            name,
            slug: slugify(name),
            brandPictures,
        });

        await brand.save();

        res.status(201).send({
            success: true,
            message: 'Brand Created Successfully',
            brand,
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: 'Error in creating Brand',
            error: err.message,
        });
    }
};

// Get all brands
const getBrand = async (req, res) => {
    try {
        const brands = await brandModel.find({}).populate('carInvoleInThisBrand');

        const updatedBrands = brands.map(brand => {
            brand.brandPictures = `${req.protocol}://${req.get('host')}/uploads/${brand.brandPictures}`;
            return brand;
        });

        res.status(200).send({
            success: true,
            totalBrand: updatedBrands.length,
            message: 'All Brands',
            brands: updatedBrands,
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: 'Error in Getting Brands',
            error: err.message,
        });
    }
};

// Get brand by slug
const getBrandById = async (req, res) => {
    try {
        const brand = await brandModel.findOne({ slug: req.params.slug }).populate('carInvoleInThisBrand');

        if (!brand) {
            return res.status(404).send({
                success: false,
                message: 'Brand not found',
            });
        }

        brand.brandPictures = `${req.protocol}://${req.get('host')}/uploads/${brand.brandPictures}`;

        brand.carInvoleInThisBrand.forEach(car => {
            car.productPictures = car.productPictures.map(picture => {
                return `${req.protocol}://${req.get('host')}/uploads/${picture}`;
            });
        });

        res.status(200).send({
            success: true,
            message: 'Brand Details',
            brand,
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: 'Error in Getting Brand Details',
            error: err.message,
        });
    }
};

// Update Brand
const updateBrand = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;
        const updateData = { name, slug: slugify(name) };

        if (req.file) {
            const brand = await brandModel.findById(id);
            if (brand && brand.brandPictures) {
                const oldImagePath = path.join(__dirname, '../uploads/', brand.brandPictures);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath); // Remove old image
                }
            }
            updateData.brandPictures = req.file.filename;
        }

        const brand = await brandModel.findByIdAndUpdate(id, updateData, { new: true });

        res.status(200).send({
            success: true,
            message: 'Brand Updated Successfully',
            brand,
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: 'Error in Updating Brand',
            error: err.message,
        });
    }
};

// Delete Brand
const deleteBrand = async (req, res) => {
    try {
        const { id } = req.params;
        const brand = await brandModel.findById(id);

        if (!brand) {
            return res.status(404).send({
                success: false,
                message: 'Brand not found',
            });
        }

        if (brand.brandPictures) {
            const imagePath = path.join(__dirname, '../uploads/', brand.brandPictures);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath); // Delete the image
            }
        }

        await brandModel.findByIdAndDelete(id);

        res.status(200).send({
            success: true,
            message: 'Brand Deleted Successfully',
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: 'Error in Deleting Brand',
            error: err.message,
        });
    }
};

module.exports = { upload, createBrand, getBrand, getBrandById, updateBrand, deleteBrand };
