import styles from './about.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb, faUser } from '@fortawesome/free-regular-svg-icons';
import { faCheckDouble } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router';

export default function About() {
    return (
        <div className={styles.mainContainer}>
            <h1>More About Us</h1>
            <section>
                <h2>Your Trusted Source for PC Parts & Software</h2>
                <p className="lead">Welcome to COREbuild, your one-stop destination for premium PC components and cutting-edge software solutions. Whether you're a gamer, content creator, or IT professional, we provide high-quality products to power your ultimate setup.</p>
            </section>

            <section className={styles.whoAreWe}>
                <h2>Who We Are</h2>
                <p className="lead">At COREbuild, we are passionate about technology. Founded by a team of dedicated PC enthusiasts, we understand the importance of performance, reliability, and innovation. Our mission is to help you build, upgrade, and optimize your system with top-tier components from the industry's leading brands.</p>
            </section>

            <section>
                <h2>Our Commitment to Quality</h2>
                <p className="lead">We know that building a PC is an investment, and we strive to offer only the best products on the market. Our team carefully selects each component to ensure high performance, durability, and compatibility. Whether you're looking for the latest graphics cards, processors, memory kits, or software licenses, you can trust COREbuild to deliver quality you can rely on.</p>
            </section>

            <section className={styles.choose}>
                <h2>Why Choose COREbuild?</h2>
                <div>
                    <h3>Expert Support</h3>
                    <p>Our knowledgeable team is here to guide you in making the best choices for your setup.</p>
                </div>
                <div>
                    <h3>Wide Selection</h3>
                    <p>From high-performance gaming hardware to professional-grade software, we have it all.</p>
                </div>
                <div>
                    <h3>Competitive Pricing</h3>
                    <p>We offer fair and transparent pricing, ensuring you get the best value for your investment.</p>
                </div>
                <div>
                    <h3>Fast & Secure Shipping</h3>
                    <p>Get your components delivered safely and on time.</p>
                </div>
            </section>

            <section className={styles.values}>
                <h2>Our Vision & Values</h2>
                <div>
                    <h3><FontAwesomeIcon icon={faLightbulb} className={styles.yellow}/> Innovation</h3>
                    <p className="lead">We stay ahead of the curve, bringing you the latest advancements in PC hardware and software.</p>
                </div>
                <div>
                    <h3><FontAwesomeIcon icon={faUser} className={styles.green}/> Customer-Centric Approach</h3>
                    <p className="lead">Your satisfaction is our priority. We provide personalized recommendations and dedicated customer service.</p>
                </div>
                <div>
                    <h3><FontAwesomeIcon icon={faCheckDouble} className={styles.blue}/> Integrity & Transparency</h3>
                    <p className="lead">We believe in honest business practices, fair pricing, and high ethical standards.</p>
                </div>
            </section>

            <section>
                <h2>Join the COREbuild Community</h2>
                <p>We're more than just a store - we're a community of PC builders, gamers, and tech enthusiasts. Follow us on social media, read our latest tech guides, and engage with like-minded individuals.</p>
                <p>Ready to build your dream PC? Explore our <NavLink className={styles.link} to={'/products-catalog'}>collection</NavLink> today!</p>
            </section>

        </div>
    );
}