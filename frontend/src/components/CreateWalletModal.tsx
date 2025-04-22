import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Paper,
    Typography,
    Box,
    IconButton,
    Tooltip,
    CircularProgress,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface CreateWalletModalProps {
    open: boolean;
    onClose: () => void;
    fetchWallets: () => void;
}

export default function CreateWalletModal({ open, onClose, fetchWallets }: CreateWalletModalProps) {
    const [loading, setLoading] = useState(false);
    const [wallet, setWallet] = useState<{
        address: string;
        private_key: string;
        balance: number;
    } | null>(null);

    useEffect(() => {
        if (open) {
            createWallet();
        }
    }, [open]);

    const createWallet = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/wallet/create`);
            setWallet(response.data);
            fetchWallets();
        } catch (error) {
            console.error('Error creating wallet:', error);
            toast.error('Failed to create wallet');
            onClose();
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string, label: string) => {
        const formattedText = text.replace(/\n/g, '\\n');
        navigator.clipboard.writeText(formattedText);
        toast.success(`${label} copied to clipboard!`);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>New Wallet Created</DialogTitle>
            <DialogContent>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                        <CircularProgress />
                    </Box>
                ) : wallet ? (
                    <>
                        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle2" color="textSecondary">
                                    Address
                                </Typography>
                                <Tooltip title="Copy address">
                                    <IconButton
                                        size="small"
                                        onClick={() => copyToClipboard(wallet.address, 'Address')}
                                    >
                                        <ContentCopyIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                                {wallet.address}
                            </Typography>
                        </Paper>

                        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle2" color="textSecondary">
                                    Private Key
                                </Typography>
                                <Tooltip title="Copy private key">
                                    <IconButton
                                        size="small"
                                        onClick={() => copyToClipboard(wallet.private_key, 'Private key')}
                                    >
                                        <ContentCopyIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                                {wallet.private_key}
                            </Typography>
                        </Paper>

                        <Paper variant="outlined" sx={{ p: 2 }}>
                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                Balance
                            </Typography>
                            <Typography variant="h4">
                                {wallet.balance}
                            </Typography>
                        </Paper>
                    </>
                ) : null}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
} 