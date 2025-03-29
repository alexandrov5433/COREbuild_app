import './footer.css';
import logo from '../../../assets/COREbuild.svg';
import { NavLink } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faFacebookSquare, faSquareXTwitter, faTiktok } from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
    return (
        <footer>
            <div className="container">
                <div className="sizingWrapper">
                    <div className="about">
                        <h3>About <img src={logo} alt="COREbuild logo" className='logo-svg' /></h3>
                        <p>At COREbuild, we believe that powerful technology should be accessible to everyone. That's why we offer a carefully curated selection of the latest processors, graphics cards, motherboards, RAM, storage solutions, and more—at competitive prices.</p>
                    </div>
                </div>
                <div className="sizingWrapper">
                    <div className="useful-links">
                        <h3>Useful Links</h3>
                        <ul>
                            <li>
                                <NavLink to='terms' className='link'>Terms &amp; Services</NavLink>
                            </li>
                            <li>
                                <NavLink to='privacy' className='link'>Privacy Policy</NavLink>
                            </li>
                            <li>
                                <NavLink to='products-catalog' className='link'>Products</NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="sizingWrapper">
                    <div className="social-links">
                        <h3>Social Links</h3>
                        <ul>
                            <li>
                                <NavLink to='https://www.linkedin.com/' className='icon' target='_blank'><FontAwesomeIcon icon={faLinkedin} />LinkedIn</NavLink>
                            </li>
                            <li>
                                <NavLink to='https://www.facebook.com/' className='icon' target='_blank'><FontAwesomeIcon icon={faFacebookSquare} />Facebook</NavLink>
                            </li>
                            <li>
                                <NavLink to='https://x.com/' className='icon' target='_blank'><FontAwesomeIcon icon={faSquareXTwitter} />Ex</NavLink>
                            </li>
                            <li>
                                <NavLink to='https://www.tiktok.com/' className='icon' target='_blank'><FontAwesomeIcon icon={faTiktok} />TikTok</NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className='dev-info'>
                <p>Created by <NavLink to='https://www.linkedin.com/in/aleksandar-darakev-4094b8347/' className='my-social-link' target='_blank'>Alex</NavLink></p>
            </div>
        </footer>
    );
}