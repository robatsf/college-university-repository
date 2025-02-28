import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Card, CardContent, CardHeader, styled } from "@mui/material";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { FileText, Download, Upload, Building } from "lucide-react";
import { apibase } from "../dataProvider";
import StatCard from "../components/StatCard";
import WelcomeCard from "../components/WelcomeCard";
import { tokenManager } from "../utils/tokenManager";

// Types
interface Department {
  id: string;
  name: string;
  file_count: number;
  download_total: number;
  history_total: number;
  unapproved_files: number;
  created_at: string;
  updated_time: string;
}

interface DepartmentStats {
  total_departments: number;
  total_files: number;
  total_downloads: number;
  total_history: number;
  total_unapproved: number;
}

interface ApiResponse {
  status: string;
  message: string;
  data: {
    departments: Department[];
    statistics: DepartmentStats;
  };
}

// Styled Components
export const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
}));

export const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  background: theme.palette.mode === 'light' 
    ? theme.palette.grey[50] 
    : theme.palette.grey[900],
  borderBottom: `1px solid ${theme.palette.divider}`,
  '& .MuiCardHeader-title': {
    fontSize: '1.125rem',
    fontWeight: 600,
    color: theme.palette.text.primary,
  },
  '& .MuiCardHeader-subheader': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary,
  },
  padding: theme.spacing(2),
}));

// Constants
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const LibrarianDashboard = () => {
  const role = "librarian";
  const name = localStorage.getItem("name") || "Librarian";

  const [departments, setDepartments] = useState<Department[]>([]);
  const [stats, setStats] = useState<DepartmentStats>({
    total_departments: 0,
    total_files: 0,
    total_downloads: 0,
    total_history: 0,
    total_unapproved: 0,
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = await tokenManager.getAuthHeaders();
        if (!token) throw new Error('No token found');


        const response = await fetch(`${apibase}/departments/?all=true`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': '*/*',
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch departments');
        
        const result: ApiResponse = await response.json();
        
        if (result.status === 'success') {
          setDepartments(result.data.departments);
          setStats(result.data.statistics);
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchDepartments();
  }, []);

  const chartData = departments.map(dept => ({
    name: dept.name,
    uploads: dept.file_count,
    downloads: dept.download_total,
    value: dept.history_total,
  }));

  return (
    <Box p={3}>
      <WelcomeCard role={role} name={name} />

      <Grid container spacing={4}>
        {/* Statistics Cards */}
        <Grid item xs={12} md={4}>
          <StatCard 
            title="Total Departments" 
            value={stats.total_departments} 
            icon={Building} 
            trend={0} 
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard 
            title="Total Files" 
            value={stats.total_files} 
            icon={Upload} 
            trend={12} 
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard 
            title="Total Downloads" 
            value={stats.total_downloads} 
            icon={Download} 
            trend={8} 
          />
        </Grid>
        {/* <Grid item xs={12} md={3}>
          <StatCard
            title="Pending Approvals"
            value={stats.total_unapproved}
            icon={FileText}
            trend={-2}
          />
        </Grid> */}

        {/* Charts */}
        <Grid item xs={12}>
          <StyledCard>
            <StyledCardHeader title="Department Statistics" />
            <CardContent>
              <Box display="flex" gap={2}>
                <Box flex={2} height={400}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="uploads" fill="#1976d2" name="Files" />
                      <Bar dataKey="downloads" fill="#dc004e" name="Downloads" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
                
                <Box flex={1} height={400}>
                  <Typography variant="h6" gutterBottom>
                    Department Activity Distribution
                  </Typography>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {chartData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LibrarianDashboard;