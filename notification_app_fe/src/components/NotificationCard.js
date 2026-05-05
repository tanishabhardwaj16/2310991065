import React from "react";
import { Card, CardContent, Typography, Box, Chip, Avatar } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import WorkIcon from "@mui/icons-material/Work";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { format, formatDistanceToNow } from "date-fns";

export default function NotificationCard({ notification }) {
  const Title = notification.Title || notification.title;
  const Message = notification.Message || notification.message;
  const Type = notification.Type || notification.type;
  const Priority = notification.Priority || notification.priority;
  const isRead = notification.isRead !== undefined ? notification.isRead : notification.IsRead;
  const Timestamp = notification.Timestamp || notification.createdAt;

  const getTypeIcon = (type) => {
    switch (type) {
      case "Event": return <EventIcon />;
      case "Result": return <AssignmentTurnedInIcon />;
      case "Placement": return <WorkIcon />;
      default: return <NotificationsActiveIcon />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "critical": return "error";
      case "high": return "warning";
      case "medium": return "info";
      default: return "default";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Event": return "primary";
      case "Result": return "secondary";
      case "Placement": return "success";
      default: return "default";
    }
  };

  const formattedDate = Timestamp ? formatDistanceToNow(new Date(Timestamp), { addSuffix: true }) : "";

  return (
    <Card 
      sx={{ 
        mb: 2, 
        borderLeft: isRead ? "none" : "4px solid #1976d2",
        bgcolor: isRead ? "background.paper" : "#f8fbff",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 2
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
          <Avatar sx={{ bgcolor: getTypeColor(Type) + ".light", color: getTypeColor(Type) + ".main" }}>
            {getTypeIcon(Type)}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
              <Typography variant="h6" component="div" sx={{ fontWeight: isRead ? 500 : 700, fontSize: "1.1rem" }}>
                {Title || Type}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formattedDate}
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1.5, fontWeight: isRead ? 400 : 500 }}>
              {Message}
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Chip label={Type} size="small" color={getTypeColor(Type)} variant="outlined" />
              {Priority && Priority !== "low" && (
                <Chip label={Priority} size="small" color={getPriorityColor(Priority)} />
              )}
              {!isRead && (
                <Chip label="New" size="small" color="primary" />
              )}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
