// AdminOrders.jsx
import React, { useEffect, useState } from 'react'
import AdminMenu from './AdminMenu'
import { useAuth } from '../context/auth'
import moment from 'moment'
import axios from 'axios'
import { Select } from "antd";
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
const { Option } = Select;

const AdminOrders = () => {
    const [status, setStatus] = useState(["Not Process", "Processing", "Shipped", "deliverd", "cancel",]); //
    const [order, setOrder] = useState([]) //
    const [auth, setAuth] = useAuth() //

    // ✅ Utilitaire pour obtenir une URL d'image complète ou une image par défaut
    const getImageUrl = (path) => {
        if (!path) return '/images/default-car.jpg'; // Place cette image dans /public/images/
        return path.startsWith('http') ? path : `${process.env.REACT_APP_API_URL}/${path}`;
    };

    const getOrders = async () => { //
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/allOrders`) //
            setOrder(data) //
        } catch (err) {
            toast.error('Server Error') //
        }
    }

    useEffect(() => { //
        if (auth?.token) getOrders() //
        window.scrollTo(0, 0) //
    }, [auth?.token]) //

    const handleChange = async (orderId, value) => { //
        try {
            const { data } = await axios.put(`${process.env.REACT_APP_API_URL}/api/user/orderStatus/${orderId}`, { status: value, }); //
            getOrders(); //
            toast.success(`Order Changed to ${value}`) //
        } catch (error) {
            console.log(error); //
        }
    };

    return (
        <div className='container marginStyle'>
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-md-3'>
                        <AdminMenu />
                    </div>
                    <div className="col-md-9 my-3">
                        <h1 className="text-center">Manage Orders</h1>
                        {order?.map((o, i) => { //
                            return (
                                <>
                                    <div className="table-responsive">
                                        <table className="table table-bordered text-center">
                                            <thead className='table-dark'>
                                                <tr>
                                                    <td scope="col">Id</td>
                                                    <td scope="col">Status</td>
                                                    <td scope="col">Buyer</td>
                                                    <td scope="col"> date</td>
                                                    {/* Removed Payment column */}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <th>{i + 1}</th>
                                                    <th>
                                                        <Select
                                                            bordered={false}
                                                            onChange={(value) => handleChange(o._id, value)}
                                                            defaultValue={o?.status}
                                                            className=''
                                                        >
                                                            {status.map((s, i) => ( //
                                                                <Option key={i} value={s}>
                                                                    {s}
                                                                </Option>
                                                            ))}
                                                        </Select>
                                                    </th>
                                                    <th>{o?.buyer?.name}</th>
                                                    <th>{moment(o?.createdAt).fromNow()}</th>
                                                    
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
                                                <div className="col-md-8 ">
                                                    <p>{p.name}</p>
                                                    <p>{p.price} TND</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminOrders