import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../styles/carview.css';
import { BsFuelPumpFill } from 'react-icons/bs';
import { TbEngine, TbStars } from 'react-icons/tb';
import { AiOutlineNodeIndex, AiOutlineColumnWidth } from 'react-icons/ai';
import { MdCompareArrows, MdOutlinePropaneTank, MdAirlineSeatReclineExtra } from 'react-icons/md';
import { GiBackwardTime } from 'react-icons/gi';
import { AiOutlineShoppingCart, AiOutlineEye } from 'react-icons/ai';
import { useCart } from '../context/cart';
import toast from 'react-hot-toast';
import { PiCurrencyInrFill } from 'react-icons/pi';
import { LuGalleryHorizontal } from 'react-icons/lu';
import { ColorRing } from 'react-loader-spinner';
import { QRCodeSVG } from 'qrcode.react';

const CarView = () => {
    const params = useParams();
    const [car, setCar] = useState({
        name: '',
        description: '',
        productPictures: [],
        price: '',
        brand: { name: '', brandPictures: '', slug: '' },
        fuelTank: '',
        fuelType: '',
        mileage: '',
        safetyrating: '',
        warranty: '',
        seater: '',
        size: '',
        engineSize: '',
        transmission: '',
    });
    const [cart, setCart] = useCart();
    const [relatedCar, setRelatedCar] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState('');

    // Improved getImageUrl function with better fallback handling
    const getImageUrl = (path) => {
        if (!path) {
            return '/images/default-car.jpg';
        }
        
        // Make sure path is a string before checking startsWith
        if (typeof path !== 'string') {
            return '/images/default-car.jpg';
        }
        
        return path.startsWith('http') ? path : `${process.env.REACT_APP_API_URL}/${path}`;
    };

    const getCar = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/car/getCarById-car/${params.slug}`);
            console.log("Car data received:", data.car); // Debug log
            setCar(data.car);
            
            // Set main image as soon as we get car data
            if (Array.isArray(data.car.productPictures) && data.car.productPictures.length > 0) {
                const imgUrl = getImageUrl(data.car.productPictures[0]);
                console.log("Setting main image to:", imgUrl); // Debug log
                setMainImage(imgUrl);
            } else {
                setMainImage('/images/default-car.jpg');
            }
            
            getRelatedCar(data?.car._id, data?.car.brand._id);
        } catch (err) {
            console.error("Error fetching car:", err);
            setMainImage('/images/default-car.jpg');
        } finally {
            setLoading(false);
        }
    };

    const getRelatedCar = async (cid, bid) => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/car/related-car/${cid}/${bid}`);
            setRelatedCar(data?.cars || []);
        } catch (err) {
            console.error("Error fetching related cars:", err);
        }
    };

    useEffect(() => {
        if (params?.slug) {
            getCar();
        } else {
            console.error('Error: No slug parameter found');
            setLoading(false);
        }
        window.scrollTo(0, 0);
    }, [params?.slug]);

    const notify = () => toast.success('Ajouté au panier avec succès');
    const updatedAt = car.updatedAt ? new Date(car.updatedAt).toLocaleString() : '';

    return (
        <div className='container marginStyle'>
            {loading ? (
                <div className="h-100 d-flex align-items-center justify-content-center">
                    <ColorRing
                        visible={true}
                        colors={['#000435', 'rgb(14 165 233)', 'rgb(243 244 246)', '#000435', 'rgb(14 165 233)']}
                    />
                </div>
            ) : (
                <div className="row">
                    <div className="col-md-6 text-center">
                        {/* Main Image Display with improved error handling */}
                        <img
                            src={mainImage}
                            alt={car.name || "Car Image"}
                            className="img-fluid border border-4 rounded mb-3"
                            style={{ 
                                width: '100%', 
                                height: '350px', 
                                objectFit: 'contain',
                                backgroundColor: '#f8f9fa'
                            }}
                            onError={(e) => {
                                console.log("Main image error, falling back to default"); // Debug log
                                e.target.onerror = null;
                                e.target.src = '/images/default-car.jpg';
                            }}
                        />
                        
                        {/* Image Gallery */}
                        <div className="car-thumbnails mt-3">
                            {Array.isArray(car.productPictures) && car.productPictures.length > 0 ? (
                                <div className="d-flex justify-content-center flex-wrap">
                                    {car.productPictures.map((picture, index) => {
                                        const thumbUrl = getImageUrl(picture);
                                        return (
                                            <div 
                                                key={index} 
                                                className="thumbnail-container m-1"
                                                onClick={() => {
                                                    console.log("Setting main image to:", thumbUrl); // Debug log
                                                    setMainImage(thumbUrl);
                                                }}
                                            >
                                                <img
                                                    src={thumbUrl}
                                                    alt={`${car.name} - view ${index + 1}`}
                                                    className="img-thumbnail"
                                                    style={{ 
                                                        width: '80px', 
                                                        height: '60px', 
                                                        objectFit: 'cover',
                                                        cursor: 'pointer',
                                                        border: mainImage === thumbUrl ? '2px #d11a2a' : '1px solid #dee2e6'
                                                    }}
                                                    onError={(e) => {
                                                        console.log(`Thumbnail ${index} error, falling back to default`); // Debug log
                                                        e.target.onerror = null;
                                                        e.target.src = '/images/default-car.jpg';
                                                    }}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center text-muted">
                                    <LuGalleryHorizontal size={30} className='my-2' />
                                    <p>Aucune image supplémentaire disponible</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className='centerMob'>
                            <Link to={`/brand/${car.brand?.slug || ''}`}>
                                <img
                                    decoding="async"
                                    src={getImageUrl(car.brand?.brandPictures)}
                                    className="img-fluid"
                                    style={{ maxWidth: '100%', maxHeight: '40px', objectFit: 'contain' }}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/images/default-brand.jpg';
                                    }}
                                />
                                <span className='badge mb-3 m-2' style={{ backgroundColor: '#d11a2a' }}>{car.brand?.name}</span>
                            </Link>
                            <h3 className="mb-3 mt-2">{car.name}</h3>
                        </div>

                        <h4>{car.name} Description : </h4><h6 className='lh-base' style={{ textAlign: 'justify' }}>{car.description}</h6>
                        <h4>Rs. {car.price} TND</h4>
                        {updatedAt && <h4>Publié le : {updatedAt}</h4>}
                        <button
                            style={{ backgroundColor: '#d11a2a' }}
                            className='btn text-white my-1'
                            onClick={() => {
                                setCart([...cart, car]);
                                localStorage.setItem('cart', JSON.stringify([...cart, car]));
                                notify();
                            }}
                        >
                            <AiOutlineShoppingCart size={20} className='pb-1' /> Ajouter au panier
                        </button>
                        <Link className='btn btn-outline-primary mx-2' to='/cart'>
                            <AiOutlineEye size={20} className='pb-1' /> Voir le panier
                        </Link>
                        <table className="table table-bordered my-4">
                            <thead>
                                <tr>
                                    <td className='p-3'><p className='text-secondary'><BsFuelPumpFill size={25} /> Type de carburant</p><h5>{car.fuelType}</h5></td>
                                    <td className='p-3'><p className='text-secondary'><TbEngine size={25} /> Kilométrage</p><h5>{car.mileage}</h5></td>
                                    <td className='p-3'><p className='text-secondary'><TbStars size={25} /> Note de sécurité</p><h5>{car.safetyrating}</h5></td>
                                </tr>
                                <tr>
                                    <td className='p-3'><p className='text-secondary'><GiBackwardTime size={25} /> Garantie</p><h5>{car.warranty}</h5></td>
                                    <td className='p-3'><p className='text-secondary'><MdAirlineSeatReclineExtra size={25} /> Sièges</p><h5>{car.seater}</h5></td>
                                    <td className='p-3'><p className='text-secondary'><MdCompareArrows size={25} /> Taille</p><h5>{car.size}</h5></td>
                                </tr>
                                <tr>
                                    <td className='p-3'><p className='text-secondary'><MdOutlinePropaneTank size={25} /> Réservoir</p><h5>{car.fuelTank}</h5></td>
                                    <td className='p-3'><p className='text-secondary'><AiOutlineColumnWidth size={25} /> Taille moteur</p><h5>{car.engineSize}</h5></td>
                                    <td className='p-3'><p className='text-secondary'><AiOutlineNodeIndex size={25} /> Transmission</p><h5>{car.transmission}</h5></td>
                                </tr>
                            </thead>
                        </table>
                            <div className="mt-4 mb-4">
                                <h4 className="mb-3">Scanner ce code QR pour partager cette annonce</h4>
                                <div className="d-flex justify-content-start align-items-center">
                                    <div className="border border-2 rounded p-2 bg-white" style={{ maxWidth: '150px' }}>
                                    <QRCodeSVG
                                        value={window.location.href}
                                        size={120}
                                        bgColor={"#ffffff"}
                                        fgColor={"#000000"}
                                        level={"H"} // Augmenté à High
                                        includeMargin={true} // Ajout de marge
                                        // Optionnel: retirez imageSettings temporairement pour tester
                                    />
                                    </div>
                                    <div className="ms-4">
                                    <p className="mb-1">Ce code QR contient:</p>
                                    <ul className="ps-3 mb-0">
                                        <li>Lien direct vers cette annonce</li>
                                        <li>Marque: {car.brand?.name}</li>
                                        <li>Modèle: {car.name}</li>
                                        <li>Prix: {car.price} TND</li>
                                    </ul>
                                    </div>
                                </div>
                                </div>
                                                </div>

                    <div className="container mt-5">
                        <div className="row">
                            <div className="col-12 text-center mb-5">
                                <h2 className="brand_title">Voitures liées de la marque <span style={{ color: '#d11a2a' }}>{car.brand?.name}</span></h2>
                            </div>
                            {relatedCar.length > 0 ? (
                                relatedCar.map((p) => (
                                    <div className="col-md-12 col-lg-3 mb-3 mb-lg-0 my-3" key={p._id}>
                                        <div className="card h-100">
                                            <div className="d-flex justify-content-between p-3">
                                                <p className="lead mb-0">{p.brand?.name}</p>
                                                <Link to={`/brand/${p.brand?.slug || ''}`} className="rounded-circle d-flex align-items-center justify-content-center shadow-1-strong" style={{ width: '35px', height: '35px' }}>
                                                    <img
                                                        src={getImageUrl(p.brand.brandPictures)}
                                                        alt={p.brand.name}
                                                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                                    />
                                                </Link>
                                            </div>
                                            <Link to={`/car/${p.slug}`} className='text-center'>
                                                <img
                                                    src={getImageUrl(Array.isArray(p.productPictures) && p.productPictures.length > 0 ? p.productPictures[0] : null)}
                                                    alt={p.name}
                                                    style={{ 
                                                        width: '100%', 
                                                        height: '150px', 
                                                        objectFit: 'contain',
                                                        backgroundColor: '#f8f9fa' 
                                                    }}
                                                    className='border rounded p-2'
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = '/images/default-car.jpg';
                                                    }}
                                                />
                                            </Link>
                                            <div className="card-body">
                                                <h4 className="text-center mb-4">{p.name}</h4>
                                                <div className="d-flex justify-content-between">
                                                    <h6><PiCurrencyInrFill /> : {p.price}</h6>
                                                    <h6><BsFuelPumpFill /> : {p.fuelType}</h6>
                                                </div>
                                                <div className="d-flex justify-content-between my-2">
                                                    <h6><TbStars /> : {p.safetyrating}</h6>
                                                    <h6><MdAirlineSeatReclineExtra /> : {p.seater} Sièges</h6>
                                                </div>

                                                <div className="d-flex justify-content-center mb-2">
                                                    <QRCodeSVG
                                                        value={`${window.location.origin}/car/${p.slug}`}
                                                        size={80}
                                                        bgColor={"#ffffff"}
                                                        fgColor={"#000000"}
                                                        level={"H"} // Augmenté à High
                                                        includeMargin={true} // Ajout de marge
                                                    />
                                                    </div>

                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-md-12 text-center">
                                    <h4>Aucune voiture liée disponible pour {car.brand?.name} pour le moment.</h4>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CarView;