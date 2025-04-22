import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface CreateTransactionModalProps {
  open: boolean;
  onClose: () => void;
  onTransactionCreated: () => void;
}

export default function CreateTransactionModal({
  open,
  onClose,
  onTransactionCreated,
}: CreateTransactionModalProps) {
  const [fromAddress, setFromAddress] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/transaction`, {
        from_address: fromAddress,
        to_address: toAddress,
        amount: parseFloat(amount),
        private_key: privateKey,
      });
      toast.success("Transaction created successfully!");
      onTransactionCreated();
      onClose();
    } catch (error) {
      console.error("Error creating transaction:", error);
      toast.error("Failed to create transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Transaction</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="From Address"
              value={fromAddress}
              onChange={(e) => setFromAddress(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="To Address"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
              required
              inputProps={{ min: 0, step: 0.1 }}
            />
            <TextField
              label="Private Key"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              fullWidth
              required
              type="password"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            Send Transaction
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
