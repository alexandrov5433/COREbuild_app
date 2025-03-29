import styles from './contact.module.css';
import corebuildLogo from '../../../assets/COREbuild.svg';
import { NavLink, useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookSquare, faLinkedin, faSquareXTwitter, faTiktok } from '@fortawesome/free-brands-svg-icons';
import { faArrowRight, faEnvelope, faPhone, faUser } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import submitTicket from '../../../lib/actions/ticket/submitTicket';
import { useAppDispatch, useAppSelector } from '../../../lib/hooks/reduxTypedHooks';
import { setMessageData } from '../../../redux/popupMessageSlice';

export default function Contact() {
    const userData = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const ticketFormRef = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const initFormValidityState = {
        isFormValid: false,
        title: {
            valid: false,
            touched: false,
        },
        content_question: {
            valid: false,
            touched: false,
        },
        email_for_answer: {
            valid: false,
            touched: false,
        },
    };
    const [formValidity, setFromValidity] = useState(initFormValidityState);
    const [ticketSubmitionLoading, setTicketSubmitionLoading] = useState(false);

    function validator(e: React.SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const val = e.currentTarget.value;
        const fieldName = e.currentTarget.name;
        const regexpLib = {
            'title': new RegExp(/.+/),
            'content_question': new RegExp(/.+/),
            'email_for_answer': new RegExp(/^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/)
        }
        const validity = ((regexpLib as any)[fieldName])?.test(val.trim());
        setFromValidity(state => {
            const newState = { ...state };
            (newState as any)[fieldName].valid = validity;
            (newState as any)[fieldName].touched = true;
            const formIsValid = [
                newState.title.valid,
                newState.email_for_answer.valid,
                newState.content_question.valid
            ].includes(false);
            newState.isFormValid = !formIsValid;
            return newState;
        });
    }

    async function submitNewTicket() {
        const formData = new FormData(ticketFormRef.current!);
        if (!formData) {
            return;
        }
        setTicketSubmitionLoading(true);
        const action = await submitTicket(formData);
        if (action.responseStatus === 200) {
            dispatch(setMessageData({
                duration: 6500,
                isShown: true,
                text: `Ticket submitted! We will answer you at ${formData.get('email_for_answer')}.`,
                type: 'success'
            }));
            navigate('/');
        } else if (action.responseStatus === 400) {
            dispatch(setMessageData({
                duration: 4000,
                isShown: true,
                text: action.msg,
                type: 'error'
            }));
        }
        setTicketSubmitionLoading(false);
    }

    return (
        <div className={styles.wrapper}>
            <h1>Contact Us</h1>
            <div className={styles.openingText}>
                <h3>We're Here to Help!</h3>
                <p className="lead">At <img src={corebuildLogo} />, we're committed to providing top-tier customer support. Whether you have questions about a product, need help with an order, or just want to say hello, we're happy to assist you.</p>
            </div>

            <div className={styles.infosContainer}>
                <div>
                    <h3>How to Reach Us</h3>
                </div>
                <div className={styles.infosContent}>
                    <section>
                        <h4>Visit Us<FontAwesomeIcon icon={faUser} /></h4>
                        <p>123 Tech Street, Suite 456</p>
                        <p>Tech City, TC 78910</p>
                    </section>
                    <section>
                        <h4>Call Us<FontAwesomeIcon icon={faPhone} /></h4>
                        <p>Customer Support: +1 (800) 123-4567</p>
                        <p>Mon - Fri: 09:00 - 19:00 (EST)</p>
                        <p>Sat - Sun: 10:00 - 17:00 (EST)</p>
                    </section>
                    <section>
                        <h4>Email Us<FontAwesomeIcon icon={faEnvelope} /></h4>
                        <p>General Inquiries: corebuildshop@gmail.com</p>
                        <p>Sales: sales@corebuild.xyz</p>
                    </section>
                </div>
            </div>

            <div className={styles.policies}>
                <h3>Our Policies</h3>
                <ul>
                    <li>
                        <NavLink to={'/terms'} ><FontAwesomeIcon icon={faArrowRight} /> Terms of Service</NavLink>
                    </li>
                    <li>
                        <NavLink to={'/privacy'} ><FontAwesomeIcon icon={faArrowRight} /> Privacy Policy</NavLink>
                    </li>
                    <li>
                        <NavLink to={'/return'} ><FontAwesomeIcon icon={faArrowRight} /> Return Policy</NavLink>
                    </li>
    
                </ul>
            </div>

            <div className={styles.socialMediaContainer}>
                <h3>Follow Us on Social Media</h3>
                <p className="lead">Stay updated on the latest deals, tech news, and exclusive promotions!</p>
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
            {
                userData?.is_employee ? '' :
                    <div className={styles.ticketFormContainer}>
                        <h3>Need Assistance? Open a Support Ticket!</h3>
                        <p className="lead">Have a question or need help with your order? Our support team is here to assist you! Simply open a ticket, and we'll get back to you at the given email as soon as possible. Let us know how we can help, and we'll make sure you get the support you need.</p>
                        <div className={styles.formWrapper}>
                            <form ref={ticketFormRef}>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Title</label>
                                    <input type="text" className={`form-control ${formValidity.title.touched ?
                                        (formValidity.title.valid ? '' : 'is-invalid') : ''
                                        }`} id="title" placeholder="Please enter a title." name="title" onChange={e => validator(e)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email_for_answer" className="form-label">Email</label>
                                    <input type="email" className={`form-control ${formValidity.email_for_answer.touched ?
                                        (formValidity.email_for_answer.valid ? '' : 'is-invalid') : ''
                                        }`} id="email_for_answer" name="email_for_answer" placeholder="Please enter your email." onChange={e => validator(e)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="content_question" className="form-label">Question</label>
                                    <textarea className={`form-control ${formValidity.content_question.touched ?
                                        (formValidity.content_question.valid ? '' : 'is-invalid') : ''
                                        }`} id="content_question" placeholder="Please describe the situation and enter useful information, like orderID." name="content_question" onChange={e => validator(e)}></textarea>
                                </div>
                                <div className="mb-3">
                                    <button className="btn btn-success" type="button" onClick={submitNewTicket} disabled={!formValidity.isFormValid || ticketSubmitionLoading}>Submit</button>
                                </div>
                            </form>
                        </div>

                    </div>
            }
        </div>
    );
}