# Crypto exchange info 💱

This project is small React SPA used to present Order book from Binance API. It makes use of Binance REST api and WS api to feed and display the data. 
I attempted to create site that looks and behaves similarly like [Binance's Order Book](https://www.binance.com/en/orderbook/BTC_USDT)

Public preview is available on https://crypto-exchange-info.herokuapp.com/

This project is built by:

- React 17
- Material UI 5 (MUI 5)
- React router
- Binance's public API's (REST and WS)

Website is using Heroku free web hosting 🚀


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### `npm run lint`

Lints the application code with eslint. Config can be found in ./eslintrc

### `npm run lint --fix`

Lints the application code with eslint and fixes issues along the way. Config can be found in ./eslintrc

## How to run

1. Clone this repo
2. Run `npm install` or `yarn install`
3. Run `npm run start` or `yarn start`

##What would I do with extra time

- Write some tests
- Add storybook for component preview
- Create nicer looking UI