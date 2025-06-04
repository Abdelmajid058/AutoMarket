import React, { useEffect, useState } from 'react';
import { useCart } from '../context/cart';
import { useAuth } from '../context/auth';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { HiOutlineTrash } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Cart = () => {
    const [cart, setCart] = useCart(); // Changed setcart to setCart for consistency
    const [auth] = useAuth(); // Removed setAuth as it's not used to modify auth state here
    const [placingOrder, setPlacingOrder] = useState(false); // New state for order placement loading
    const navigate = useNavigate();

    const getImageUrl = (path) => {
        if (!path) return '/images/default-car.jpg'; // Place cette image dans /public/images/
        return path.startsWith('http') ? path : `${process.env.REACT_APP_API_URL}/${path}`;
    };

    // Calculates the total price of items in the cart
    const totalPrice = () => {
        try {
            let total = 0;
            cart?.map((item) => {
                // Assuming 'price' is a string like "X lakh" or just a number string
                const priceValue = parseFloat(item.price.replace(' lakh', ''));
                if (!isNaN(priceValue)) { // Ensure the parsed value is a number
                    total += priceValue;
                }
                return null; // map expects a return value
            });
            // Return total as a number, without currency formatting, as payment is removed
            return total;
        } catch (error) {
            console.log(error);
            return 0; // Return 0 in case of error
        }
    };

    // Removes an item from the cart
    const removeCartItem = (pid) => {
        try {
            let myCart = [...cart];
            let index = myCart.findIndex(item => item._id === pid);
            if (index !== -1) { // Ensure item exists before removing
                myCart.splice(index, 1);
                setCart(myCart);
                localStorage.setItem('cart', JSON.stringify(myCart));
                toast.success('Article supprimé du panier !'); // Updated toast message
            }
        } catch (err) {
            console.log(err);
            toast.error('Erreur lors de la suppression de l\'article.');
        }
    };

    // Handles placing the order without payment
    const handlePlaceOrder = async () => {
        try {
            setPlacingOrder(true); // Set loading state
            const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/user/order/create`, {
                cart // Send the cart items to the backend
            });

            if (data?.success) {
                localStorage.removeItem("cart"); // Clear cart from local storage
                setCart([]); // Clear cart state
                navigate("/dashboard/user/order"); // Navigate to user orders page
                toast.success("Commande passée avec succès !"); // Success message
            } else {
                toast.error(data?.message || "Échec de la commande."); // Error message from backend
            }
        } catch (error) {
            console.log(error);
            toast.error("Une erreur est survenue lors de la commande."); // Generic error message
        } finally {
            setPlacingOrder(false); // Reset loading state
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to top on component mount
    }, []); // Empty dependency array means this runs once on mount

    return (
        <div className='my-5'>
            <section className="h-100 h-custom">
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col">
                            <div className="card">
                                <div className="card-body p-4">
                                    <div className="row">
                                        <div className="col-lg-7">
                                            <h5 className="mb-3">
                                                {!auth?.user
                                                    ? "Bonjour Visiteur" // Updated greeting
                                                    : `Bonjour ${auth?.token && auth?.user?.name}`
                                                }
                                            </h5>
                                            <hr />

                                            <div className="d-flex justify-content-between align-items-center mb-4">
                                                <div>
                                                    <p className="mb-1">Votre panier</p>
                                                    <p className="mb-0">
                                                        {cart?.length
                                                            ? `Vous avez ${cart.length} articles dans votre panier ${auth?.token ? "" : "veuillez vous connecter pour commander !"}`
                                                            : "Votre panier est vide"
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            {cart?.map((p) => (
                                                <div className="card my-3 mb-lg-0" key={p._id}> {/* Added key for list rendering */}
                                                    <div className="card-body">
                                                        <div className="d-flex justify-content-between">
                                                            <div className="d-flex flex-row align-items-center">
                                                                <div>
                                                                    <Link to={`/car/${p.slug}`} className='text-center'>
                                                        <img
                                                            className="border rounded"
                                                            src={getImageUrl(p.productPictures[0])}
                                                            alt={p.name}
                                                            style={{ maxWidth: '100%', maxHeight: '120px', objectFit: 'contain' }}
                                                        />

                                                    </Link>
                                                                </div>
                                                                <div className="mx-2">
                                                                    <p className='sizePrice'><span className='badge rounded-pill text-bg-primary'>{p.brand.name}</span></p>
                                                                    <p className="sizePrice">{p.name}</p>
                                                                </div>
                                                            </div>
                                                            <div className="text-center">
                                                                <p className="sizePrice"> {p.price} TND</p> {/* Changed currency to TND */}
                                                                <button
                                                                    className="btn btn-danger"
                                                                    onClick={() => removeCartItem(p._id)}
                                                                >
                                                                    <HiOutlineTrash size={20} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="col-lg-5">
                                            <div className="card text-white rounded-3 cartStyle">
                                                <div className='card-body'>
                                                    <div className="text-center">
                                                        <h2>Résumé du panier</h2>
                                                        <p>Total | Commander</p> {/* Removed "Payment" */}
                                                        <hr />
                                                        <h4>Total : {totalPrice()} TND</h4> {/* Changed currency to TND */}
                                                        {auth?.user?.address ? (
                                                            <>
                                                                <div className="mb-3">
                                                                    <h4>Adresse actuelle</h4>
                                                                    <h5>{auth?.user?.address}</h5>
                                                                    <button
                                                                        className="btn btn-warning my-2"
                                                                        onClick={() => navigate("/dashboard/user/profile")}
                                                                    >
                                                                        Mettre à jour l'adresse
                                                                    </button>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div className="mb-3">
                                                                {auth?.token ? (
                                                                    <button
                                                                        className="btn btn-outline-warning"
                                                                        onClick={() => navigate("/dashboard/user/profile")}
                                                                    >
                                                                        Mettre à jour l'adresse
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        className="btn btn-primary"
                                                                        onClick={() =>
                                                                            navigate("/login", {
                                                                                state: "/cart",
                                                                            })
                                                                        }
                                                                    >
                                                                        Veuillez vous connecter pour commander
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}
                                                        <div className="mt-2">
                                                            {/* Conditional rendering for the "Place Order" button */}
                                                            {cart?.length > 0 && auth?.token && auth?.user?.address ? (
                                                                <button
                                                                    className="btn btn-dark mt-3"
                                                                    onClick={handlePlaceOrder}
                                                                    disabled={placingOrder} // Disable while placing order
                                                                >
                                                                    {placingOrder ? "Traitement..." : "Confirmer la commande"}
                                                                </button>
                                                            ) : (
                                                                // Display a message or disable the button if conditions are not met
                                                                <p className="text-white">
                                                                    {cart?.length === 0 && "Votre panier est vide."}
                                                                    {cart?.length > 0 && !auth?.token && "Veuillez vous connecter pour commander."}
                                                                    {cart?.length > 0 && auth?.token && !auth?.user?.address && "Veuillez mettre à jour votre adresse pour commander."}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Cart;