import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, CircularProgress } from "@mui/material";
import customDataProvider from "../dataProvider";
import StatCard from "../components/StatCard";
import WelcomeCard from "../components/WelcomeCard";
import { Users, Download, Upload, AlertCircle } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartDataItem {
  name: string;
  value: number;
}

const DepartmentDashboard = () => {
  const role = "departmentHead";
  const name = localStorage.getItem("name") || "Department Head";

  // State for department data
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState<ChartDataItem[]>([
    { name: "Total Files", value: 0 },
    { name: "Total Downloads", value: 0 },
  ]);
  const [statistics, setstatistics] = useState(0)

  useEffect(() => {
    const fetchDepartmentData = async () => {
      try {
        const departmentData = await customDataProvider.getdepartemnt("departments", {});
          setDepartment(departmentData.data.departments[0]);
          
          // Update chart data when department data is available
          setChartData([
            { name: "Total Files", value: departmentData.data.departments[0].file_count },
            { name: "Total Downloads", value: departmentData.data.departments[0].download_total },
          ]);
          setstatistics(departmentData.data.statistics.total_departments)
        
      } catch (err) {
        setError("Error loading department data");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartmentData();
  }, []);

  // Calculate the trend based on the time since creation
  const calculateTrend = (value) => {
    if (!department || !department.created_at) return 0;
    const createdAt = new Date(department.created_at);
    const now = new Date();
    const timeDiff = Math.abs(now - createdAt);
    const daysSinceCreation = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return value / daysSinceCreation;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography style={{ color: 'red', textAlign: 'center' }}>{error}</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <WelcomeCard role={role} name={name} />

      <Grid container spacing={3}>
        {department ? (
          <>
            <Grid item xs={12} md={4}>
              <StatCard
                title="Total Files"
                value={department.file_count}
                icon={Upload}
                trend={calculateTrend(department.file_count)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard
                title="Total Downloads"
                value={department.download_total}
                icon={Download}
                trend={calculateTrend(department.download_total)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard
                title="Total department"
                value={statistics}
                icon={Users}
                trend={calculateTrend(statistics)}
              />
            </Grid>

            <Grid item xs={12}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#1976d2" />
                </BarChart>
              </ResponsiveContainer>
            </Grid>
          </>
        ) : (
          <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <Typography style={{ color: 'red', textAlign: 'center' }}>No data Found</Typography>
          </Box>
        )}
      </Grid>
    </Box>
  );
};

export default DepartmentDashboard;