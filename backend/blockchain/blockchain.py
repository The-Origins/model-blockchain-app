from typing import List, Dict
import time
from .block import Block
from .transaction import Transaction
from .wallet import Wallet

class Blockchain:
    def __init__(self):
        self.chain: List[Block] = []
        self.difficulty = 2
        self.pending_transactions: List[Transaction] = []
        self.mining_reward = 10.0
        self.wallets: Dict[str, tuple] = {}  # address -> (private_key, balance)
        self.create_genesis_block()

    def create_genesis_block(self) -> None:
        """Create the first block in the chain."""
        genesis_block = Block(0, [], "0")
        genesis_block.mine_block()
        self.chain.append(genesis_block)

    def get_latest_block(self) -> Block:
        """Get the most recent block in the chain."""
        return self.chain[-1]

    def mine_pending_transactions(self, miner_address: str) -> None:
        """Create a new block with all pending transactions and mine it."""

        if not self.pending_transactions:
            raise Exception("No transactions to mine")

        # Create block with all pending transactions
        block = Block(
            len(self.chain),
            self.pending_transactions,
            self.get_latest_block().hash
        )

        # Mine the block
        block.mine_block()

        # Add the block to the chain
        self.chain.append(block)

        # Process all transactions in the new block
        for transaction in block.transactions:
            if transaction.from_address is None:  # Mining reward
                if miner_address in self.wallets:
                    _, current_balance = self.wallets[miner_address]
                    self.wallets[miner_address] = (self.wallets[miner_address][0], current_balance + transaction.amount)
                else:
                    raise Exception("Miner wallet not found")
            else:
                # Update sender's balance
                if transaction.from_address in self.wallets:
                    _, current_balance = self.wallets[transaction.from_address]
                    if current_balance < transaction.amount:
                        raise Exception("Insufficient funds")
                    self.wallets[transaction.from_address] = (self.wallets[transaction.from_address][0], current_balance - transaction.amount)
                else:
                    raise Exception("Sender wallet not found")

                # Update recipient's balance
                if transaction.to_address in self.wallets:
                    _, current_balance = self.wallets[transaction.to_address]
                    self.wallets[transaction.to_address] = (self.wallets[transaction.to_address][0], current_balance + transaction.amount)
                else:
                    raise Exception("Recipient wallet not found")

        # Reset pending transactions and reward the miner
        self.pending_transactions = []
        self.add_transaction(None, miner_address, self.mining_reward)

    def add_transaction(self, from_address: str, to_address: str, amount: float) -> None:
        """Add a new transaction to the list of pending transactions."""
        if from_address is not None:  # Not a mining reward
            if from_address not in self.wallets:
                raise Exception("Sender wallet not found")
            _, current_balance = self.wallets[from_address]
            if current_balance < amount:
                raise Exception("Insufficient funds")

        if to_address not in self.wallets:
            raise Exception("Recipient wallet not found")

        transaction = Transaction(from_address, to_address, amount)
        self.pending_transactions.append(transaction)

    def get_balance(self, address: str) -> float:
        """Get the balance of a wallet."""
        if address not in self.wallets:
            raise Exception("Wallet not found")
        return self.wallets[address][1]

    def add_wallet(self, address: str, private_key: str, initial_balance: float = 100.0) -> None:
        """Add a new wallet to the blockchain."""
        if address in self.wallets:
            raise Exception("Wallet already exists")
        self.wallets[address] = (private_key, initial_balance)

    def is_chain_valid(self) -> bool:
        """Check if the blockchain is valid."""
        for i in range(1, len(self.chain)):
            current_block = self.chain[i]
            previous_block = self.chain[i - 1]

            # Verify current block's hash
            if current_block.hash != current_block.calculate_hash():
                return False

            # Verify chain continuity
            if current_block.previous_hash != previous_block.hash:
                return False

            # Verify proof of work
            if not current_block.hash.startswith('0' * self.difficulty):
                return False

        return True

    def to_dict(self) -> dict:
        """Convert blockchain to dictionary format."""
        return {
            'chain': [block.to_dict() for block in self.chain],
            'pending_transactions': [tx.to_dict() for tx in self.pending_transactions],
            'difficulty': self.difficulty,
            'mining_reward': self.mining_reward,
            'wallets': self.wallets
        }

    @classmethod
    def from_dict(cls, data: dict) -> 'Blockchain':
        """Create a blockchain from dictionary format."""
        blockchain = cls()
        blockchain.chain = [Block.from_dict(block_data) for block_data in data['chain']]
        blockchain.pending_transactions = [Transaction.from_dict(tx_data) for tx_data in data['pending_transactions']]
        blockchain.difficulty = data['difficulty']
        blockchain.mining_reward = data['mining_reward']
        blockchain.wallets = data['wallets']
        return blockchain 