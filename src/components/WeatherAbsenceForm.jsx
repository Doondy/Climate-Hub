import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { getWeatherData, getWeatherIcon, getWeatherDescription } from '../../backend/services/weatherService.js';
import { CloudRain, MapPin, FileText, Camera, Send, CheckCircle, Info } from 'lucide-react';
import toast from 'react-hot-toast';

const FormContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
`;

const FormTitle = styled.h3`
  color: #333;
  margin-bottom: 25px;
  font-size: 1.4rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 1rem;
  box-sizing: border-box;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  box-sizing: border-box;
`;

const FileInputContainer = styled.div`
  position: relative;
  width: 100%;
`;

const FileInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

const FileInputLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 16px;
  border: 2px dashed #e1e5e9;
  border-radius: 12px;
  cursor: pointer;
  background: #f8f9fa;
`;

const SubmitButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px 20px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 20px;
  cursor: pointer;
`;

const VerificationResult = styled.div`
  margin-top: 25px;
  padding: 20px;
  border-radius: 12px;
  border: 2px solid ${props => (props.type === 'verified' ? '#10b981' : '#f59e0b')};
  background: ${props => (props.type === 'verified' ? '#ecfdf5' : '#fffbeb')};
`;

const WeatherInfo = styled.div`
  margin-top: 15px;
`;

const ImagePreview = styled.div`
  margin-top: 10px;
  text-align: center;
`;

const PreviewImage = styled.img`
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  border: 2px solid #e5e7eb;
`;

function WeatherAbsenceForm({ onSubmit }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    employeeName: user?.name || "",
    employeeId: user?.id || "",
    location: "",
    description: "",
    image: null
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));

      const reader = new FileReader();
      reader.onload = e => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const weatherData = await getWeatherData(formData.location);
      const severe = weatherData.windSpeed > 20;

      const result = {
        isVerified: severe,
        weatherData
      };

      setVerificationResult(result);

      onSubmit({
        ...formData,
        id: Date.now(),
        verificationResult: result,
        imagePreview
      });

      toast.success("Request submitted");
      setFormData({ employeeName: user?.name, employeeId: user?.id, location: "", description: "", image: null });
      setImagePreview(null);
    } catch {
      toast.error("Failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormContainer>
      <FormTitle><CloudRain size={24}/> Weather Absence Report</FormTitle>

      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Employee Name</Label>
          <Input name="employeeName" value={formData.employeeName} readOnly />
        </FormGroup>

        <FormGroup>
          <Label>Employee ID</Label>
          <Input name="employeeId" value={formData.employeeId} readOnly />
        </FormGroup>

        <FormGroup>
          <Label><MapPin size={16}/> Location</Label>
          <Input name="location" value={formData.location} onChange={e=>setFormData({...formData, location: e.target.value})} />
        </FormGroup>

        <FormGroup>
          <Label><FileText size={16}/> Description</Label>
          <TextArea name="description" value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})}/>
        </FormGroup>

        <FormGroup>
          <Label><Camera size={16}/> Upload Image</Label>
          <FileInputContainer>
            <FileInput type="file" onChange={handleImageChange}/>
            <FileInputLabel><Camera size={20}/> {formData.image?.name || "Upload"}</FileInputLabel>
          </FileInputContainer>
          {imagePreview && <ImagePreview><PreviewImage src={imagePreview}/></ImagePreview>}
        </FormGroup>

        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Verifying..." : <><Send size={20}/> Submit</>}
        </SubmitButton>
      </form>

      {verificationResult && (
        <VerificationResult type={verificationResult.isVerified ? "verified" : "warning"}>
          {verificationResult.isVerified ? <CheckCircle/> : <Info/>} Weather Checked
        </VerificationResult>
      )}
    </FormContainer>
  );
}

export default WeatherAbsenceForm;