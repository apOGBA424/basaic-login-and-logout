# Basic Login and Logout

A simple authentication app built with Node.js, Express, EJS, and MongoDB. This project provides basic user authentication features, including login and logout functionality.

## Live Demo

Check out the live demo [here](https://cute-red-scallop-boot.cyclic.app/).

## Dependencies

- [express](https://www.npmjs.com/package/express)
- [express-session](https://www.npmjs.com/package/express-session)
- [ejs](https://www.npmjs.com/package/ejs)
- [cors](https://www.npmjs.com/package/cors)
- [connect-mongodb-session](https://www.npmjs.com/package/connect-mongodb-session)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [mongoose](https://www.npmjs.com/package/mongoose)
- [uuid](https://www.npmjs.com/package/uuid)
- [crypto](https://nodejs.org/api/crypto.html) (core Node.js module)

## Issues Encountered

The `bcryptjs` package was causing authentication issues, so it was replaced with two custom functions using the core Node.js module `crypto`. The functions, `encryptFunction()` and `decryptFunction()`, are located in the "config/hashdata.js" file.

## Project Structure

- **config/hashdata.js**: Contains the custom encryption and decryption functions.
- **config/database.js**: Database connection code.
- **model/user.js**: User model code.
- **public/styles/main.css**: CSS styles for the application.
- **public/js/script.js**: JavaScript codes, including confetti effects.
- **views/index.ejs**: Landing page code.
- **views/sign-in.ejs**: Sign-in page code.
- **views/sign-up.ejs**: Sign-up page code.
- **app.js**: Main application file containing routes, middleware, and package imports.

## How to Run

1. Install dependencies: `npm install`
2. Set up your MongoDB connection string in a `.env` file.
3. Run the app: `npm start`
4. Open your browser and navigate to `http://localhost:3000`

## Contributing

Contributions are welcome! If you find any issues or would like to suggest improvements, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

