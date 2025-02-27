import styles from './addProduct.module.css';


export default function AddProduct() {
    // productID: number,
    // name: string,
    // description: string,
    // price: number,
    // stockCount: number,
    // manufacturer: string,
    // specsDoc: number,
    // thumbnailID: number,
    // pictures: Array<number>,
    // reviews: Array<number>
    return (
        <div className={styles.wrapper}>
            <h1>Add A New Product</h1>
            <form>
                <div className={`${styles.inputContainer}`}>
                    <label htmlFor="username" className="form-label">Product Name</label>
                    <input type="text" className={`form-control`} id="username" name="username" aria-describedby="usernameHelp" />
                    <div id="usernameHelp" className="form-text">Please enter your username.</div>
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="description" className="form-label">Product Description</label>
                    <textarea className="form-control" id="description"></textarea>
                    <div id="passwordHelp" className="form-text">Please enter your password.</div>
                </div>
                {/* <div className="invalid-feedback">
                    {loginState.msg || ''}
                </div> */}
                {/* <div className={`form-check ${styles.inputContainer}`}>
                    <input type="checkbox" className="form-check-input" id="stayLoggedIn" name='stayLoggedIn' />
                    <label className="form-check-label" htmlFor="stayLoggedIn">Stay logged in</label>
                </div> */}

                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <button type="submit" className={`btn btn-success ${styles.submitButton}`}>Add Product</button>

            </form>
        </div>
    );
}