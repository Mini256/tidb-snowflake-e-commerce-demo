import * as React from 'react';
import ListItemButton from '@mui/material//ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShoppingBag from '@mui/icons-material/ShoppingBag';
import PeopleIcon from '@mui/icons-material/People';
import Home from '@mui/icons-material/Home';

export const mainListItems = (
  <React.Fragment>
    <ListItemButton href='/admin/introduction'>
      <ListItemIcon>
        <Home />
      </ListItemIcon>
      <ListItemText primary="Introduction" />
    </ListItemButton>
    <ListItemButton href='/admin/dashboard'>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    <ListItemButton href='/admin/customer'>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Customers" />
    </ListItemButton>
    <ListItemButton href='/admin/item'>
      <ListItemIcon>
        <ShoppingBag />
      </ListItemIcon>
      <ListItemText primary="Items" />
    </ListItemButton>
    <ListItemButton href='/admin/recommend'>
      <ListItemIcon>
        <ShoppingBag />
      </ListItemIcon>
      <ListItemText primary="Recommend Items" />
    </ListItemButton>
    <ListItemButton href='/admin/order'>
      <ListItemIcon>
        <ShoppingCartIcon />
      </ListItemIcon>
      <ListItemText primary="Orders" />
    </ListItemButton>
  </React.Fragment>
);
