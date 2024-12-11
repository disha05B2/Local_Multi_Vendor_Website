
  
<!-- GETTING STARTED -->
## Getting Started

Follow the steps given below to run the project locally on your system.

### Prerequisites

* npm
  ```sh
  npm install npm@latest -g
  npm install nodemon@latest -g
  ```

### Installation

_Once all the prerequisites are met, the required API Keys must be generated and dependencies must be installed._

1. Create a [RazorPay Developer Account](https://dashboard.razorpay.com/signin?screen=sign_in) and get the `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` credentials.
2. Create a [Cloudinary Account](https://cloudinary.com/) and obtain the `API_KEY`, `API_SECRET` and `CLOUD` from your dashboard.
3. Create a free MongoDB Atlas cluster at [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)

4. Clone the repo
   ```sh
   git clone https://github.com/rushabhkela/EZ-Shopping.git
   ```
3. In each of the `Admin`, `Vendor` and `Client` directories, perform steps 4-6.
4. Install NPM packages
   ```sh
   npm install
   ```
5. Create the .env file
   ```sh
   cp .env.example .env
   ```
6. In the .env file, enter your credentials generated in the above steps and add a suitable session-key.
7. Good to go! Start the project locally using the following command in any of the `Admin`, `Vendor` and `Client` directories.
   ```sh
   npm start
   ```
8. ```sh
    Admin Portal : http://localhost:3002
    Vendor Portal : http://localhost:3001
    Client Portal : http://localhost:3000
   ```




