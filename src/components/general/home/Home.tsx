import styles from './home.module.css';

import banner from '../../../assets/banners/banner.png';
import banner1 from '../../../assets/banners/banner-1.png';
import banner2 from '../../../assets/banners/banner-2.png';
import banner3 from '../../../assets/banners/banner-3.png';
import banner4 from '../../../assets/banners/banner-4.png';
import banner5 from '../../../assets/banners/banner-5.png';
import { NavLink } from 'react-router';

export default function Home() {
    return (
        <div className={styles.wrapper}>

            <div id="carouselExampleAutoplaying" className={`carousel slide ${styles.carouselBody}`} data-bs-ride="carousel">
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <NavLink to={'/products-catalog'}>
                            <img src={banner} className="d-block w-100" alt="First banner image." />
                        </NavLink>
                    </div>
                    <div className="carousel-item">
                        <NavLink to={'/products-catalog'}>
                            <img src={banner1} className="d-block w-100" alt="Second banner image." />
                        </NavLink>
                    </div>
                    <div className="carousel-item">
                        <NavLink to={'/products-catalog'}>
                            <img src={banner2} className="d-block w-100" alt="Third banner image." />
                        </NavLink>
                    </div>
                    <div className="carousel-item">
                        <NavLink to={'/products-catalog'}>
                            <img src={banner3} className="d-block w-100" alt="Fourth banner image." />
                        </NavLink>
                    </div>
                    <div className="carousel-item">
                        <NavLink to={'/products-catalog'}>
                            <img src={banner4} className="d-block w-100" alt="Fifth banner image." />
                        </NavLink>
                    </div>
                    <div className="carousel-item">
                        <NavLink to={'/products-catalog'}>
                            <img src={banner5} className="d-block w-100" alt="Sixth banner image." />
                        </NavLink>
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
            
        </div>
    );
}