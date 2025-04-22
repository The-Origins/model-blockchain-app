from Crypto.PublicKey import RSA
from Crypto.Signature import PKCS1_v1_5
from Crypto.Hash import SHA256
import time

class Transaction:
    def __init__(self, from_address: str, to_address: str, amount: float):
        self.from_address = from_address
        self.to_address = to_address
        self.amount = amount
        self.timestamp = time.time()
        self.signature = None

    def calculate_hash(self) -> str:
        """Calculate the hash of the transaction."""
        transaction_string = f"{self.from_address}{self.to_address}{self.amount}{self.timestamp}"
        return SHA256.new(transaction_string.encode()).hexdigest()

    def sign_transaction(self, signing_key: RSA.RsaKey) -> bool:
        """Sign the transaction with the sender's private key."""
        if signing_key.publickey().export_key().decode() != self.from_address:
            raise Exception("You cannot sign transactions for other wallets!")

        hash_obj = SHA256.new(self.calculate_hash().encode())
        signer = PKCS1_v1_5.new(signing_key)
        self.signature = signer.sign(hash_obj)
        return True

    def is_valid(self) -> bool:
        """Check if the transaction is valid."""
        if self.from_address is None:
            return True  # Mining reward transaction

        if not self.signature or len(self.signature) == 0:
            raise Exception("No signature in this transaction")

        try:
            # Verify the signature
            public_key = RSA.import_key(self.from_address.encode())
            hash_obj = SHA256.new(self.calculate_hash().encode())
            verifier = PKCS1_v1_5.new(public_key)
            return verifier.verify(hash_obj, self.signature)
        except Exception as e:
            return False

    def to_dict(self) -> dict:
        """Convert transaction to dictionary format."""
        return {
            'from_address': self.from_address,
            'to_address': self.to_address,
            'amount': self.amount,
            'timestamp': self.timestamp,
            'signature': self.signature.hex() if self.signature else None
        }

    @classmethod
    def from_dict(cls, data: dict) -> 'Transaction':
        """Create a transaction from dictionary format."""
        transaction = cls(data['from_address'], data['to_address'], data['amount'])
        transaction.timestamp = data['timestamp']
        if data['signature']:
            transaction.signature = bytes.fromhex(data['signature'])
        return transaction 