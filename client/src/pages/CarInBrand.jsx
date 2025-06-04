import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/brands.css';
import { useCart } from '../context/cart';
import { Link } from 'react-router-dom';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { AiOutlineEye } from 'react-icons/ai';
import { MdAirlineSeatReclineExtra } from 'react-icons/md';
import { BsFuelPumpFill } from 'react-icons/bs';
import { TbStars } from 'react-icons/tb';
import { PiCurrencyInrFill } from 'react-icons/pi';
import toast from 'react-hot-toast';
import { ColorRing } from 'react-loader-spinner';

const CarInBrand = () => {
    const params = useParams();
    const [brand, setBrand] = useState({ name: '', brandPictures: '', carInvoleInThisBrand: [] });
    const [cart, setcart] = useCart();
    const [loading, setLoading] = useState(true);

    const getImageUrl = (path) => {
        if (!path) return '/images/default-car.jpg';
        return path.startsWith('http') ? path : `${process.env.REACT_APP_API_URL}/${path}`;
    };

    const getCar = useCallback(async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/brand/getBrandBtId-brand/${params.slug}`);
            setBrand(data.brand);
            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(true); // Keep loading true on error to indicate something went wrong or data is not available
        }
    }, [params.slug]);

    const notify = () => toast.success('Added to Cart Successfully');

    useEffect(() => {
        getCar();
        window.scrollTo(0, 0);
    }, [getCar]); // Added getCar to the dependency array

    return (
        <div>
            <section id="brands" className="brand_wrapper">
                <div className="container">
                    <div className="row">
                        <div className="col-12 text-center mb-2">
                            <p className="brand_subtitle" style={{ color: '#495057' }}>Brand Collection !</p>
                            <h2 className="brand_title" style={{ color: '#212529' }}>{brand.name} Car showcase</h2>
                        </div>
                    </div>
                    {loading ? (
                        <div className="h-100 d-flex align-items-center justify-content-center">
                            <ColorRing
                                visible={true}
                                colors={['#000435', '#0ea5e9', '#f3f4f6', '#000435', '#0ea5e9']}
                            />
                        </div>
                    ) : (
                        <div className="row justify-content-center">
                            <div className="col-lg-3 col-md-4 col-sm-6 showcase_card">
                                <img
                                    decoding="async"
                                    src={brand.brandPictures}
                                    className="mb-4 img-fluid"
                                    style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                                    alt={`${brand.name} brand`}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <div className="container">
                <div className="row" style={{ marginBottom: '100px', marginTop: '-40px' }}>
                    <div className="col-12 text-center mb-5">
                        <h2 className="brand_title" style={{ color: '#212529' }}>Available {brand.name} Cars in Stock</h2>
                    </div>

                    {loading ? (
                        <div className="h-100 d-flex align-items-center justify-content-center">
                            <ColorRing
                                visible={true}
                                colors={['#000435', '#0ea5e9', '#f3f4f6', '#000435', '#0ea5e9']}
                            />
                        </div>
                    ) : Array.isArray(brand.carInvoleInThisBrand) && brand.carInvoleInThisBrand.length > 0 ? (
                        brand.carInvoleInThisBrand.map((p) => (
                            <div className="col-md-12 col-lg-3 mb-3 mb-lg-0 my-3" key={p._id || p.slug}>
                                <div className="card" style={{ borderColor: '#4361ee' }}>
                                    <div className="d-flex justify-content-between p-3">
                                        <p className="lead mb-0" style={{ color: '#495057' }}>{brand.name}</p>
                                        <div
                                            className="rounded-circle d-flex align-items-center justify-content-center shadow-1-strong"
                                            style={{ width: '35px', height: '35px', backgroundColor: '#4361ee' }}>
                                            <p className="text-white mb-0 small" style={{ lineHeight: 1 }}>
                                                <img
                                                    src={getImageUrl(p.brand.brandPictures)}
                                                    alt={`${p.brand.name} logo`}
                                                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                                />
                                            </p>
                                        </div>
                                    </div>

                                    <Link to={`/car/${p.slug}`} className='text-center'>
                                        <img
                                            src={getImageUrl(Array.isArray(p.productPictures) && p.productPictures.length > 0 ? p.productPictures[0] : null)}
                                            alt={`${p.name} car`}
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
                                        <h4 className="text-center mb-4" style={{ color: '#212529' }}>{p.name}</h4>
                                        <div className="d-flex justify-content-between" style={{ color: '#495057' }}>
                                            <h6><PiCurrencyInrFill /> : {p.price}</h6>
                                            <h6><BsFuelPumpFill /> : {p.fuelType}</h6>
                                        </div>
                                        <div className="d-flex justify-content-between my-2" style={{ color: '#495057' }}>
                                            <h6><TbStars /> : {p.safetyrating}</h6>
                                            <h6><MdAirlineSeatReclineExtra /> : {p.seater} Seater</h6>
                                        </div>
                                        <div className='text-center'>
                                            <Link
                                                className='btn my-2'
                                                style={{ backgroundColor: '#4361ee', color: 'white' }}
                                                to={`/car/${p.slug}`}>
                                                <AiOutlineEye size={20} className='pb-1' /> View
                                            </Link>
                                            <button
                                                className='btn btn-outline-primary my-2 mx-3'
                                                style={{ borderColor: '#4361ee', color: '#4361ee' }}
                                                onClick={() => {
                                                    setcart([...cart, p]);
                                                    localStorage.setItem('cart', JSON.stringify([...cart, p]));
                                                    notify();
                                                }}>
                                                <AiOutlineShoppingCart size={20} className='pb-1' /> Add To Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center" style={{ color: '#495057' }}>
                            <p>No cars available for this brand at the moment.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CarInBrand;