from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import os
from blockchain.blockchain import Blockchain
from blockchain.wallet import Wallet
from blockchain.transaction import Transaction

app = FastAPI(title="Blockchain API")

frontEndURL = os.getenv("FRONTEND_URL", "http://localhost:3000")
print(frontEndURL)


# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontEndURL],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Initialize blockchain
blockchain = Blockchain()

class TransactionRequest(BaseModel):
    from_address: str
    to_address: str
    amount: float
    private_key: str

class WalletResponse(BaseModel):
    address: str
    private_key: str
    balance: float

class MiningRequest(BaseModel):
    address: str

class WalletListResponse(BaseModel):
    wallets: List[WalletResponse]

class BlockResponse(BaseModel):
    timestamp: float
    transactions: List[dict]
    previous_hash: str
    hash: str
    nonce: int
    difficulty: int

@app.post("/wallet/create", response_model=WalletResponse)
async def create_wallet():
    """Create a new wallet."""
    wallet = Wallet(100.0)
    address = wallet.get_address()
    private_key = wallet.get_private_key()
    blockchain.add_wallet(address, private_key, 100.0)  # Add wallet to blockchain with initial balance
    return {
        "address": address,
        "private_key": private_key,
        "balance": wallet.balance
    }

@app.get("/wallet/{address}/balance", response_model=float)
async def get_balance(address: str):
    """Get the balance of a wallet."""
    return blockchain.get_balance(address)

@app.post("/transaction")
async def create_transaction(transaction: TransactionRequest):
    """Create a new transaction."""
    try:
        # Validate addresses
        if not transaction.from_address or not transaction.to_address:
            raise HTTPException(status_code=400, detail="Both sender and recipient addresses are required")
        
        transaction.from_address = transaction.from_address.replace('\\n', '\n')
        transaction.private_key = transaction.private_key.replace('\\n', '\n')
        transaction.to_address = transaction.to_address.replace('\\n', '\n')

        # Create wallet from private key
        try:
            wallet = Wallet.from_private_key(transaction.private_key)
        except Exception as e:
            raise HTTPException(status_code=400, detail="Invalid private key format")
        
        # Verify the wallet address matches
        if wallet.get_address() != transaction.from_address:
            raise HTTPException(status_code=400, detail="Invalid private key for address")
        
        # Create and sign transaction
        tx = Transaction(transaction.from_address, transaction.to_address, transaction.amount)
        tx.sign_transaction(wallet.private_key)
        
        # Add transaction to blockchain
        blockchain.add_transaction(transaction.from_address, transaction.to_address, transaction.amount)
        wallet.balance -= transaction.amount
        
        return {"message": "Transaction added successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/mine")
async def mine_block(miner:MiningRequest):
    """Mine a new block."""
    try:
        miner.address = miner.address.replace('\\n', '\n')
        blockchain.mine_pending_transactions(miner.address)
        return {"message": "Block mined successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/blocks", response_model=List[BlockResponse])
async def get_blocks():
    """Get all blocks in the chain."""
    return [block.to_dict() for block in blockchain.chain]

@app.get("/pending-transactions", response_model=List[dict])
async def get_pending_transactions():
    """Get all pending transactions."""
    return [tx.to_dict() for tx in blockchain.pending_transactions]

@app.get("/blockchain/status")
async def get_blockchain_status():
    """Get the current status of the blockchain."""
    return {
        "chain_length": len(blockchain.chain),
        "pending_transactions": len(blockchain.pending_transactions),
        "difficulty": blockchain.difficulty,
        "mining_reward": blockchain.mining_reward,
        "is_valid": blockchain.is_chain_valid()
    }

@app.get("/wallets", response_model=WalletListResponse)
async def get_wallets():
    """Get all wallets in the blockchain."""
    wallets = []
    for address, (private_key, balance) in blockchain.wallets.items():
        wallets.append({
            "address": address,
            "private_key": private_key,
            "balance": balance
        })
    return {"wallets": wallets}

if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port) 