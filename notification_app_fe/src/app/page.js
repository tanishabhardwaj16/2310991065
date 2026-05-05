"use client";

import React, { useState, useEffect } from "react";
import { 
  Typography, 
  Box, 
  CircularProgress, 
  Alert,
  Pagination
} from "@mui/material";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import NotificationCard from "@/components/NotificationCard";
import { useRouter } from "next/navigation";
import { getMockNotifications } from "@/utils/mockData";

export default function AllNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  
  const { token, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !token) {
      router.push("/login");
    }
  }, [token, authLoading, router]);

  const fetchNotifications = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await axios.get("http://20.207.122.201/evaluation-service/notifications", {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit }
      });
      // Handle the case where the API returns { data: [...] } or just an array
      const data = res.data?.data || res.data?.notifications || res.data || [];
      const total = res.data?.total || data.length;
      
      setNotifications(data);
      setTotalPages(Math.ceil(total / limit) || 1);
      setError("");
    } catch (err) {
      console.warn("Failed to load notifications from API, falling back to mock data.", err);
      const mockData = getMockNotifications();
      setNotifications(mockData);
      setTotalPages(1);
      setError(""); // clear error since we use mock
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Implement polling
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [page, token]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  if (authLoading || (loading && notifications.length === 0)) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" color="text.primary">
          Inbox
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {notifications.length === 0 && !loading && !error && (
        <Alert severity="info">You have no notifications.</Alert>
      )}

      {notifications.map((notif, index) => (
        <NotificationCard key={notif.id || notif.ID || index} notification={notif} />
      ))}

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={handlePageChange} 
            color="primary" 
          />
        </Box>
      )}
    </Box>
  );
}
