# Blockchain Backend

A simplified blockchain implementation in Python using FastAPI. This is a scaled-down model of a blockchain application that demonstrates core blockchain concepts including:

- Block creation and mining
- Wallet management
- Transaction processing
- Proof of Work consensus
- Chain validation

## Features

- **Block Management**: Create and mine blocks with transactions
- **Wallet System**: Create wallets and manage balances
- **Transaction Processing**: Send transactions between wallets
- **Mining**: Mine blocks and receive mining rewards
- **Chain Validation**: Verify blockchain integrity
- **API Documentation**: Interactive API docs with Swagger UI

## Prerequisites

- Python 3.8+
- pip (Python package manager)

## Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows
   .\venv\Scripts\activate
   # On Unix or MacOS
   source venv/bin/activate
   ```
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Application

1. Start the server:
   ```bash
   uvicorn main:app --reload
   ```
2. Access the API at `http://localhost:8000`
3. View interactive API documentation at `http://localhost:8000/docs`

## API Endpoints

### Blockchain Status
- **GET** `/blockchain/status`
  - Returns current blockchain status including chain length, pending transactions, and difficulty

### Wallet Management
- **POST** `/wallet/create`
  - Creates a new wallet with initial balance
  - Returns wallet address, private key, and balance

- **GET** `/wallets`
  - Returns list of all wallets in the blockchain
  - Includes address, private key, and balance for each wallet

### Transaction Management
- **POST** `/transaction`
  - Creates a new transaction between wallets
  - Requires sender address, recipient address, amount, and private key

### Block Mining
- **POST** `/mine`
  - Mines pending transactions into a new block
  - Requires miner's wallet address
  - Returns the newly created block

### Block Information
- **GET** `/blocks`
  - Returns all blocks in the blockchain
  - Includes block details and transactions

- **GET** `/pending-transactions`
  - Returns list of pending transactions
  - Transactions waiting to be mined into blocks

## Project Structure

```
backend/
├── blockchain/
│   ├── __init__.py
│   ├── block.py      # Block implementation
│   ├── blockchain.py # Main blockchain logic
│   ├── transaction.py # Transaction implementation
│   └── wallet.py     # Wallet implementation
├── main.py           # FastAPI application and endpoints
├── requirements.txt  # Project dependencies
└── README.md        # This file
```

## Technical Details

### Blockchain Implementation
- Uses SHA-256 for block hashing
- Implements Proof of Work consensus
- Maintains transaction history in blocks
- Validates chain integrity

### Wallet System
- Uses public/private key pairs
- Manages wallet balances
- Handles transaction signing

### Mining Process
- Difficulty-based mining
- Mining rewards for successful block creation
- Transaction processing and balance updates

## API Documentation

For detailed API documentation, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

The documentation includes:
- Detailed endpoint descriptions
- Request/response schemas
- Example requests and responses
- Interactive API testing

## Development Notes

This is a simplified blockchain implementation for educational purposes. In a production environment, you would need to:

1. Implement proper key storage and security
2. Add network synchronization
3. Implement proper transaction validation
4. Add persistence layer for blockchain data
5. Implement proper error handling and recovery
6. Add rate limiting and security measures


# Blockchain Dashboard Frontend

A modern, responsive dashboard built with Next.js and Material-UI for interacting with the blockchain backend. This frontend provides an intuitive interface for managing wallets, transactions, and blockchain operations.

## Features

- **Real-time Blockchain Status**

  - View chain length, pending transactions, and mining difficulty
  - Monitor mining rewards and network status

- **Wallet Management**

  - Create new wallets with initial balance
  - View all wallets in the system
  - Copy wallet addresses and private keys
  - Track wallet balances

- **Transaction System**

  - Create transactions between wallets
  - View pending transactions
  - Monitor transaction history
  - Track transaction status

- **Block Mining**

  - Mine new blocks with pending transactions
  - View block details and transactions
  - Monitor mining rewards

- **User Interface**
  - Modern Material-UI design
  - Dark/Light mode support
  - Responsive layout
  - Interactive components
  - Toast notifications for feedback

## Prerequisites

- Node.js 16.x or later
- npm or yarn package manager
- Running blockchain backend (see backend README)

## Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

## Running the Application

1. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
2. Access the application at `http://localhost:3000`

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout with theme and navigation
│   │   └── page.tsx        # Main dashboard page
│   ├── components/
│   │   ├── CreateWalletModal.tsx    # Wallet creation dialog
│   │   ├── CreateTransactionModal.tsx # Transaction creation dialog
│   │   └── WalletsTable.tsx         # Wallets display component
│   └── theme/
│       └── index.ts        # Material-UI theme configuration
├── package.json           # Project dependencies and scripts
└── README.md             # This file
```

## Components

### Main Dashboard

- Displays blockchain status cards
- Shows quick action buttons
- Provides access to all features

### Wallet Management

- Create new wallets
- View wallet list with balances
- Copy wallet details
- Track wallet status

### Transaction System

- Create new transactions
- View pending transactions
- Monitor transaction history
- Track transaction status

### Block Mining

- Mine new blocks
- View block details
- Monitor mining rewards
- Track block status

## Theme Configuration

The application includes:

- Light/Dark mode support
- Custom Material-UI theme
- Responsive typography
- Consistent color scheme
- Modern component styling

## API Integration

The frontend communicates with the backend through:

- RESTful API endpoints
- Axios for HTTP requests
- Error handling and validation
- Real-time updates

## Development Notes

This is a simplified frontend implementation for educational purposes. In a production environment, you would need to:

1. Implement proper authentication
2. Add secure key storage
3. Implement proper error handling
4. Add loading states and retry logic
5. Implement proper data validation
6. Add proper testing
7. Implement proper state management
8. Add proper logging and monitoring

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is for educational purposes only.
