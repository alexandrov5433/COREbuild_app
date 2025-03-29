import styles from '../../../lib/styling/formal.module.css';
import { useEffect } from 'react';
import { NavLink } from 'react-router';

export default function Terms() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className={styles.wrapper}>
            <h1>Terms of Service</h1>
            <p>Effective Date: 29.03.2025</p>
            <p>Last Updated: 28.03.2025</p>
            <p>Welcome to COREbuild! These Terms of Service ("Terms") govern your use of our website, services, and products. By accessing or using our platform, you agree to be bound by these Terms. If you do not agree, please do not use our services.</p>
            <hr />
            <h2>1. Introduction</h2>
            <p>COREbuild is a premier online retailer specializing in high-quality PC components and software. Our mission is to provide cutting-edge technology to consumers and businesses worldwide. These Terms outline your rights and responsibilities when using our website and services.</p>

            <hr />
            <h2>2. Definitions</h2>
            <ul>
                <li>
                    <p>"Company", "we", "us", or "our" refers to COREbuild, located at 123 Tech Street, Suite 456, Tech City, TC 78910.</p>
                </li>
                <li>
                    <p>"User", "you", or "your" refers to any individual or entity accessing our services.</p>
                </li>
                <li>
                    <p>"Services" refers to our website, online store, and related offerings.</p>
                </li>
                <li>
                    <p>"Products" refers to all hardware, software, and accessories available for sale.</p>
                </li>
            </ul>

            <hr />
            <h2>3. Eligibility</h2>
            <p>By using our services, you represent that you are at least 18 years old or have legal parental/guardian consent. You also confirm that you have the legal capacity to enter into this agreement.</p>

            <hr />
            <h2>4. Account Registration</h2>
            <p>To make purchases, track orders, and access certain features, you may need to create an account. When registering, you agree to:</p>
            <ul>
                <li>
                    <p>Provide accurate and complete information.</p>
                </li>
                <li>
                    <p>Keep your login credentials secure.</p>
                </li>
                <li>
                    <p>Notify us immediately of any unauthorized access to your account.</p>
                </li>
            </ul>
            <p>We reserve the right to suspend or terminate accounts that violate these Terms.</p>

            <hr />
            <h2>5. Purchases and Payment</h2>
            <ul>
                <li>
                    <p>All purchases are subject to product availability.</p>
                </li>
                <li>
                    <p>Prices are displayed in Euro and include applicable taxes unless otherwise stated.</p>
                </li>
                <li>
                    <p>We accept major credit cards, PayPal, and other payment methods as specified at checkout.</p>
                </li>
                <li>
                    <p>By completing a purchase, you agree to pay all applicable fees.</p>
                </li>
                <li>
                    <p>Orders may be canceled or modified before shipping. Once shipped, returns must comply with our Return Policy.</p>
                </li>
            </ul>

            <hr />
            <h2>6. Shipping and Delivery</h2>
            <ul>
                <li>
                    <p>We ship to select locations worldwide.</p>
                </li>
                <li>
                    <p>Shipping times and costs are displayed at checkout.</p>
                </li>
                <li>
                    <p>We are not responsible for delays caused by couriers or customs.</p>
                </li>
                <li>
                    <p>Risk of loss and title for purchased items pass to you upon delivery.</p>
                </li>
            </ul>

            <hr />
            <h2>7. Returns and Refunds</h2>
            <p>Our return policy allows customers to return eligible items within 30 days of delivery. Items must be unused and in their original packaging. Refunds will be issued based on the original payment method. See our Return Policy for full details.</p>

            <hr />
            <h2>8. Warranty and Liability</h2>
            <ul>
                <li>
                    <p>Most products sold by COREbuild include a manufacturer's warranty.</p>
                </li>
                <li>
                    <p>We do not guarantee compatibility between different products unless explicitly stated.</p>
                </li>
                <li>
                    <p>COREbuild is not liable for damages resulting from improper installation, use, or modification of purchased products.</p>
                </li>
            </ul>

            <hr />
            <h2>9. Prohibited Conduct</h2>
            <p>Users agree not to:</p>
            <ul>
                <li>
                    <p>Use our services for illegal purposes.</p>
                </li>
                <li>
                    <p>Engage in fraudulent activities.</p>
                </li>
                <li>
                    <p>Violate intellectual property rights.</p>
                </li>
                <li>
                    <p>Attempt to gain unauthorized access to our systems.</p>
                </li>
            </ul>
            <p>Violations may result in termination of service and legal action.</p>

            <hr />
            <h2>10. Intellectual Property</h2>
            <p>All content on our website, including text, images, and logos, is owned by COREbuild or its licensors. Unauthorized reproduction, distribution, or modification is prohibited.</p>

            <hr />
            <h2>11. Privacy Policy</h2>
            <p>Your use of our services is also governed by our <NavLink to={'/privacy'}>Privacy Policy</NavLink>, which outlines how we collect, use, and protect your data. By using our services, you consent to our data practices.</p>

            <hr />
            <h2>12. Third-Party Links</h2>
            <p>Our website may contain links to third-party websites. We are not responsible for their content, policies, or practices.</p>

            <hr />
            <h2>13. Termination</h2>
            <p>We reserve the right to suspend or terminate access to our services if a user violates these Terms or engages in prohibited conduct.</p>

            <hr />
            <h2>14. Dispute Resolution</h2>
            <p>In case of disputes, users agree to first attempt to resolve the issue with COREbuild's customer service. If unresolved, disputes will be subject to arbitration under the laws of Germany.</p>

            <hr />
            <h2>15. Changes to These Terms</h2>
            <p>COREbuild reserves the right to update these Terms at any time. Changes take effect upon posting. Continued use of our services indicates acceptance of updated Terms.</p>

            <hr />
            <h2>16. Contact Information</h2>
            <p>For questions about these Terms, <NavLink to={'/contact'}>contact</NavLink> us at:</p>
            <ul>
                <li>
                    <p>Email: corebuildshop@gmail.com</p>
                </li>
                <li>
                    <p>Phone: +49 123456789</p>
                </li>
                <li>
                    <p>Address: 123 Tech Street, Suite 456, Tech City, TC 78910</p>
                </li>
            </ul>

            <hr />
            <p>Thank you for choosing COREbuild!</p>

        </div>
    );
}