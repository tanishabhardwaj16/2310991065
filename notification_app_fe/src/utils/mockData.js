// A helper file to generate mock data when API fails
export const getMockNotifications = () => {
  return [
    {
      id: "notif_01",
      title: "Assignment Deadline Reminder",
      message: "Your Data Structures assignment is due tomorrow at 11:59 PM.",
      type: "Event",
      priority: "high",
      isRead: false,
      createdAt: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
    },
    {
      id: "notif_02",
      title: "Google Hiring SWE Interns",
      message: "Google has opened applications for Summer 2026 SWE Internships.",
      type: "Placement",
      priority: "critical",
      isRead: false,
      createdAt: new Date(Date.now() - 7200000).toISOString() // 2 hours ago
    },
    {
      id: "notif_03",
      title: "Final Semester Results Declared",
      message: "The results for the Spring semester have been published on the portal.",
      type: "Result",
      priority: "medium",
      isRead: true,
      createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
    },
    {
      id: "notif_04",
      title: "Blood Donation Camp",
      message: "Join us for the annual blood donation camp this Friday at the main auditorium.",
      type: "Event",
      priority: "low",
      isRead: true,
      createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
    },
    {
      id: "notif_05",
      title: "Amazon SDE Mock Interview",
      message: "Your mock interview is scheduled for next Monday.",
      type: "Placement",
      priority: "high",
      isRead: true,
      createdAt: new Date(Date.now() - 259200000).toISOString() // 3 days ago
    }
  ];
};
