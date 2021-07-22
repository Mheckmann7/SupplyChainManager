This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Blockchain Supply Chain Manager

#### Goal:

Create an automated supply chain solution that automatically dispatches orders upon payment, without a middleman.

#### Application Flow:

1. Create and item by entering an item ID and the cost in Wei. Metamask will open and allow you to create the transaction for a small gas fee.
2. Purchase an item by copy pasting the item address into Metamask and sending the correct amount of Wei.
3. The smart contract will automatically trigger and ship the item.

#### Technologies used:

- Solidity
- Truffle
- React.js
- Bootstrap

![Imgur Image](https://i.imgur.com/yBoFITA.png)
