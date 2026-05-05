import React from "react";
import { Card, CardContent, Typography, Box, Chip, Avatar } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
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

  const theme = useTheme();

  const cardSx = {
    mb: 2,
    // Always show a teal highlight on the left for visual consistency
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    // Use theme surface for card background so it respects dark/light mode.
    bgcolor: theme.palette.background.paper,
    transition: "transform 0.2s",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: 2,
    },
  };

  return (
    <Card sx={cardSx}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
          <Avatar
            sx={(t) => ({
              bgcolor:
                (t.palette[getTypeColor(Type)] && t.palette[getTypeColor(Type)].light) ||
                alpha(t.palette.primary.main, 0.12),
              color:
                (t.palette[getTypeColor(Type)] && t.palette[getTypeColor(Type)].main) ||
                t.palette.primary.main,
            })}
          >
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
              {/** Type chip with outlined/soft surface using palette */}
              {
                (() => {
                  const key = getTypeColor(Type);
                  const pal = theme.palette[key] || theme.palette.primary;
                  return (
                    <Chip
                      label={Type}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: alpha(pal.main, 0.22),
                        color: pal.main,
                        backgroundColor: alpha(pal.main, 0.02),
                      }}
                    />
                  );
                })()
              }

              {Priority && Priority !== "low" && (
                (() => {
                  const key = getPriorityColor(Priority);
                  const pal = theme.palette[key] || theme.palette.warning || theme.palette.primary;
                  const textCol = pal.contrastText || (theme.palette.mode === 'dark' ? '#061418' : '#fff');
                  return (
                    <Chip
                      label={Priority}
                      size="small"
                      sx={{
                        backgroundColor: pal.main,
                        color: textCol,
                      }}
                    />
                  );
                })()
              )}

              {(!isRead) && (
                <Chip
                  label="New"
                  size="small"
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText || '#021217',
                  }}
                />
              )}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
