from Crypto.Hash import SHA256
import time
from typing import List
from .transaction import Transaction

class Block:
    def __init__(self, timestamp: float, transactions: List[Transaction], previous_hash: str):
        self.timestamp = timestamp
        self.transactions = transactions
        self.previous_hash = previous_hash
        self.hash = None
        self.nonce = 0
        self.difficulty = 2  # Number of leading zeros required in hash

    def calculate_hash(self) -> str:
        """Calculate the hash of the block."""
        block_string = f"{self.timestamp}{self.previous_hash}{self.nonce}"
        for transaction in self.transactions:
            block_string += transaction.calculate_hash()
        return SHA256.new(block_string.encode()).hexdigest()

    def mine_block(self) -> None:
        """Mine the block by finding a valid nonce."""
        while True:
            self.hash = self.calculate_hash()
            if self.hash.startswith('0' * self.difficulty):
                break
            self.nonce += 1

    def is_valid(self) -> bool:
        """Check if the block is valid."""
        # Verify the block's hash
        if self.calculate_hash() != self.hash:
            return False

        # Verify the hash meets the difficulty requirement
        if not self.hash.startswith('0' * self.difficulty):
            return False

        # Verify all transactions in the block
        for transaction in self.transactions:
            if not transaction.is_valid():
                return False

        return True

    def to_dict(self) -> dict:
        """Convert block to dictionary format."""
        return {
            'timestamp': self.timestamp,
            'transactions': [tx.to_dict() for tx in self.transactions],
            'previous_hash': self.previous_hash,
            'hash': self.hash,
            'nonce': self.nonce,
            'difficulty': self.difficulty
        }

    @classmethod
    def from_dict(cls, data: dict) -> 'Block':
        """Create a block from dictionary format."""
        transactions = [Transaction.from_dict(tx) for tx in data['transactions']]
        block = cls(data['timestamp'], transactions, data['previous_hash'])
        block.hash = data['hash']
        block.nonce = data['nonce']
        block.difficulty = data['difficulty']
        return block 