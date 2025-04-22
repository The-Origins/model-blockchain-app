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
  
  interface MinerAddressModalProps {
    open: boolean;
    onClose: () => void;
    onMine: () => void;
  }
  
  export default function MinerAddressModal({
    open,
    onClose,
    onMine,
  }: MinerAddressModalProps) {
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
  
      try {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/mine`, {
          address,
        });
        toast.success("Block mined successfully!");
        onMine();
        onClose();
      } catch (error) {
        console.error("Error mining block:", error);
        toast.error("Failed to mine block");
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Mine Block</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                label="Miner Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                fullWidth
                required
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading || address === ""}
            >
              Mine Block
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  }
  