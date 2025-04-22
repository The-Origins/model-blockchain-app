from Crypto.PublicKey import RSA
from Crypto.Signature import PKCS1_v1_5
from Crypto.Hash import SHA256
import base64

class Wallet:
    def __init__(self, balance: float = 0.0):
        self.private_key = RSA.generate(2048)
        self.public_key = self.private_key.publickey()
        self.balance = balance

    def get_address(self) -> str:
        """Get the wallet's public address (public key)."""
        return self.public_key.export_key().decode()

    def get_private_key(self) -> str:
        """Get the wallet's private key."""
        return self.private_key.export_key().decode()

    def sign_transaction(self, transaction_hash: str) -> bytes:
        """Sign a transaction hash with the wallet's private key."""
        hash_obj = SHA256.new(transaction_hash.encode())
        signer = PKCS1_v1_5.new(self.private_key)
        return signer.sign(hash_obj)

    def to_dict(self) -> dict:
        """Convert wallet to dictionary format."""
        return {
            'address': self.get_address(),
            'private_key': self.get_private_key(),
            'balance': self.balance
        }

    @classmethod
    def from_dict(cls, data: dict) -> 'Wallet':
        """Create a wallet from dictionary format."""
        wallet = cls()
        wallet.private_key = RSA.import_key(data['private_key'].encode())
        wallet.public_key = wallet.private_key.publickey()
        wallet.balance = data['balance']
        return wallet

    @classmethod
    def from_private_key(cls, private_key_str: str) -> 'Wallet':
        """Create a wallet from a private key string."""
        wallet = cls()
        wallet.private_key = RSA.import_key(private_key_str.encode())
        wallet.public_key = wallet.private_key.publickey()
        return wallet 