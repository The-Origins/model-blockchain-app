'use client';

import { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Container, CssBaseline, ThemeProvider, Link } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { getTheme } from '@/theme';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [mode, setMode] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        const savedMode = localStorage.getItem('theme-mode') as 'light' | 'dark';
        if (savedMode) {
            setMode(savedMode);
        }
    }, []);

    const toggleColorMode = () => {
        const newMode = mode === 'light' ? 'dark' : 'light';
        setMode(newMode);
        localStorage.setItem('theme-mode', newMode);
    };

    return (
        <html lang="en">
            <body>
                <ThemeProvider theme={getTheme(mode)}>
                    <CssBaseline />
                    <AppBar position="static" color="default" elevation={1}>
                        <Toolbar>
                            <Link href="/" sx={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}>
                                <Typography variant="h6" component="div">
                                    Default Coin
                                </Typography>
                            </Link>
                            <IconButton onClick={toggleColorMode} color="inherit">
                                {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                    <Container maxWidth="lg" sx={{ py: 4 }}>
                        {children}
                    </Container>
                    <Toaster position="bottom-right" />
                </ThemeProvider>
            </body>
        </html>
    );
} 