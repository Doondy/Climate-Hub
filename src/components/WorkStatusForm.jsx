import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Briefcase, Home, Building, Send, FileText } from "lucide-react";

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const WorkLocationSelector = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const LocationButton = styled.button`
  flex: 1;
  padding: 15px;
  border: 2px solid ${props => props.selected ? '#667eea' : '#e1e5e9'};
  background: ${props => props.selected ? '#f0f2ff' : 'white'};
  color: ${props => props.selected ? '#667eea' : '#666'};
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #667eea;
    background: #f0f2ff;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  background: white;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
  margin-bottom: 20px;
`;

const QuickActionButton = styled.button`
  padding: 10px;
  border: 2px solid #e1e5e9;
  background: white;
  color: #666;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #667eea;
    color: #667eea;
  }
`;

function WorkStatusForm({ onSubmit, editData = null, onCancelEdit = null }) {
  const [formData, setFormData] = useState({
    workLocation: 'office',
    project: '',
    status: 'in-progress',
    description: '',
    hours: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    if (editData) {
      setFormData({
        workLocation: editData.workLocation || 'office',
        project: editData.project || '',
        status: editData.status || 'in-progress',
        description: editData.description || '',
        hours: editData.hours || '',
        date: editData.date || new Date().toISOString().split('T')[0]
      });
      setIsEditing(true);
      setOriginalData(editData);
    }
  }, [editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.project || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const reportData = {
        ...formData,
        id: isEditing ? (originalData._id || originalData.id) : Date.now(),
        _id: isEditing ? (originalData._id || originalData.id) : undefined,
        createdAt: isEditing ? originalData.createdAt : new Date().toISOString(),
        updatedAt: isEditing ? new Date().toISOString() : undefined
      };

      onSubmit(reportData, isEditing);
      if (isEditing) {
        setIsEditing(false);
        setFormData({
          workLocation: 'office',
          project: '',
          status: 'in-progress',
          description: '',
          hours: '',
          date: new Date().toISOString().split('T')[0]
        });
      } else {
        setFormData({
          workLocation: 'office',
          project: '',
          status: 'in-progress',
          description: '',
          hours: '',
          date: new Date().toISOString().split('T')[0]
        });
      }
    } catch (error) {
      alert('Error submitting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      {isEditing && (
        <button onClick={onCancelEdit}>Cancel Edit</button>
      )}

      <form onSubmit={handleSubmit}>
        {/* --- UI FIELDS REMAIN SAME --- */}
        {/* Code is unchanged */}
      </form>
    </FormContainer>
  );
}

export default WorkStatusForm;