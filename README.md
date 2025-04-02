# COREbuild
An online-shop for computer parts and software.

## How to test
Feel free to take a look at the website and do anything you normaly would. You can check it out at [https://corebuild.xyz](https://corebuild.xyz). You can register either as a [Customer](#customer) or [Employee](#employee). More on that below.

## Users
### Guest
As a Guest you can:
- login or register.
- browse only certain pages of the website - [products](#products) catalog and details, [Contact, About and More](#contact-about-and-more).
- submit [tickets](#tickets).
### Customer
As a Customer you can:
- manage your [shopping cart](#shopping-cart).
- make purchases - view payment credentials under [Payment](#payment) below.
- view your [orders](#orders).
- submitt [tickets](#tickets).
- post product [reviews](#product-reviews).
- manage a [favorites](#favorites) list of products.
- edit your [profile details](#profile). 
- change your [password](#profile).    

**Example Customer profile:**
- Username: **alexCustomer**
- Password: **alexCustomer**            

In order to register as a Customer, simply fill out the registration form and click submit. If the username and email are not in use you will be registered. Otherwise, you have to choose other ones.    
If you enter your actual email address, you **will recieve emails from corebuildshop@gmail.com. Please, check your spam folder!**
- when you register - a welcome email.
- after a successful purchase an order summary will be sent.
- after a ticket was answered by an [Employee](#employee) and your email was given in the ticket as the email for the answer. 
**Please, check your spam folder!** Don't worry, you can change the email again afterwords under [Profile -> Details](#profile).

### Employee
As an Employee you can:
- view and manage [products](#products).
- view and answer [tickets](#tickets).
- view and manage [orders](#orders).
- change your [password](#profile).     

**Example Employee profile:**
- Username: **alex123**
- Password: **alex123**

In order to register as an Employee go to the register page, check the box of "I am an employee of COREbuild." and fill in the credentials. Employees verify them selfs by submitting the "Authentication Code" on registration.    
Authentication Code: **qwertz**

## Payment
You have to be logged in as a [Customer](#customer) and have at least one product in your shopping cart in order to make a purchase.   
PayPal is the payment provider in COREbuild. Open your shopping cart, scroll down or select the Checkout button and click the yellow PayPal button.  
Use the following sandbox-account credentials to pay:
- Email: **sb-3mftt38673549@personal.example.com**
- Password: **6BGk-pS,**    

**Don't worry! This is a sandbox PayPal account. Everything is genuine about the payment except the money used.** There will be at least 10 000 € available in the account.   
If you have registered with your actual email you will recieve an order summary after a short moment. **Please, check your spam folder!**

## Tickets
They can be submitted from Guests and [Customers](#customer) from the [Contact](#contact-about-and-more) page. If an actual email is given, when an Employee answers the ticket the answer will be sent per email at the given email address. The email template already contains "Dear Customer" and "Kind regards". Simply type the answer of the ticket and click "Submit Answer".    
A ticket contains useful data like the title, question, time of submission and more. If already answered the "Closed On" time, the ID of the Employee and the answer given can be seen.   
[Employees](#employee) can access the tickets through the "Tickets" option in the dropdown menu of their username and use filtration through the "Open Filters" button in the Tickets page.

## Orders
They can be viewed under (My) Orders in the dropdown menu of the users username in the upper right corner. An order contains the information about it like time of placement, shipping status, recipient, items and links to their details, total payment amount and more. Filtration is available through the "Open Filters" button.
Customers can place orders by making the [payment](#payment).   
A [Customer](#customer) can view only their own orders in the My Orders page.    
[Employees](#employee) see an extra part of the UI to edit the shipping status of the order. When they want to change the shipping status from "pending" to "shipped" they can click "Open Shipment Manager", enter the name of the Speditor (e.g. DHL) and the Tracking Code (e.g. 90834a9889q34jio23094) and click "Update Status". Now the Customer, who placed this order, can log in an view the updated data.   
Employees can also revert the shipping status back to "pending" by clicking the red button "Revert To Pending".    
Orders can be filtered by their ID, shipping status and time of placement. Employees can also filter them by the ID of the recipient - the userID of the Customer, who placed the given order.  

## Products
They can be found by clicking "Products" in the navigation bar or by entering a name (e.g Ryzen) in the search bar and hitting Enter.    
The products can be filtered in the Products page by opening the filter and entering the wanted parameters. SerchParams are used here, so that the search state can be easily shared with others with the URL. 
### Adding New Products
[Employees](#employee) can add new products. To do so open the dropdown menu from the username and click "Add Product". Fill out the form and you will be redirected to the product`s details page, if the addition was successful. From the file fields only the "Thumbnail" is mandatory because each product must have at least a thumbnail picture. The limitation for every field are described under it.  
### Editing Products
[Employees](#employee) can edit existing products. The editing page is separated in two sections - one for files and one for infos.    
#### File Editing
The thumbnail can only be changed and not simply deleted. The old picture will be automatically deleted upon uploading the new one.   
The specifications document can be deleted or exchanged by uploading a new one.    
The pictures can each be deleted separately. Uploads do not delete other pictures. If the maximum allowed count of pictures (5, excluding the thumbnail) is reached, you must first delete some in order to add others.
#### Info Editing
The current product information is displayed in the fields and can be edited. After that click "Save Infos". The changes in the fields may be reset by clicking "Remove Changes". This does not revert the changes to their previous state before the last editting request. With "View Product Details Page" you can directly visit the details page of the given product.
### Product Reviews
[Customers](#customer) can submit them. Rating and comment are mandatory to submit the review. If the customer has purchased the product, which they are reviewing, the review will be displayed with the "Verified purchase" badge. The reviews can not be edited or deleted. A Customer can review a given product only once. 

## Shopping Cart
[Customers](#customer) have a shopping cart, which can be accessed through the yellow cart icon right next to their username in the top right or the navigaton bar. All prodcuts, added for purchasing, can be found there. The quantity of the purchased products can be controlled from within the shopping cart. Products can also be added directly from the catalog page by clicking "Add To Cart", which adds 1 of the product to the cart, if the product is available. They can also be added from the product´s details page where Customers can also choose the quantity they with to add.   
When ready, the Customer can click "Checkout" or scroll down to the Checkout and proceed to [payment](#payment), which places the order, if executed successfully.

## Profile
### Details
[Customers](#customer) and [Employees](#employee) have a Details tab in their profile. Customers can edit their profile information (Email, First Name, Last Name and Addredd) and change their password. Employees can only change their password.
### Favorites
[Customers](#customer) have a list of favorite products, under the Favorites tab, which displays the product thumbnail, name and a button to remove the given product from the list. 

## Contact, About and More
The About, Terms of Service, Privacy Policy and Return Policy - included under More - are all static pages with information.   
The Contact page includes company contact information and the [tickets](#tickets) submission form.

## Routing and Session
The URL is shareable. For example [https://corebuild.xyz/contact](https://corebuild.xyz/contact) will lead directly to the Contact page.   
The session of the logged in user is kept in a cookie "session". If the user has ticked the "Stay logged in" box on registration or log-in the cookie will expire 1 year after the date of the sign-in. Otherwise the cookie is valid for a session - until closing the browser.    
Session is tracked accross tabs. If the user is logged in and opens the COREbuild website in an other tab, they will automaticaly be logged in in the second tab.   
If two tabs are open, the user is logged in in both and logs out in one of them, upon switching to the previous tab - where they were still logged in - they will be automaticaly logged out here also, and redirected if needed.