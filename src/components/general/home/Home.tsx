import styles from './home.module.css';

import banner from '../../../assets/banners/banner.png';
import banner1 from '../../../assets/banners/banner-1.png';
import banner2 from '../../../assets/banners/banner-2.png';
import banner3 from '../../../assets/banners/banner-3.png';
import banner4 from '../../../assets/banners/banner-4.png';
import banner5 from '../../../assets/banners/banner-5.png';
import prebuild from '../../../assets/prebuild.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCheck, faPhone } from '@fortawesome/free-solid-svg-icons';

import { NavLink } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import { ProductData, ProductsCatalogQueryParams } from '../../../lib/definitions';
import productsCatalog from '../../../lib/actions/product/productsCatalog';
import ProductCard from '../../product/productsCatalog/productCard/ProductCard';

export default function Home() {
    const [prodcuts, setProducts] = useState([] as Array<ProductData>);

    const mostUpperElementRef = useRef(null);

    useEffect(() => {
        (async () => {
            const queryParams: ProductsCatalogQueryParams = {
                currentPage: 1,
                itemsPerPage: 8,
                availableInStock: 'yes'
            };
            const actionResult = await productsCatalog(queryParams);
            if (actionResult.responseStatus === 200) {
                setProducts(actionResult.data!);
            }
        })();
    }, []);

    useEffect(() => {
        (mostUpperElementRef.current! as HTMLDivElement)?.scrollIntoView({behavior: 'instant'});
    }, []);

    return (
        <div className={styles.homeWrapper} ref={mostUpperElementRef}>
            <h1>The <i>CORE</i> of your experience!</h1>

            <div id="carouselExampleAutoplaying" className={`carousel slide ${styles.carouselBody}`} data-bs-ride="carousel">
                <div className="carousel-inner">
                    <div className="carousel-item active" data-bs-interval="3500">
                        <NavLink to={'/products-catalog'}>
                            <img src={banner} className="d-block w-100" alt="First banner image." />
                        </NavLink>
                    </div>
                    <div className="carousel-item" data-bs-interval="3500">
                        <NavLink to={'/products-catalog'}>
                            <img src={banner1} className="d-block w-100" alt="Second banner image." />
                        </NavLink>
                    </div>
                    <div className="carousel-item" data-bs-interval="3500">
                        <NavLink to={'/products-catalog'}>
                            <img src={banner2} className="d-block w-100" alt="Third banner image." />
                        </NavLink>
                    </div>
                    <div className="carousel-item" data-bs-interval="3500">
                        <NavLink to={'/products-catalog'}>
                            <img src={banner3} className="d-block w-100" alt="Fourth banner image." />
                        </NavLink>
                    </div>
                    <div className="carousel-item" data-bs-interval="3500">
                        <NavLink to={'/products-catalog'}>
                            <img src={banner4} className="d-block w-100" alt="Fifth banner image." />
                        </NavLink>
                    </div>
                    <div className="carousel-item" data-bs-interval="3500">
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
            <div className={styles.videosContainer}>
                <section>
                    <h4>Looking for a top-tier gaming configuration?</h4>
                    <p className="lead">Building the ultimate gaming PC can be overwhelming with so many choices available. That's why we've got you covered! In this featured review, we take an in-depth look at one of the most powerful gaming rigs on the market.</p>

                    <iframe className='video'
                        title='Youtube player'
                        sandbox='allow-same-origin allow-forms allow-popups allow-scripts allow-presentation'
                        src={`https://youtube.com/embed/yQfhTh5hyxk?autoplay=0`}>
                    </iframe>

                </section>
                <section>
                    <h4>Finding the Perfect Gaming Monitor: What You Need to Know</h4>
                    <p className="lead">Choosing the right gaming monitor is just as important as picking a powerful PC. A great display can enhance your gaming experience, providing smoother visuals, better colors, and faster response times. But with so many options—refresh rates, resolutions, panel types—how do you decide?</p>

                    <iframe className='video'
                        title='Youtube player'
                        sandbox='allow-same-origin allow-forms allow-popups allow-scripts allow-presentation'
                        src={`https://youtube.com/embed/mtA4hqZb4IE?autoplay=0`}>
                    </iframe>
                </section>
                {/* this portion yQfhTh5hyxk is the variable */}
            </div>
            <div className={styles.prebuildContainer}>
                <section className={styles.prebuildImage}>
                    <img src={prebuild} alt="" />
                </section>
                <section className={styles.infos}>
                    <h4>Prebuilt Gaming PC</h4>
                    <p className='lead'>Start your gaming journey with one of our professionally designed prebuilt systems.</p>
                    <NavLink to={`/products-catalog?currentPage=1&itemsPerPage=12&name=&category=prebuild&priceFrom=&priceTo=&availableInStock=yes&manufacturer=`} className="btn btn-outline-warning">Shop Now</NavLink>
                </section>
            </div>
            <div className={styles.servicesContainer}>
                <div className={styles.contentContainer}>
                    <h4>Our most wanted PC services</h4>
                    <ul>
                        <li>
                            <p><FontAwesomeIcon icon={faSquareCheck} />Building & Shipping</p>
                        </li>
                        <li>
                            <p><FontAwesomeIcon icon={faSquareCheck} />Cleaning & Repair</p>
                        </li>
                        <li>
                            <p><FontAwesomeIcon icon={faSquareCheck} />Configuration</p>
                        </li>
                        <li>
                            <p><FontAwesomeIcon icon={faSquareCheck} />Recycling Of Old Parts</p>
                        </li>
                    </ul>
                </div>
            </div>
            {
                !prodcuts.length ? '' :
                    <>
                        <h2>Featured products</h2>
                        <div className={styles.featuredProdcutsContainerWrapper}>
                            <div className={`row row-cols-1 row-cols-md-4 g-4 ${styles.featuredProdcutsContainer}`}>
                                {
                                    prodcuts.map(p => <ProductCard {...p} key={p.productID} />)
                                }
                            </div>
                        </div>
                    </>
            }
            <div className={styles.browseProdcutsButtonContainer}>
                <NavLink className="btn btn-success" to={'/products-catalog'}>Browse All Prodcuts</NavLink>
            </div>
      
            <div className={styles.contactUsContainer}>
                <div className={styles.contentContainer}>
                    <h4>Need assistance?</h4>
                    <p>No problem! Our customer service is here to help.</p>
                    <NavLink className="btn btn-outline-warning" to={'/contact-us'}><FontAwesomeIcon icon={faPhone} />Contact Us</NavLink>
                </div>
            </div>
        </div>
    );
}