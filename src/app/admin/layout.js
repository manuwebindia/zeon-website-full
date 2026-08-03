import AdminShell from './AdminShell';

export const metadata = {
  title: 'Admin',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function AdminLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}
