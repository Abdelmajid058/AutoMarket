import React, { useEffect, useState } from 'react';
import AdminMenu from './AdminMenu';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BsFuelPumpFill } from 'react-icons/bs';
import { PiCurrencyInrFill } from 'react-icons/pi';
import toast from 'react-hot-toast';
import { ColorRing } from 'react-loader-spinner';
import { QRCodeSVG } from 'qrcode.react';

const Cars = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);

    // ✅ Utilitaire pour obtenir une URL d'image complète ou une image par défaut
    const getImageUrl = (path) => {
        if (!path) return '/images/default-car.jpg'; // Place cette image dans /public/images/
        return path.startsWith('http') ? path : `${process.env.REACT_APP_API_URL}/${path}`;
    };

    const getAllCars = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/car/getAll-car`);
            const data = await res.json();
            setCars(data.cars.reverse());
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const { data } = await axios.delete(`${process.env.REACT_APP_API_URL}/api/car/delete-car/${id}`);
            if (data?.success) {
                toast.success('Car Deleted Successfully');
                getAllCars();
            } else {
                toast.error('Error in Deleting car');
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getAllCars();
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="container marginStyle">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <h1 className="text-center my-3">All Cars List</h1>
                        {loading ? (
                            <div className="h-100 d-flex align-items-center justify-content-center">
                                <ColorRing
                                    visible={true}
                                    colors={['#000435', 'rgb(14 165 233)', 'rgb(243 244 246)', '#000435', 'rgb(14 165 233)']}
                                />
                            </div>
                        ) : (
                            <div className="row mt-0">
                                {cars.map((p) => (
                                    <div className="col-md-12 col-lg-4 mb-4" key={p._id}>
                                        <div className="card h-100">
                                            <div className="d-flex justify-content-between p-3">
                                                <p className="lead mb-0">{p.brand.name}</p>
                                                <Link to={`/brand/${p.brand.name}`} className="rounded-circle d-flex align-items-center justify-content-center shadow-1-strong" style={{ width: '40px', height: '40px' }}>
                                                    <img
                                                        src={getImageUrl(p.brand.brandPictures)}
                                                        alt={p.brand.name}
                                                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                                    />
                                                </Link>
                                            </div>

                                            <Link to={`/dashboard/admin/car/${p.slug}`} className="text-center">
                                                <img
                                                    className="border rounded"
                                                    src={getImageUrl(p.productPictures[0])}
                                                    alt={p.name}
                                                    style={{ maxWidth: '100%', maxHeight: '120px', objectFit: 'contain' }}
                                                />
                                            </Link>

                                            <div className="card-body d-flex flex-column justify-content-between">
                                                <h4 className="text-center mb-3">{p.name}</h4>
                                                <div className="d-flex justify-content-between mb-2">
                                                    <h6><PiCurrencyInrFill /> : {p.price} TND</h6>
                                                    <h6><BsFuelPumpFill /> : {p.fuelType}</h6>
                                                </div>
                                                <div className="text-center mt-auto">
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
                                                    <Link className="btn mt-2 text-white" to={`/car/${p.slug}`} style={{ backgroundColor: '#d11a2a' }}>
                                                        View
                                                    </Link>
                                                    <Link to={`/dashboard/admin/car/${p.slug}`} className="btn btn-primary mt-2 mx-2">
                                                        Update
                                                    </Link>
                                                    <button onClick={() => handleDelete(p._id)} className="btn btn-danger mt-2">
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cars;
