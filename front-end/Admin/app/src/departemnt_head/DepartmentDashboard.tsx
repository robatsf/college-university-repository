import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Card, CardContent, CardHeader } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useGetList } from "react-admin";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import StatCard from "../components/StatCard";
import WelcomeCard from "../components/WelcomeCard";
import { Users, Download, Upload } from "lucide-react";

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.2s",
  "&:hover": {
    transform: "translateY(-4px)",
  },
}));

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  background: theme.palette.grey[50],
}));

const DepartmentDashboard = () => {
  const role = "departmentHead";
  const name = localStorage.getItem("name") || "Department Head";

  // Define state for various statistics
  const [stats, setStats] = useState({
    totalUploads: 0,
    totalDownloads: 0,
    activeUsers: 0,
  });

  // State to control history section height
  const [historyExpanded, setHistoryExpanded] = useState(false);

  // Fetch data using react-admin's useGetList hook
  const { data: uploads } = useGetList("uploads", {
    pagination: { page: 1, perPage: 1 },
    sort: { field: "id", order: "DESC" },
  });

  const { data: downloads } = useGetList("downloads", {
    pagination: { page: 1, perPage: 1 },
    sort: { field: "id", order: "DESC" },
  });

  // Update statistics when uploads or downloads data changes
  useEffect(() => {
    setStats({
      totalUploads: uploads?.total || Math.floor(Math.random() * 100),
      totalDownloads: downloads?.total || Math.floor(Math.random() * 500),
      activeUsers: Math.floor(Math.random() * 50),
    });
  }, [uploads, downloads]);

  // Data for the weekly activity chart
  const activityData = [
    { name: "Mon", uploads: 4, downloads: 12 },
    { name: "Tue", uploads: 3, downloads: 15 },
    { name: "Wed", uploads: 5, downloads: 20 },
    { name: "Thu", uploads: 2, downloads: 18 },
    { name: "Fri", uploads: 3, downloads: 25 },
    { name: "Sat", uploads: 6, downloads: 10 },
    { name: "Sun", uploads: 4, downloads: 8 },
  ];

  // Sample history data for the History section
  const historyData = [
    { id: 1, title: "Uploaded Document A", date: "Mon 9:00 AM" },
    { id: 2, title: "Downloaded Document B", date: "Tue 10:15 AM" },
    { id: 3, title: "Approval Request for Document C", date: "Wed 11:30 AM" },
    { id: 4, title: "Updated Document D", date: "Thu 1:00 PM" },
    { id: 5, title: "Approved Document E", date: "Fri 2:45 PM" },
    { id: 6, title: "Uploaded Document F", date: "Sat 3:00 PM" },
    { id: 7, title: "Downloaded Document G", date: "Sun 4:30 PM" },
  ];

  return (
    <Box p={3}>
      {/* Welcome message */}
      <WelcomeCard role={role} name={name} />

      <Grid container spacing={3}>
        {/* Department Head-specific statistics */}
        <Grid item xs={12} md={4}>
          <StatCard
            title="Department Uploads"
            value={stats.totalUploads}
            icon={Upload}
            trend={12}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Department Downloads"
            value={stats.totalDownloads}
            icon={Download}
            trend={8}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Department Members"
            value={stats.activeUsers}
            icon={Users}
            trend={5}
          />
        </Grid>

        {/* Weekly Activity Chart and History Section */}
        <Grid item xs={12}>
          <StyledCard>
            <StyledCardHeader title="Weekly Activity" />
            <CardContent>
              <Box display="flex" gap={2}>
                {/* Chart Container */}
                <Box flex={2} height={300}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="uploads" fill="#1976d2" name="Uploads" />
                      <Bar dataKey="downloads" fill="#dc004e" name="Downloads" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
                {/* History Section */}
                <Box flex={1} display="flex" flexDirection="column">
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">History</Typography>
                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{ cursor: "pointer" }}
                      onClick={() => setHistoryExpanded(!historyExpanded)}
                    >
                      {historyExpanded ? "View Less" : "View All"}
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 1, height: historyExpanded ? 600 : 300, overflowY: "auto" }}>
                    {historyData.map((item) => (
                      <Box
                        key={item.id}
                        sx={{ mb: 1, p: 1, border: "1px solid #ddd", borderRadius: 1 }}
                      >
                        <Typography variant="subtitle2">{item.title}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {item.date}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DepartmentDashboard;
