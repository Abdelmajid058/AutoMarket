import React, { useEffect, useState } from 'react';
import { useCart } from '../context/cart';
import { Link } from 'react-router-dom';
import '../styles/brands.css';
import { AiOutlineShoppingCart, AiOutlineEye } from 'react-icons/ai';
import { MdAirlineSeatReclineExtra } from 'react-icons/md';
import { BsFuelPumpFill } from 'react-icons/bs';
import { TbStars } from 'react-icons/tb';
import { PiCurrencyInrFill } from 'react-icons/pi';
import toast from 'react-hot-toast';
import { Checkbox, Radio } from 'antd';
import axios from 'axios';
import { Price } from '../pages/Price';
import { ColorRing } from 'react-loader-spinner';
import { QRCodeSVG } from 'qrcode.react';

const CarsHome = () => {
    const [cars, setCars] = useState([]);
    const [cart, setCart] = useCart();
    const [brand, setBrand] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedPriceRange, setSelectedPriceRange] = useState(null);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const getImageUrl = (path) => {
        if (!path) return '/images/default-car.jpg';
        return path.startsWith('http') ? path : `${process.env.REACT_APP_API_URL}/${path}`;
    };

    const getAllBrand = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/brand/getAll-brand`);
            if (data.success) {
                setBrand(data.brands);
            }
            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(true);
        }
    };

    const getAllCars = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/car/getAll-car`, {
                method: "GET",
                headers: { "Content-type": "application/json" }
            });
            const data = await response.json();
            setCars(data.cars.reverse());
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(true);
        }
    };

    const handleBrandChange = (e, brandId) => {
        const isChecked = e.target.checked;
        if (isChecked) {
            setSelectedBrands((prev) => [...prev, brandId]);
        } else {
            setSelectedBrands((prev) => prev.filter((id) => id !== brandId));
        }
    };

    const handlePriceChange = (e) => {
        setSelectedPriceRange(e.target.value);
    };

    const resetFilters = () => {
        setSelectedBrands([]);
        setSelectedPriceRange(null);
        setSearch('');
    };

    const notify = () => toast.success('Added to Cart Successfully');

    useEffect(() => {
        getAllBrand();
        getAllCars();
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <div className="brand_wrapper" id='cars'>
                <div className="col-12 text-center">
                    <p className="brand_subtitle">Un large choix de voitures vous attend !</p>
                    <h2 className="brand_title">Sélection de voitures</h2>
                </div>
            </div>
            
            <div className="container">
                <div className="row" style={{ marginBottom: '100px', marginTop: '-50px' }}>
                    <div className='col-md-12 col-lg-3'>
                        <h4>🔎 Search Your Car</h4>
                        <div className="input-group d-flex flex-column row">
                            <div className="form-outline">
                                <input 
                                    type="search" 
                                    placeholder="🔎 Search your car..."
                                    onChange={(e) => setSearch(e.target.value)} 
                                    className="form-control" 
                                />
                            </div>
                        </div>
                        
                        <h4 className="mt-4">Filtrer par marques</h4>
                        <div className="d-flex flex-column">
                            {brand?.map((c) => (
                                <Checkbox
                                    key={c._id}
                                    onChange={(e) => handleBrandChange(e, c._id)}
                                    checked={selectedBrands.includes(c._id)}
                                >
                                    {c.name}
                                </Checkbox>
                            ))}
                        </div>
                        
                        <h4 className="mt-4">Trier par intervalle de prix</h4>
                        <div className="d-flex flex-column">
                            <Radio.Group onChange={handlePriceChange} value={selectedPriceRange}>
                                {Price?.map((p) => (
                                    <div key={p._id}>
                                        <Radio value={p.array}>{p.name}</Radio>
                                    </div>
                                ))}
                            </Radio.Group>
                        </div>
                        
                        <div className="d-flex flex-column">
                            <button
                                className="btn btn-outline-dark my-4"
                                onClick={resetFilters}
                            >
                                RESET FILTERS
                            </button>
                        </div>
                    </div>
                    
                    <div className="col-md-12 col-lg-9">
                        {loading ? (
                            <div className="h-100 d-flex align-items-center justify-content-center">
                                <ColorRing
                                    visible={true}
                                    colors={['#000435', 'rgb(14 165 233)', 'rgb(243 244 246)', '#000435', 'rgb(14 165 233)']}
                                />
                            </div>
                        ) : (
                            <div className="row">
                                {cars
                                    .filter((car) => 
                                        search.toString().toLowerCase() === '' 
                                            ? car 
                                            : car.name.toLowerCase().includes(search)
                                    )
                                    .filter((car) => 
                                        selectedBrands.length === 0 || selectedBrands.includes(car.brand._id)
                                    )
                                    .filter((car) => {
                                        if (!selectedPriceRange) return true;
                                        const [minPrice, maxPrice] = selectedPriceRange;
                                        return car.price >= minPrice && car.price <= maxPrice;
                                    })
                                    .map((p) => (
                                        <div className="col-md-12 col-lg-4 mb-3" key={p._id}>
                                            <div className="card h-100">
                                                <div className="d-flex justify-content-between p-3">
                                                    <p className="lead mb-0 respBrand">{p.brand.name}</p>
                                                    <div className="rounded-circle d-flex align-items-center justify-content-center shadow-1-strong"
                                                        style={{ width: '35px', height: '35px' }}>
                                                        <Link to={`/brand/${p.brand.slug}`}>
                                                            <img
                                                                src={getImageUrl(p.brand.brandPictures)}
                                                                alt={p.brand.name}
                                                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                                            />
                                                        </Link>
                                                    </div>
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
                                                
                                                <div className="card-body d-flex flex-column">
                                                    <h4 className="text-center mb-4 respName">{p.name}</h4>
                                                    
                                                    <div className="d-flex justify-content-between">
                                                        <h6 className='respBrand'><PiCurrencyInrFill /> : {p.price} TND</h6>
                                                        <h6 className='respBrand'><BsFuelPumpFill /> : {p.fuelType}</h6>
                                                    </div>
                                                    
                                                    <div className="d-flex justify-content-between my-2">
                                                        <h6 className='respBrand'><TbStars /> : {p.safetyrating}</h6>
                                                        <h6 className='respBrand'><MdAirlineSeatReclineExtra /> : {p.seater} Seater</h6>
                                                    </div>
                                                    
                                                    <div className='text-center mt-auto'>
                                                        <div className="d-flex flex-column align-items-center mb-2">
                                                            <QRCodeSVG
                                                                value={`${window.location.origin}/car/${p.slug}`}
                                                                size={80}
                                                                bgColor={"#ffffff"}
                                                                fgColor={"#000000"}
                                                                level={"H"}
                                                                includeMargin={true}
                                                            />
                                                            <small className="text-muted mt-1">Scanner pour détails</small>
                                                        </div>
                                                        
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CarsHome;