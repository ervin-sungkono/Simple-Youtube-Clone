import { styled, useTheme } from '@mui/material/styles'
import { useState } from 'react';
import { 
  Box, 
  Drawer as MuiDrawer, 
  AppBar as MuiAppBar, 
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemButton,
  ListItemText,
  Divider, 
  IconButton, 
  Link,
  ListItemAvatar,
  Avatar,
  Typography
} from '@mui/material'
import { Menu, ChevronLeft, Home } from '@mui/icons-material';
import SearchBar from './SearchBar';
import Image from 'next/image';
import { useRouter } from 'next/router';
import useLoading from '../util/use-loading';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function DrawerLayout({children, channels}) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [autocomplete, setAutocomplete] = useState([])
  const isLoading = useLoading()
  const router = useRouter()

  const links = [
    {label: 'Home', url: '/', icon: <Home/>},
  ]

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const getSearchAutocomplete = async(query) => {
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/suggestions?query=${query}`)
      .then(res => res.json())
      .then(data => setAutocomplete(data.data))
  }

  const handleSearch = async(query) => {
    router.push(`/search?query=${query}`)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 3,
              ...(open && { display: 'none' }),
            }}
          >
            <Menu />
          </IconButton>
          <Link href='/' sx={{display: 'flex'}}>
            {theme.palette.mode === 'light' ?
            <Image src={"/static/yt-logo.png"} width={128} height={56} alt="" style={{objectFit: 'contain'}} priority/> :
            <Image src={"/static/yt-logo-white.png"} width={128} height={56} alt="" style={{objectFit: 'contain'}} priority/>
            }
          </Link>
          <SearchBar data={autocomplete} getSearchAutocomplete={getSearchAutocomplete} handleSearch={handleSearch}/>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeft />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {links.map((link, index) => (
            <Link href={link.url} color='inherit' underline='none' key={link.label}>
              <ListItem disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {link.icon}
                  </ListItemIcon>
                  <ListItemText primary={link.label} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
        </List>
        <Divider variant='middle' />
        <List>
          <Typography
            gutterBottom
            sx={{
              px: 2.5,
              display: open ? 'block' : 'none',
            }}
            variant='subtitle'
          >
            Subscriptions
          </Typography>
          {(isLoading ? [] : channels).map((channel) => (
            <Link href={`/channel?id=${channel.id}`} color='inherit' underline='none' key={channel.id}>
              <ListItem disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemAvatar
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                    }}
                  >
                    <Avatar alt="" src={channel.icon} />
                  </ListItemAvatar>
                  <ListItemText primary={channel.name} sx={{ opacity: open ? 1 : 0, overflow: "hidden", textOverflow: "ellipsis"}} />
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
        <DrawerHeader/>
        {children}
      </Box>
    </Box>
  );
}