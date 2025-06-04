// UserOrder.jsx
import React, { useEffect, useState } from 'react';
import UserMenu from './UserMenu';
import axios from 'axios';
import { useAuth } from '../context/auth';
import moment from 'moment';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const UserOrder = () => {
    const [order, setOrder] = useState([]); //
    const [auth, setAuth] = useAuth(); //

     // ✅ Utilitaire pour obtenir une URL d'image complète ou une image par défaut
    const getImageUrl = (path) => {
        if (!path) return '/images/default-car.jpg'; // Place cette image dans /public/images/
        return path.startsWith('http') ? path : `${process.env.REACT_APP_API_URL}/${path}`;
    };

    const getOrders = async () => { //
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/orders`); //
            setOrder(data); //
        } catch (err) {
            toast.error('Server Error'); //
        }
    };

    useEffect(() => { //
        if (auth?.token) getOrders(); //
        window.scrollTo(0, 0) //
    }, [auth?.token]); //

    return (
        <div className='container marginStyle'>
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-md-3'>
                        <UserMenu />
                    </div>
                    <div className='col-md-9 my-3'>
                        <div className="col-md-12">
                            <h1 className="text-center">My Orders</h1>
                            {order?.map((o, i) => ( //
                                <>
                                    <div className="table-responsive">
                                        <table className="table table-bordered text-center">
                                            <thead className='table-dark'>
                                                <tr>
                                                    <td scope="col">Id</td>
                                                    <td scope="col">Status</td>
                                                    <td scope="col">Buyer</td>
                                                    <td scope="col">Date</td>
                                                    {/* Removed Payment column */}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr key={i}>
                                                    <td>{i + 1}</td>
                                                    <td>
                                                        <span className="badge text-bg-primary">{o?.status}</span>
                                                    </td>
                                                    <td>{o?.buyer?.name}</td>
                                                    <td>{moment(o?.createdAt).fromNow()}</td>
                                                    {/* Removed payment status display */}
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="container">
                                        {o?.products?.map((p, i) => ( //
                                            <div className="row my-2 p-3 card flex-row text-center" key={p._id}>
                                                <div className="col-md-4">
                                                    <Link to={`/car/${p.slug}`} className='text-center'>
                                                        <img
                                                            className="border rounded"
                                                            src={getImageUrl(p.productPictures[0])}
                                                            alt={p.name}
                                                            style={{ maxWidth: '100%', maxHeight: '120px', objectFit: 'contain' }}
                                                        />
                                                    </Link>
                                                </div>
                                                <div className="col-md-8">
                                                    <p>{p.name}</p>
                                                    <p>{p.price} TND</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserOrder;