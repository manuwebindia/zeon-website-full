'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { baselightTheme } from './theme';

export default function AdminRootLayout({ children }) {
  return (
    <ThemeProvider theme={baselightTheme}>
      <CssBaseline />
      <div style={{ minHeight: '100vh', width: '100%', backgroundColor: '#f4f6f9' }}>
        {children}
      </div>
    </ThemeProvider>
  );
}
