import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { weatherAbsenceAPI } from '../../services/api';
import AbsenceRequests from '../AbsenceRequests';
import WeatherAbsenceForm from '../WeatherAbsenceForm';
import { Clock, Plus, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 25px 30px;
  margin-bottom: 25px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PageTitle = styled.h1`
  margin: 0;
  color: #333;
  font-size: 1.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${props => props.primary ? `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
    }
  ` : `
    background: white;
    color: #667eea;
    border: 2px solid #667eea;
    
    &:hover {
      background: #f8f9ff;
      transform: translateY(-2px);
    }
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingState = styled.div`
  background: white;
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  color: #666;
`;

const ErrorState = styled.div`
  background: white;
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  color: #ef4444;
`;

function AbsenceRequest() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRequests = async () => {
    try {
      setRefreshing(true);
      const response = await weatherAbsenceAPI.getMine();
      setRequests(response.data || response || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching absence requests:', err);
      const errorMessage = err.message || 'Failed to load absence requests';
      setError(errorMessage);
      
      // Show specific message for auth errors
      if (errorMessage.includes('Authentication required') || errorMessage.includes('log in')) {
        toast.error('Please log in to view absence requests');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleRequestAdded = async (formData) => {
    try {
      // Submit the form data to the API
      await weatherAbsenceAPI.create({
        employeeName: formData.employeeName,
        employeeId: formData.employeeId,
        location: formData.location,
        description: formData.description,
        verificationResult: formData.verificationResult,
        image: formData.image
      });
      
      setShowForm(false);
      await fetchRequests();
      toast.success('Absence request submitted successfully!');
    } catch (err) {
      console.error('Error submitting request:', err);
      toast.error('Failed to submit absence request');
    }
  };

  const handleDelete = async (id) => {
    try {
      await weatherAbsenceAPI.delete(id);
      await fetchRequests();
      toast.success('Absence request deleted successfully');
    } catch (err) {
      console.error('Error deleting request:', err);
      toast.error('Failed to delete absence request');
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <ContentWrapper>
          <LoadingState>
            <Clock size={48} style={{ margin: '0 auto 20px', opacity: 0.5 }} />
            <p>Loading absence requests...</p>
          </LoadingState>
        </ContentWrapper>
      </PageContainer>
    );
  }

  if (error && requests.length === 0) {
    return (
      <PageContainer>
        <ContentWrapper>
          <ErrorState>
            <p style={{ fontSize: '1.1rem', marginBottom: '15px' }}>Error loading requests</p>
            <p style={{ fontSize: '0.9rem', color: '#999' }}>{error}</p>
            <Button onClick={fetchRequests} style={{ marginTop: '20px' }}>
              <RefreshCw size={18} />
              Try Again
            </Button>
          </ErrorState>
        </ContentWrapper>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ContentWrapper>
        <PageHeader>
          <PageTitle>
            <Clock size={28} />
            Weather Absence Requests
          </PageTitle>
          <ActionButtons>
            {!showForm && (
              <Button primary onClick={() => setShowForm(true)}>
                <Plus size={18} />
                New Request
              </Button>
            )}
            <Button onClick={fetchRequests} disabled={refreshing}>
              <RefreshCw size={18} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
              Refresh
            </Button>
          </ActionButtons>
        </PageHeader>

        {showForm ? (
          <div>
            <Button onClick={() => setShowForm(false)} style={{ marginBottom: '20px' }}>
              ← Back to Requests
            </Button>
            <WeatherAbsenceForm 
              onSubmit={handleRequestAdded}
            />
          </div>
        ) : (
          <AbsenceRequests 
            requests={requests} 
            onDelete={handleDelete}
          />
        )}
      </ContentWrapper>
    </PageContainer>
  );
}

export default AbsenceRequest;

