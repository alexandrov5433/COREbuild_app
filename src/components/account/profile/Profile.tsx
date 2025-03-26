import styles from './profile.module.css';
import { useState } from 'react';
import UserDetails from './userDetails/UserDetails';
import FavoriteProducts from './favoriteProducts/FavoriteProducts';
import { useAppSelector } from '../../../lib/hooks/reduxTypedHooks';

export default function Profile() {
    const userData = useAppSelector(state => state.user);
    const [tab, setTab] = useState('details'); // 'details' || 'favorites'

    return (
        <div className={`${styles.wrapper}`}>
            <h1>My Profile</h1>

            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <a className={`nav-link ${tab === 'details' ? 'active' : ''}`} aria-current="page" onClick={() => setTab('details')}>Details</a>
                </li>
                {
                    userData?.is_employee ? '' :
                        <li className="nav-item">
                            <a className={`nav-link ${tab === 'favorites' ? 'active' : ''}`} onClick={() => setTab('favorites')}>Favorites</a>
                        </li>
                }
            </ul>

            {
                tab === 'details' ? <UserDetails /> : <FavoriteProducts />
            }

        </div>
    );
}