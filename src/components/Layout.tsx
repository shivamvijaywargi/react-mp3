import { Box } from '@mui/material';
import Header from './Header';

type Props = { children: React.ReactNode };

const Layout = ({ children }: Props) => {
  return (
    <Box>
      <Header />
      {children}
    </Box>
  );
};

export default Layout;
