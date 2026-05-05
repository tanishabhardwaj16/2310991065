"use client";

import React, { useState, useEffect } from "react";
import { 
  AppBar, 
  Box, 
  Toolbar, 
  Typography, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Badge,
  Button
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

const drawerWidth = 240;

export default function Navigation({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const { token, logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    router.push(path);
    setMobileOpen(false);
  };

  const fetchUnreadCount = async () => {
    if (!token) return;
    try {
      const res = await axios.get("http://20.207.122.201/evaluation-service/notifications/unread-count", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data && res.data.unreadCount !== undefined) {
        setUnreadCount(res.data.unreadCount);
      }
    } catch (err) {
      console.error("Failed to fetch unread count", err);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 15000); // Polling every 15s
    return () => clearInterval(interval);
  }, [token]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          NotifApp
        </Typography>
      </Toolbar>
      <List sx={{ mt: 2 }}>
        <ListItem disablePadding>
          <ListItemButton 
            selected={pathname === "/"} 
            onClick={() => handleNavigation("/")}
            sx={{ borderRadius: "0 24px 24px 0", mr: 2, mb: 1 }}
          >
            <ListItemIcon>
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon color={pathname === "/" ? "primary" : "inherit"} />
              </Badge>
            </ListItemIcon>
            <ListItemText primary="All Notifications" sx={{ color: pathname === "/" ? "primary.main" : "inherit" }} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton 
            selected={pathname === "/priority"} 
            onClick={() => handleNavigation("/priority")}
            sx={{ borderRadius: "0 24px 24px 0", mr: 2 }}
          >
            <ListItemIcon>
              <PriorityHighIcon color={pathname === "/priority" ? "primary" : "inherit"} />
            </ListItemIcon>
            <ListItemText primary="Priority Inbox" sx={{ color: pathname === "/priority" ? "primary.main" : "inherit" }} />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: 1
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {pathname === "/priority" ? "Priority Notifications" : "All Notifications"}
          </Typography>
          <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none', boxShadow: 1 },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, minHeight: '100vh', bgcolor: 'background.default' }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
