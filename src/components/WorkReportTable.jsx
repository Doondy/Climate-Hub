import React, { useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Search, Edit, Trash2, Briefcase } from 'lucide-react';
import { workReportAPI } from '../services/api.js';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const TableContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  margin-top: 20px;
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const TableTitle = styled.h3`
  color: #333;
  font-size: 1.3rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SearchContainer = styled.div`
  position: relative;
  width: 360px;
  max-width: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 40px 12px 45px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
`;

const ClearButton = styled.button`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  transition: background 0.2s ease;
  
  &:hover {
    background: #f1f5f9;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background: #f8f9fa;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #e1e5e9;
  transition: background 0.2s ease;
  
  &:hover {
    background: #f8f9fa;
  }
`;

const TableHeaderCell = styled.th`
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TableCell = styled.td`
  padding: 15px;
  color: #666;
  font-size: 0.9rem;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${(p) =>
    p.status === 'completed' ? '#ecfdf5' :
    p.status === 'in-progress' ? '#dbeafe' :
    p.status === 'pending' ? '#fef3c7' :
    p.status === 'blocked' ? '#fee2e2' : '#f3f4f6'};
  color: ${(p) =>
    p.status === 'completed' ? '#059669' :
    p.status === 'in-progress' ? '#0284c7' :
    p.status === 'pending' ? '#d97706' :
    p.status === 'blocked' ? '#dc2626' : '#6b7280'};
`;

const LocationBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${(p) => p.location === 'home' ? '#ecfdf5' : '#dbeafe'};
  color: ${(p) => p.location === 'home' ? '#059669' : '#0284c7'};
`;

const ActionCell = styled(TableCell)`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  background: ${(p) =>
    p.variant === 'edit'
      ? 'linear-gradient(135deg,#667eea,#764ba2)'
      : p.variant === 'delete'
      ? 'linear-gradient(135deg,#ff6b6b,#ee5a24)'
      : '#f8f9fa'};
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
`;

function WorkReportTable() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [taskQuery, setTaskQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async (search = '') => {
    setLoading(true);
    try {
      const data = await workReportAPI.search(search);
      setReports(data);
    } catch {
      toast.error('Failed to load work reports');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete report?')) return;
    try {
      await workReportAPI.delete(id);
      toast.success('Deleted');
      fetchReports(searchQuery);
    } catch {
      toast.error('Failed');
    }
  };

  const stats = {
    total: reports.length,
    completed: reports.filter(r => r.status === 'completed').length,
    inProgress: reports.filter(r => r.status === 'in-progress').length,
    thisWeek: reports.filter(r => {
      const d = new Date(r.date);
      return d > new Date(Date.now() - 7 * 864e5);
    }).length
  };

  const filtered = useMemo(() => {
    if (!taskQuery) return reports;
    return reports.filter(r => r.tasks?.toLowerCase().includes(taskQuery.toLowerCase()));
  }, [reports, taskQuery]);

  return (
    <TableContainer>
      <TableHeader>
        <TableTitle><Briefcase size={24}/>Work Reports Database Table</TableTitle>

        <SearchContainer>
          <SearchIcon size={20}/>
          <SearchInput value={searchQuery} onChange={(e)=>{
            setSearchQuery(e.target.value);
            fetchReports(e.target.value);
          }} placeholder="Search reports..."/>
        </SearchContainer>
      </TableHeader>

      <SearchContainer>
        <SearchIcon size={20}/>
        <SearchInput
          placeholder="Search tasks only..."
          value={taskQuery}
          onChange={(e)=>setTaskQuery(e.target.value)}
        />
      </SearchContainer>

      {loading ? <div>Loading...</div> : !filtered.length ? <h4>No Reports Found</h4> :

      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Date</TableHeaderCell>
            <TableHeaderCell>Project</TableHeaderCell>
            <TableHeaderCell>Tasks</TableHeaderCell>
            <TableHeaderCell>Location</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Created</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableRow>
        </TableHead>

        <tbody>
          {filtered.map(r=>(
            <TableRow key={r._id}>
              <TableCell>{r.date}</TableCell>
              <TableCell>{r.project}</TableCell>
              <TableCell>{r.tasks}</TableCell>
              <TableCell><LocationBadge location={r.location}>{r.location}</LocationBadge></TableCell>
              <TableCell><StatusBadge status={r.status}>{r.status}</StatusBadge></TableCell>
              <TableCell>{new Date(r.createdAt).toLocaleDateString()}</TableCell>
              <ActionCell>
                <ActionButton variant="edit"><Edit size={16}/>Edit</ActionButton>
                <ActionButton variant="delete" onClick={()=>handleDelete(r._id)}><Trash2 size={16}/>Delete</ActionButton>
              </ActionCell>
            </TableRow>
          ))}
        </tbody>
      </Table>}
    </TableContainer>
  );
}

export default WorkReportTable;