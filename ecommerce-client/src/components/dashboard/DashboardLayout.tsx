import React from 'react';
import { Link } from 'react-router-dom';
import { ListItem, ListItemIcon, ListItemText } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import CollectionsIcon from '@mui/icons-material/Collections';

const DashboardLayout: React.FC = () => {
  return (
    <div>
      {/* Existing code */}
      <ListItem button component={Link} href="/dashboard/products">
        <ListItemIcon>
          <InventoryIcon />
        </ListItemIcon>
        <ListItemText primary="Products" />
      </ListItem>
      <ListItem button component={Link} href="/dashboard/collections">
        <ListItemIcon>
          <CollectionsIcon />
        </ListItemIcon>
        <ListItemText primary="Collections" />
      </ListItem>
      {/* Existing code */}
    </div>
  );
};

export default DashboardLayout; 