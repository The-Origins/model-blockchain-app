"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Box,
  Chip,
  Stack,
  Tabs,
  Tab,
  Paper,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import CreateWalletModal from "@/components/CreateWalletModal";
import CreateTransactionModal from "@/components/CreateTransactionModal";
import WalletsTable from "@/components/WalletsTable";
import MinerAddressModal from "@/components/MinerModal";
import { InfoOutlined } from "@mui/icons-material";

interface BlockchainStatus {
  chain_length: number;
  pending_transactions: number;
  difficulty: number;
  mining_reward: number;
  is_valid: boolean;
}

interface Transaction {
  from_address: string;
  to_address: string;
  amount: number;
  timestamp: number;
  signature: string;
}

interface Block {
  hash: string;
  previous_hash: string;
  timestamp: number;
  transactions: Transaction[];
  nonce: number;
  difficulty: number;
}

interface Wallet {
  address: string;
  private_key: string;
  balance: number;
}

export default function Home() {
  const [status, setStatus] = useState<BlockchainStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [createWalletModalOpen, setCreateWalletModalOpen] = useState(false);
  const [createTransactionModalOpen, setCreateTransactionModalOpen] =
    useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [minerAddressModalOpen, setMinerAddressModalOpen] = useState(false);

  useEffect(() => {
    update();
  }, []);

  const update = async () => {
    await fetchStatus();
    await fetchTransactions();
    await fetchBlocks();
    await fetchWallets();
  };

  const fetchStatus = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/blockchain/status`
      );
      setStatus(response.data);
    } catch (error) {
      console.error("Error fetching blockchain status:", error);
      toast.error("Failed to fetch blockchain status");
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/pending-transactions`
      );
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to fetch transactions");
    }
  };

  const fetchBlocks = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/blocks`);
      setBlocks(response.data);
    } catch (error) {
      console.error("Error fetching blocks:", error);
      toast.error("Failed to fetch blocks");
    }
  };

  const fetchWallets = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/wallets`);
      setWallets(response.data.wallets);
    } catch (error) {
      console.error("Error fetching wallets:", error);
      toast.error("Failed to fetch wallets");
    }
  };

  const handleCreateWallet = () => {
    setCreateWalletModalOpen(true);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="64vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={9}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  Stats
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                          Chain Length
                        </Typography>
                        <Typography variant="h4">
                          {status?.chain_length}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                          Pending Transactions
                        </Typography>
                        <Typography variant="h4">
                          {status?.pending_transactions}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                          Difficulty
                          <span>
                            <Tooltip title="How many zeros the hash must start with (in real life this value is 17+ zeros)">
                              <InfoOutlined
                                sx={{ fontSize: "12px", mb: "5px" }}
                              />
                            </Tooltip>
                          </span>
                        </Typography>
                        <Typography variant="h4">
                          {status?.difficulty}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                          Mining Reward
                          <span>
                            <Tooltip title="The reward for mining a block">
                              <InfoOutlined
                                sx={{ fontSize: "12px", mb: "5px" }}
                              />
                            </Tooltip>
                          </span>
                        </Typography>
                        <Typography variant="h4">
                          {status?.mining_reward}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                <Box mt={2}>
                  <Chip
                    label={status?.is_valid ? "Chain Valid" : "Chain Invalid"}
                    color={status?.is_valid ? "success" : "error"}
                    size="small"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  Quick Actions
                </Typography>
                <Box display="flex" gap={2} flexDirection={"column"} mt={3}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreateWallet}
                  >
                    Create Wallet
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setCreateTransactionModalOpen(true)}
                  >
                    Create Transaction
                  </Button>
                  <Tooltip
                    title={
                      transactions.length === 0 ? "No transactions to mine" : ""
                    }
                  >
                    <span style={{ width: "100%" }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        color="primary"
                        onClick={() => setMinerAddressModalOpen(true)}
                        disabled={transactions.length === 0}
                      >
                        Mine Block
                      </Button>
                    </span>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      <Card variant="outlined">
        <CardContent>
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="Pending Transactions" />
            <Tab label="Blocks" />
            <Tab label="Wallets" />
          </Tabs>

          {tabValue === 0 && (
            <Stack spacing={3}>
              {transactions.length === 0 ? (
                <Typography color="textSecondary" textAlign="center" py={4}>
                  No pending transactions
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {transactions.map((tx, index) => (
                    <Paper key={index} variant="outlined" sx={{ p: 2 }}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="flex-start"
                      >
                        <Box>
                          <Typography variant="body2">
                            From: {tx.from_address || "Mining Reward"}
                          </Typography>
                          <Typography variant="body2">
                            To: {tx.to_address}
                          </Typography>
                        </Box>
                        <Box textAlign="right">
                          <Typography variant="h6">{tx.amount}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            {new Date(tx.timestamp * 1000).toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              )}
            </Stack>
          )}

          {tabValue === 1 && (
            <Stack spacing={3}>
              {blocks.map((block, index) => (
                <Paper key={block.hash} variant="outlined" sx={{ p: 3 }}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                  >
                    <Box>
                      <Typography variant="h6">Block #{index}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Timestamp:{" "}
                        {new Date(block.timestamp * 1000).toLocaleString()}
                      </Typography>
                    </Box>
                    <Box textAlign="right">
                      <Typography
                        variant="body2"
                        sx={{ wordBreak: "break-all" }}
                      >
                        Hash: {block.hash}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ wordBreak: "break-all" }}
                      >
                        Previous: {block.previous_hash}
                      </Typography>
                    </Box>
                  </Box>

                  <Box mt={2}>
                    <Typography variant="subtitle1" gutterBottom>
                      Transactions
                    </Typography>
                    <Stack spacing={2}>
                      {block.transactions.map((tx, txIndex) => (
                        <Paper key={txIndex} variant="outlined" sx={{ p: 2 }}>
                          <Box display="flex" justifyContent="space-between">
                            <Box>
                              <Typography variant="body2">
                                From: {tx.from_address || "Mining Reward"}
                              </Typography>
                              <Typography variant="body2">
                                To: {tx.to_address}
                              </Typography>
                            </Box>
                            <Typography variant="body1" fontWeight="medium">
                              {tx.amount}
                            </Typography>
                          </Box>
                        </Paper>
                      ))}
                    </Stack>
                  </Box>

                  <Box
                    display="flex"
                    justifyContent="space-between"
                    sx={{ mt: 2 }}
                  >
                    <Typography variant="body2" color="textSecondary">
                      Nonce: {block.nonce}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Difficulty: {block.difficulty}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Stack>
          )}

          {tabValue === 2 && (
            <Stack spacing={3}>
              {wallets.length === 0 ? (
                <Typography color="textSecondary" textAlign="center" py={4}>
                  No wallets found
                </Typography>
              ) : (
                <WalletsTable wallets={wallets} />
              )}
            </Stack>
          )}
        </CardContent>
      </Card>
      <MinerAddressModal
        open={minerAddressModalOpen}
        onClose={() => setMinerAddressModalOpen(false)}
        onMine={() => {
          update();
        }}
      />

      <CreateWalletModal
        open={createWalletModalOpen}
        onClose={() => setCreateWalletModalOpen(false)}
        fetchWallets={fetchWallets}
      />

      <CreateTransactionModal
        open={createTransactionModalOpen}
        onClose={() => setCreateTransactionModalOpen(false)}
        onTransactionCreated={() => {
          fetchTransactions();
          fetchStatus();
          fetchWallets();
        }}
      />
    </Stack>
  );
}
