import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Typography,
  Box,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import toast from "react-hot-toast";
import { InfoOutlined } from "@mui/icons-material";

interface Wallet {
  address: string;
  private_key: string;
  balance: number;
}

interface WalletsTableProps {
  wallets: Wallet[];
}

export default function WalletsTable({ wallets }: WalletsTableProps) {
  const copyToClipboard = (text: string, label: string) => {
    const formattedText = text.replace(/\n/g, "\\n");
    navigator.clipboard.writeText(formattedText);
    toast.success(`${label} copied to clipboard!`);
  };

  const truncateString = (str: string, maxLength: number = 20) => {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength) + "...";
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Address</TableCell>
            <TableCell>Private Key</TableCell>
            <TableCell align="right">
              Balance
              <span>
                <Tooltip title="Mine transactions to update this value">
                  <InfoOutlined
                    sx={{ fontSize: "12px", mb: "5px" }}
                    color="warning"
                  />
                </Tooltip>
              </span>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {wallets.map((wallet, index) => (
            <TableRow key={index}>
              <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                    {truncateString(wallet.address)}
                  </Typography>
                  <Tooltip title="Copy address">
                    <IconButton
                      size="small"
                      onClick={() => copyToClipboard(wallet.address, "Address")}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
              <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                    {truncateString(wallet.private_key)}
                  </Typography>
                  <Tooltip title="Copy private key">
                    <IconButton
                      size="small"
                      onClick={() =>
                        copyToClipboard(wallet.private_key, "Private key")
                      }
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body1" fontWeight="medium">
                  {wallet.balance}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
