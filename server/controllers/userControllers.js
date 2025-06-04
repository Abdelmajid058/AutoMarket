// userControllers.js
const { hashPassword, comparePassword } = require("../auth/auth");
const userModel = require("../models/userModel");
const orderModel = require("../models/orderModel");
const JWT = require('jsonwebtoken');

// Fonctions communes
const handleError = (res, error, message) => {
    console.error(`${message}:`, error);
    res.status(500).json({
        success: false,
        message,
        error: error.message
    });
};

// Register User
const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;

        if (!name || !email || !password || !phone || !address) {
            return res.status(400).json({
                success: false,
                message: 'Tous les champs sont requis'
            });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Cet email est déjà utilisé'
            });
        }

        const hashedPassword = await hashPassword(password);
        const user = await new userModel({
            name,
            email,
            phone,
            address,
            password: hashedPassword
        }).save();

        res.status(201).json({
            success: true,
            message: 'Inscription réussie',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            }
        });
    } catch (error) {
        handleError(res, error, 'Erreur lors de l\'inscription');
    }
};

// Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email et mot de passe requis'
            });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Identifiants invalides'
            });
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Identifiants invalides'
            });
        }

        const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({
            success: true,
            message: 'Connexion réussie',
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            }
        });
    } catch (error) {
        handleError(res, error, 'Erreur lors de la connexion');
    }
};

// Update Profile
const updateProfile = async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;
        const user = await userModel.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        const hashedPassword = password ? await hashPassword(password) : user.password;
        const updatedUser = await userModel.findByIdAndUpdate(
            req.user._id,
            { name, email, password: hashedPassword, phone, address },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Profil mis à jour',
            user: updatedUser
        });
    } catch (error) {
        handleError(res, error, 'Erreur lors de la mise à jour du profil');
    }
};

// Order Controllers
const myOrders = async(req,res) => {
    try {
        const orders = await orderModel
          .find({ buyer: req.user._id }).populate('products')
          .populate("buyer", "name");
        res.json(orders);
      } catch (error) {
        res.status(500).send({
          success: false,
          message: "Error While Getting Orders",
          error,
        });
      }
}

const getAllOrdersController = async(req,res) => {
try {
    const orders = await orderModel
      .find({}).populate("products")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error); // This is what you need to check
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
}


const orderStatusController = async(req,res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const orders = await orderModel.findByIdAndUpdate(
          orderId,
          { status },
          { new: true }
        );
        res.json(orders);
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Error While Updateing Order",
          error,
        });
      }
}

// New controller to create an order without payment
const createOrderController = async (req, res) => {
    try {
        const { cart } = req.body;
        const buyer = req.user._id; // The authenticated user's ID

        if (!cart || cart.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Le panier est vide."
            });
        }

        // Extract product IDs from the cart
        const products = cart.map(item => item._id);

        const newOrder = new orderModel({
            products: products,
            buyer: buyer,
            status: "Not Process" // Default status for new orders
        });

        await newOrder.save();

        res.status(201).json({
            success: true,
            message: "Commande créée avec succès !",
            order: newOrder
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la création de la commande.",
            error: error.message
        });
    }
};


module.exports = {
    registerUser,
    loginUser,
    updateProfile,
    myOrders,
    getAllOrdersController,
    orderStatusController,
    createOrderController // Export the new controller
};