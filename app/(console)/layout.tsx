import DrawerLink from '@/lib/mui/DrawerLink';
import GitHubIcon from '@mui/icons-material/GitHub';
import AppBar from '@mui/material/AppBar';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import Toolbar from '@mui/material/Toolbar';
import { clsx } from 'clsx';
import Link from 'next/link';

import styles from './layout.module.css';

export default function ConsoleLayout({ children }: LayoutProps<'/'>) {
  return (
    <div className={clsx(styles.grid, 'h-screen')}>
      <AppBar position="fixed" elevation={2}>
        <Toolbar>
          <Link href="/" className="typography-h6">
            Raphael
          </Link>
        </Toolbar>
      </AppBar>

      <Drawer
        className="row-span-2 w-80"
        slotProps={{ paper: { className: 'w-80 border-TableCell-border' } }}
        variant="permanent"
      >
        <Toolbar className="shrink-0" />

        <List component="nav">
          <List
            component="div"
            subheader={
              <ListSubheader className="m-0 leading-9" component="h6">
                Projects
              </ListSubheader>
            }
          >
            <DrawerLink href="/repositories" icon={<GitHubIcon />} primary="Repositories" />
          </List>
        </List>
      </Drawer>

      <Toolbar />

      <main className="col-start-2 row-start-2 flex flex-col overflow-hidden">{children}</main>
    </div>
  );
}
