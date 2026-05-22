import React, { useState, useEffect } from 'react';
import tasksService from '../../services/tasksService';
import { 
  Box, Grid, Card, CardContent, Typography, 
  Select, MenuItem, FormControl, InputLabel, Chip 
} from '@mui/material';
import '../../styles/CurrentTasks.css';

const CurrentTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  
  const [timeFilter, setTimeFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('');

  const categories = ['electrical', 'plumbing', 'hvac', 'landscaping', 'other'];
  const timeOptions = ['Today', 'This Week', 'All'];

  const getStartDate = (filter) => {
    if (filter === 'All') return '';
    const date = new Date();
    
    if (filter === 'Today') {
      date.setDate(date.getDate() - 1); 
    } else if (filter === 'This Week') {
      date.setDate(date.getDate() - 7);
    }
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const startDate = getStartDate(timeFilter);
        
        const data = await tasksService.getCurrentTasks({
          startDate: startDate,
          category: categoryFilter
        });
        
        setTasks(data.tasks || []);
        setTotalCount(data.totalCount || 0);
        setError(null);
      } catch (err) {
        setError('Failed to fetch tasks');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [timeFilter, categoryFilter]);

  if (loading) return <Box sx={{ p: 3 }}><Typography>Loading tasks...</Typography></Box>;
  if (error) return <Box sx={{ p: 3 }}><Typography color="error">Error: {error}</Typography></Box>;

  return (
    <Box sx={{ padding: 3, maxWidth: 1000, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom color="primary">
        Current Tasks
      </Typography>

      {/* FILTERS */}
      <Grid container spacing={3} alignItems="center" mb={4}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Time Filter</InputLabel>
            <Select 
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              label="Time Filter"
            >
              {timeOptions.map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              label="Category"
            >
              <MenuItem value=""><em>All Categories</em></MenuItem>
              {categories.map(category => (
                <MenuItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* TASKS LIST */}
      {tasks.length === 0 ? (
        <Typography variant="body1">No current tasks found for these filters.</Typography>
      ) : (
        <Grid container spacing={3}>
          {tasks.map(task => (
            <Grid item xs={12} md={6} key={task.task_id}>
              <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">Task #{task.task_id}</Typography>
                    <Chip 
                      label={task.status === 'in_progress' ? 'In Progress' : 'Open'} 
                      color={task.status === 'in_progress' ? 'warning' : 'success'} 
                      size="small" 
                    />
                  </Box>
                  
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    <strong>Address:</strong> {task.address}
                  </Typography>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    <strong>Category:</strong> {task.category.toUpperCase()}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 2, mb: 2 }}>
                    {task.description || "No description provided."}
                  </Typography>
                  
                  <Box display="flex" justifyContent="space-between" mt="auto" pt={2} borderTop="1px solid #eee">
                    <Typography variant="caption" color="text.secondary">
                      Start: {task.start_date ? new Date(task.start_date).toLocaleDateString() : '-'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      End: {task.end_date ? new Date(task.end_date).toLocaleDateString() : '-'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* FOOTER SUMMARY */}
      <Box mt={4} p={2} bgcolor="#f5f5f5" borderRadius={2}>
        <Typography variant="subtitle1" fontWeight="bold">
          Total number of tasks: {totalCount}
        </Typography>
      </Box>
    </Box>
  );
};

export default CurrentTasks;