import './footer.css';
import logo from '../../assets/COREbuild.svg';
import { NavLink } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faFacebookSquare, faSquareXTwitter, faTiktok } from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
    return (
        <footer>
            <div className="container">
                <div className="about">
                    <h5>About <img src={logo} alt="COREbuild logo" className='logo-svg' /></h5>
                    <p>At COREbuild, we believe that powerful technology should be accessible to everyone. That's why we offer a carefully curated selection of the latest processors, graphics cards, motherboards, RAM, storage solutions, and more—at competitive prices.</p>
                </div>
                <div className="useful-links">
                    <h5>Useful Links</h5>
                    <ul>
                        <li>
                            <NavLink to='#' className='link'>Term &amp; Services</NavLink>
                        </li>
                        <li>
                            <NavLink to='#' className='link'>Privacy Policy</NavLink>
                        </li>
                        <li>
                            <NavLink to='#' className='link'>Products</NavLink>
                        </li>
                    </ul>
                </div>
                <div className="social-links">
                    <h5>Social Links</h5><i className="fa-brands fa-linkedin"></i>
                    <ul>
                        <li>
                            <NavLink to='#' className='icon'><FontAwesomeIcon icon={faLinkedin} />LinkedIn</NavLink>
                        </li>
                        <li>
                            <NavLink to='#' className='icon'><FontAwesomeIcon icon={faFacebookSquare} />Facebook</NavLink>
                        </li>
                        <li>
                            <NavLink to='#' className='icon'><FontAwesomeIcon icon={faSquareXTwitter} />Ex</NavLink>
                        </li>
                        <li>
                            <NavLink to='#' className='icon'><FontAwesomeIcon icon={faTiktok} />TikTok</NavLink>
                        </li>

                    </ul>
                </div>
            </div>
            <div className='dev-info'>
                <p>Created by <NavLink to='https://www.linkedin.com/in/aleksandar-darakev-4094b8347/' className='my-social-link'>Alex</NavLink></p>
            </div>
        </footer>
    );
}