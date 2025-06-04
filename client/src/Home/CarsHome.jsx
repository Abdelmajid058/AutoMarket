import React, { useEffect, useState } from 'react'
import { useCart } from '../context/cart';
import { Link } from 'react-router-dom';
import '../styles/brands.css'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { AiOutlineEye } from 'react-icons/ai'
import { MdAirlineSeatReclineExtra } from 'react-icons/md'
import { BsFuelPumpFill } from 'react-icons/bs'
import { TbStars } from 'react-icons/tb'
import { PiCurrencyInrFill } from 'react-icons/pi'
import toast from 'react-hot-toast';
import { AiFillCar } from 'react-icons/ai'
import { ColorRing } from 'react-loader-spinner'
import { QRCodeSVG } from 'qrcode.react';



const CarsHome = () => {
    const [cars, setcars] = useState([]);
    const [cart, setcart] = useCart()
    const [loading, setLoading] = useState(true);


    const getImageUrl = (path) => {
        if (!path) return '/images/default-car.jpg'; // Place cette image dans /public/images/
        return path.startsWith('http') ? path : `${process.env.REACT_APP_API_URL}/${path}`;
    };

    const getAllcars = async () => {
        try {
            const data = await fetch(`${process.env.REACT_APP_API_URL}/api/car/getAll-car`, {
                method: "GET",
                headers: { "Content-type": "application/json" }
            })
            const data_ = await data.json()
            setcars(data_.cars.reverse())
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(true);
        }
    };

    const notify = () => toast.success('Added to Cart Successfully')

    useEffect(() => {
        getAllcars();
    }, []);

    return (
        <>
            <div className="brand_wrapper" id='cars'>
                <div className="col-12 text-center">
                    <p className="brand_subtitle">Découvrez une sélection de nouvelles voitures passionnantes !</p>
                    <h2 className="brand_title">Découvrez les nouveautés automobiles</h2>
                </div>
            </div>
            {loading ?
                <div className="h-100 d-flex align-items-center justify-content-center">
                    <ColorRing
                        visible={true}
                        colors={['#000435', 'rgb(14 165 233)', 'rgb(243 244 246)', '#000435', 'rgb(14 165 233)']}
                    />
                </div>
                :
                <div className="container">
                    <div className="row" style={{ marginTop: '-40px' }}>
                        {cars.slice(0, 8).map((p) => (
                            <div className="col-md-12 col-lg-3 mb-3 mb-lg-0 my-3" key={p._id}>
                                <div className="card">
                                    <div className="d-flex justify-content-between p-3">
                                        <p className="lead mb-0 respBrand">{p.brand.name}</p>
                                        <div
                                            className=" rounded-circle d-flex align-items-center justify-content-center shadow-1-strong"
                                            style={{ width: '35px', height: '35px' }}>
                                            
                                            <Link to={`/brand/${p.brand.name}`} className="rounded-circle d-flex align-items-center justify-content-center shadow-1-strong" style={{ width: '40px', height: '40px' }}>
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
                                    <div className="card-body ">
                                        <h4 className="text-center mb-4 respName">{p.name}</h4>
                                        <div className="d-flex justify-content-between">
                                            <h6 className='respBrand'><PiCurrencyInrFill /> : {p.price} TND</h6>
                                            <h6 className='respBrand'><BsFuelPumpFill /> : {p.fuelType}</h6>
                                        </div>
                                        <div className="d-flex justify-content-between my-2">
                                            <h6 className='respBrand'><TbStars /> : {p.safetyrating}</h6>
                                            <h6 className='respBrand'><MdAirlineSeatReclineExtra /> : {p.seater} Seater</h6>
                                        </div>
                                        <div className='text-center'>
                                            <div className="d-flex flex-column align-items-center mb-2">
                                            <QRCodeSVG
                                                value={`${window.location.origin}/car/${p.slug}`}
                                                size={80}
                                                bgColor={"#ffffff"}
                                                fgColor={"#000000"}
                                                level={"H"} // Augmenté à High
                                                includeMargin={true} // Ajout de marge
                                            />
                                                <small className="text-muted mt-1">Scanner pour détails</small>
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="col-12 text-center my-5">
                        <Link to='/cars' className='btn btn-lg text-white' style={{ backgroundColor: '#d11a2a' }}>
                            View More <AiFillCar size={25} />
                        </Link>
                    </div>
                </div>
            }
        </>
    )
}

export default CarsHome