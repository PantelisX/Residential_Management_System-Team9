import React, { useState, useEffect, useMemo } from 'react';
import maintenanceService from '../../services/maintenanceService';

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Stack
} from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';
import '../../styles/HistoryPage.css';

/**
 * HistoryPage component displays completed and cancelled tasks across all user residences
 * Features: sorting, filtering by residence and category, client-side processing
 */
const HistoryPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [residenceFilter, setResidenceFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('descending');

  // Derived state for filter options
  const [residences, setResidences] = useState([]);
  const [categories, setCategories] = useState([]);

  /**
   * Fetch history tasks on component mount
   */
  useEffect(() => {
    const fetchHistoryTasks = async () => {
      setLoading(true);
      try {
        const data = await maintenanceService.getHistoryTasks();
        const taskList = data.tasks || [];
        setTasks(taskList);

        // Extract unique residences and categories from tasks
        const uniqueResidences = [...new Set(taskList.map(t => t.address))].sort();
        const uniqueCategories = [...new Set(taskList.map(t => t.category))].sort();

        setResidences(uniqueResidences);
        setCategories(uniqueCategories);
        setError(null);
      } catch (err) {
        console.error('Error fetching history tasks:', err);
        setError('Failed to load task history. Please try again later.');
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryTasks();
  }, []);

  /**
   * Apply filters and sorting to tasks (client-side)
   */
  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // Apply residence filter
    if (residenceFilter) {
      result = result.filter(task => task.address === residenceFilter);
    }

    // Apply category filter
    if (categoryFilter) {
      result = result.filter(task => task.category === categoryFilter);
    }

    // Apply sorting by end_date
    result.sort((a, b) => {
      const dateA = a.end_date ? new Date(a.end_date) : new Date(0);
      const dateB = b.end_date ? new Date(b.end_date) : new Date(0);

      if (sortOrder === 'ascending') {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });

    return result;
  }, [tasks, residenceFilter, categoryFilter, sortOrder]);

  /**
   * Format date to readable string
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  /**
   * Get status chip color
   */
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  /**
   * Capitalize first letter of string
   */
  const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  /**
   * Handle clear filters
   */
  const handleClearFilters = () => {
    setResidenceFilter('');
    setCategoryFilter('');
    setSortOrder('descending');
  };

  /**
   * Handle toggle sort order
   */
  const handleToggleSortOrder = () => {
    setSortOrder(sortOrder === 'ascending' ? 'descending' : 'ascending');
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
        <Typography variant="h5" color="error" gutterBottom>
          Error
        </Typography>
        <Typography color="textSecondary">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      {/* Page Title */}
      <Typography variant="h4" gutterBottom color="primary" sx={{ mb: 4, fontWeight: 600 }}>
        Task History
      </Typography>

      {/* Filters Section */}
      <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f5f5f5' }}>
        <Grid container spacing={2} sx={{ alignItems: 'flex-end' }}>
          {/* Residence Filter */}
          <Grid xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel id="residence-filter-label">Residence</InputLabel>
              <Select
                labelId="residence-filter-label"
                id="residence-filter"
                value={residenceFilter}
                onChange={(e) => setResidenceFilter(e.target.value)}
                label="Residence"
              >
                <MenuItem value="">
                  <em>All Residences</em>
                </MenuItem>
                {residences.map((residence) => (
                  <MenuItem key={residence} value={residence}>
                    {residence}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Category Filter */}
          <Grid xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel id="category-filter-label">Category</InputLabel>
              <Select
                labelId="category-filter-label"
                id="category-filter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                label="Category"
              >
                <MenuItem value="">
                  <em>All Categories</em>
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {capitalize(category)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Sort Controls */}
          <Grid xs={12} sm={4}>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<SortIcon />}
                onClick={handleToggleSortOrder}
                fullWidth
              >
                Date: {capitalize(sortOrder)}
              </Button>
              <Button
                variant="text"
                size="small"
                onClick={handleClearFilters}
                sx={{ whiteSpace: 'nowrap' }}
              >
                Clear
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Results Count */}
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        Showing {filteredAndSortedTasks.length} task{filteredAndSortedTasks.length !== 1 ? 's' : ''}
      </Typography>

      {/* Empty State */}
      {filteredAndSortedTasks.length === 0 ? (
        <Card sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="textSecondary" variant="body1">
            {tasks.length === 0
              ? 'No task history available yet.'
              : 'No tasks match your filters. Try adjusting your selection.'}
          </Typography>
        </Card>
      ) : (
        /* Tasks Table */
        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 600 }}>Residence</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAndSortedTasks.map((task) => (
                <TableRow key={task.task_id} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
                  {/* Residence Address */}
                  <TableCell>
                    <Typography variant="body2">{task.address}</Typography>
                  </TableCell>

                  {/* Category */}
                  <TableCell>
                    <Chip
                      label={capitalize(task.category)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>

                  {/* Description */}
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {task.description || 'No description'}
                    </Typography>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Chip
                      label={capitalize(task.status)}
                      color={getStatusColor(task.status)}
                      size="small"
                    />
                  </TableCell>

                  {/* Completion/Cancellation Date */}
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Typography variant="body2">{formatDate(task.end_date)}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default HistoryPage;
