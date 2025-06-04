// userRoutes.js
const express = require('express');
const {
    registerUser,
    loginUser,
    updateProfile,
    myOrders,
    getAllOrdersController,
    orderStatusController,
    createOrderController // Import the new controller
} = require('../controllers/userControllers');
const { requireLogin, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Authentification
router.post('/register', registerUser);
router.post('/login', loginUser);
// Profil utilisateur
router.put('/profile', requireLogin, updateProfile);

// Vérification des rôles
router.get('/user-auth', requireLogin, (req, res) => {
    res.status(200).json({ ok: true, role: 'user' });
});
router.get('/admin-auth', requireLogin, isAdmin, (req, res) => {
    res.status(200).json({ ok: true, role: 'admin' });
});

// Commandes utilisateur
router.get('/orders',requireLogin,myOrders);

router.get("/allOrders", requireLogin, isAdmin, getAllOrdersController);

router.put("/orderStatus/:orderId",requireLogin,isAdmin,orderStatusController);

// New route for creating an order without payment
router.post('/order/create', requireLogin, createOrderController); // Added this line

module.exports = router;