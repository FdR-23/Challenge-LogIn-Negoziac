import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './Navbar.jsx';
import ListClient from './ListClients/ListClient.jsx';
import MenuFilters from './MenuFilters/MenuFilters.jsx';
import Loading from './Loading.jsx';
import { statusSession } from '../redux/actions/index.js';


const Home = () => {
    const navigate = useNavigate()
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true)
    const data = useSelector(state => state.token)


    const handleToggle = () => {
        setOpen(!open)
    }

    useEffect(() => {
        if (!data) {
            return navigate('*')
        } else {
            const session = async (token) => {
                const data = await statusSession(token)
                if (data) {
                    if (data.status === 200) {
                        setLoading(false)
                    } else if (data.status === 404 | 401) {
                        alert("Error: " + data.status + " " + data.data.message)
                        navigate('*')
                    }
                } else {
                    return navigate('*')
                }
            }
            session(data.token)
        }
    }, [navigate, data]);


    if (loading) {
        return <Loading />
    } else {
        return (
            <div className=' m-auto flex flex-col w-full  h-screen'>
                <Navbar />

                <div
                    className='flex flex-row  h-full mt-2 mx-1'>

                    <aside
>
                        <MenuFilters
                            toggleopen={open}
                            handleToggle={handleToggle} />
                        <button
                            className={`${open ? 'hidden' :
                                'bg-indigo-600  m-2 p-2 h-7 rounded-md flex justify-center items-center absolute top-16 '}
                            sm:hidden`}
                            onClick={() => handleToggle()}>{!open &&
                                <p className='font-bold text-white'>MENU</p>}
                        </button>
                    </aside>

                    <section
                        className='w-full sm:ml-2'>
                        <ListClient />
                    </section>
                </div>


            </div>
        )
    }
}


export default Home








