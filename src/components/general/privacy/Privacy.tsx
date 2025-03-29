import styles from '../../../lib/styling/formal.module.css';
import { useEffect } from 'react';
import { NavLink } from 'react-router';

export default function Privacy() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className={styles.wrapper}>
        <h1>Privacy Policy</h1>
        <p>Effective Date: 29.03.2025</p>
        <p>Last Updated: 28.03.2025</p>

        <hr />
        <h2>1. Introduction</h2>
        <p>Welcome to COREbuild. Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website www.corebuild.xyz and purchase our products and services. By using our Website, you consent to the practices described in this policy.</p>

        <hr />
        <h2>2. Information We Collect</h2>
        <p>We collect various types of information, including:</p>
        <ul>
            <li>
                <p>Personal Information: Name, email address, phone number, billing and shipping address, and payment information.</p>
            </li>
            <li>
                <p>Account Information: Username, password, and order history.</p>
            </li>
            <li>
                <p>Technical Data: IP address, browser type, device information, and usage data.</p>
            </li>
            <li>
                <p>Cookies and Tracking Technologies: We use cookies and similar tracking technologies to enhance your experience.</p>
            </li>
        </ul>

        <hr />
        <h2>3. How We Use Your Information</h2>
        <p>We use your information for the following purposes:</p>
        <ul>
            <li>
                <p>To process transactions and deliver products.</p>
            </li>
            <li>
                <p>To communicate with you regarding orders, support, and promotions.</p>
            </li>
            <li>
                <p>To improve our Website and customer experience.</p>
            </li>
            <li>
                <p>To comply with legal and regulatory obligations.</p>
            </li>
        </ul>

        <hr />
        <h2>4. How We Share Your Information</h2>
        <p>We do not sell your personal information. However, we may share your data with:</p>
        <ul>
            <li>
                <p>Service Providers: Third-party companies that assist in payment processing, shipping, and customer support.</p>
            </li>
            <li>
                <p>Legal Compliance: If required by law, we may disclose information to regulatory authorities.</p>
            </li>
            <li>
                <p>Business Transfers: In the event of a merger or acquisition, your data may be transferred to the new entity.</p>
            </li>
        </ul>

        <hr />
        <h2>5. Data Security</h2>
        <p>We implement industry-standard security measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
        
        <hr />
        <h2>6. Your Rights and Choices</h2>
        <p>Depending on your location, you may have the following rights:</p>
        <ul>
            <li>
                <p>Access & Correction: Request access to and correction of your personal data.</p>
            </li>
            <li>
                <p>Deletion: Request deletion of your personal information.</p>
            </li>
            <li>
                <p>Opt-Out: Unsubscribe from marketing communications.</p>
            </li>
            <li>
                <p>Cookies Management: Adjust browser settings to decline cookies.</p>
            </li>
        </ul>

        <hr />
        <h2>7. Third-Party Links</h2>
        <p>Our Website may contain links to third-party sites. We are not responsible for their privacy practices and encourage you to review their policies.</p>
        
        <hr />
        <h2>8. Children's Privacy</h2>
        <p>Our services are not intended for individuals under the age of 13. We do not knowingly collect data from children.</p>
        
        <hr />
        <h2>9. Changes to This Privacy Policy</h2>
        <p>We reserve the right to update this Privacy Policy at any time. Any changes will be posted on this page with the revised effective date.</p>

        <hr />
        <h2>10. Contact Us</h2>
        <p>If you have any questions or concerns regarding this Privacy Policy, please contact us at the address below. More on our <NavLink to={'/contact'}>Contact</NavLink> page.</p>
        <h2>COREbuild</h2>
        <p>123 Tech Street, Suite 456</p>
        <p>Tech City, TC 78910</p>
        <p>Email: corebuildshop@gmail.com</p>
        <p>Phone: +49 123456789</p>

    </div>
    );
}