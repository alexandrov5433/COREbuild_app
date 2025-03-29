import styles from '../../../lib/styling/formal.module.css';
import { useEffect } from 'react';
import { NavLink } from 'react-router';

export default function Return() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className={styles.wrapper}>
            <h1>Return Policy</h1>
            <p>Effective Date: 29.03.2025</p>
            <p>Last Updated: 28.03.2025</p>
            <p>Thank you for shopping with COREbuild. We are committed to providing high-quality PC components and software. If you are not completely satisfied with your purchase, we offer a comprehensive return policy to ensure a smooth and hassle-free process.</p>

            <hr />
            <h2>1. Eligibility for Returns</h2>
            <p>You may return products purchased from COREbuild under the following conditions:</p>
            <ul>
                <li>
                    <p>The return is requested within 30 days from the date of purchase.</p>
                </li>
                <li>
                    <p>The item is in its original condition, unused, and includes all accessories, manuals, and original packaging.</p>
                </li>
                <li>
                    <p>The item is not a non-returnable product (see Section 6 below).</p>
                </li>
            </ul>

            <hr />
            <h2>2. How to Initiate a Return</h2>
            <p>To initiate a return, please follow these steps:</p>
            <ol>
                <li>
                    <p><NavLink to={'/contact'}>Contact</NavLink> our customer support team at corebuildshop@gmail.com or call us at +49 123456789.</p>
                </li>
                <li>
                    <p>Provide your order number, product details, and reason for return.</p>
                </li>
                <li>
                    <p>Our support team will provide a Return Merchandise Authorization (RMA) number and return instructions.</p>
                </li>
                <li>
                    <p>Pack the item securely and include a copy of your original receipt.</p>
                </li>
                <li>
                    <p>Ship the item to:</p>
                    <p>COREbuild Returns Department</p>
                    <p>123 Tech Street, Suite 456</p>
                    <p>Tech City, TC 78910</p>
                </li>
            </ol>

            <hr />
            <h2>3. Refund Process</h2>
            <ul>
                <li>
                    <p>Once we receive and inspect the returned item, we will process the refund within 5-10 business days.</p>
                </li>
                <li>
                    <p>Refunds will be issued to the original payment method.</p>
                </li>
                <li>
                    <p>Shipping and handling charges are non-refundable.</p>
                </li>
                <li>
                    <p>If the return is due to our error (e.g., defective or incorrect item), we will cover the return shipping costs.</p>
                </li>
            </ul>

            <hr />
            <h2>4. Exchanges</h2>
            <p>If you received a defective or damaged product, we offer a free exchange for the same item. Please contact our support team to arrange an exchange.</p>

            <hr />
            <h2>5. Restocking Fees</h2>
            <ul>
                <li>
                    <p>A 15% restocking fee may apply for opened or used products.</p>
                </li>
                <li>
                    <p>If the item is returned due to a change of mind, shipping costs will not be reimbursed.</p>
                </li>
            </ul>

            <hr />
            <h2>6. Non-Returnable Items</h2>
            <p>Certain items are not eligible for returns, including:</p>
            <ul>
                <li>
                    <p>Software, digital downloads, and licenses</p>
                </li>
                <li>
                    <p>Clearance and final sale items</p>
                </li>
                <li>
                    <p>Custom-built or modified PCs</p>
                </li>
                <li>
                    <p>Products missing serial numbers or damaged due to improper use</p>
                </li>
            </ul>

            <hr />
            <h2>7. Late or Missing Refunds</h2>
            <p>If you have not received your refund within the expected time frame:</p>
            <ol>
                <li>
                    <p>Check your bank account.</p>
                </li>
                <li>
                    <p>Contact your credit card company or PayPal (processing times may vary).</p>
                </li>
                <li>
                    <p>If the issue persists, contact us at corebuildshop@gmail.com.</p>
                </li>
            </ol>

            <hr />
            <h2>8. Contact Information</h2>
            <p>For any return-related questions, you can reach us at:</p>
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
            <p>COREbuild reserves the right to modify this Return Policy at any time. Please check our website for updates.</p>
            <p>Thank you for choosing COREbuild! We appreciate your business.</p>

        </div>
    );
}