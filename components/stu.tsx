import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface Event {
  id: string;
  name: string;
  points: number;
}

interface StudentProps {
  initialEvents?: Event[];
}

const StudentCard: React.FC<StudentProps> = ({ initialEvents = [] }) => {
  const [name, setName] = useState('');
  const [usn, setUsn] = useState('');
  const [branch, setBranch] = useState('');
  const [year, setYear] = useState('');
  const [councilor, setCouncilor] = useState('');
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [newEventName, setNewEventName] = useState('');
  const [newEventPoints, setNewEventPoints] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  // Certificate modal state
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [certDate, setCertDate] = useState('');
  const [certFile, setCertFile] = useState<File | null>(null);
  const [certPreviewUrl, setCertPreviewUrl] = useState<string | null>(null);
  const [certIsDragging, setCertIsDragging] = useState(false);

  // Calculate total points
  const totalPoints = events.reduce((sum, event) => sum + event.points, 0);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result as string);
      };
      fileReader.readAsDataURL(file);
    }
  };

  // Add new event
  const addEvent = () => {
    if (newEventName && newEventPoints > 0) {
      const newEvent: Event = {
        id: Date.now().toString(),
        name: newEventName,
        points: newEventPoints,
      };
      setEvents([...events, newEvent]);
      setNewEventName('');
      setNewEventPoints(0);
    }
  };

  // Remove event
  const removeEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
  };

  // Handle drag events
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result as string);
      };
      fileReader.readAsDataURL(file);
    }
  };
  
  // Certificate modal functions
  const openCertModal = () => {
    setIsCertModalOpen(true);
  };
  
  const closeCertModal = () => {
    setIsCertModalOpen(false);
  };
  
  const handleCertDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCertDate(e.target.value);
  };
  
  const handleCertFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCertFile(file);
      if (file.type.startsWith('image/')) {
        const fileReader = new FileReader();
        fileReader.onload = () => {
          setCertPreviewUrl(fileReader.result as string);
        };
        fileReader.readAsDataURL(file);
      } else {
        // For PDF files, show a placeholder
        setCertPreviewUrl(null);
      }
    }
  };
  
  const handleCertDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setCertIsDragging(true);
  };

  const handleCertDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setCertIsDragging(false);
  };

  const handleCertDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleCertDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setCertIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setCertFile(file);
      
      if (file.type.startsWith('image/')) {
        const fileReader = new FileReader();
        fileReader.onload = () => {
          setCertPreviewUrl(fileReader.result as string);
        };
        fileReader.readAsDataURL(file);
      } else {
        // For PDF files, show a placeholder
        setCertPreviewUrl(null);
      }
    }
  };
  
  const handleCertUpload = () => {
    if (certFile && certDate) {
      // Update the main file state after upload is confirmed
      setSelectedFile(certFile);
      
      // Close the modal
      setIsCertModalOpen(false);
      
      // Reset the certificate modal state
      setCertFile(null);
      setCertDate('');
      setCertPreviewUrl(null);
    }
  };

  return (
    <div className="student-card-container">
      <motion.div 
        className="student-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="student-profile">
          <div className="profile-image-container">
            {previewUrl ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="profile-image"
              >
                <Image 
                  src={previewUrl}
                  alt="Student profile" 
                  width={120} 
                  height={120}
                  className="profile-pic"
                />
              </motion.div>
            ) : (
              <div className="profile-placeholder">
                <span>Profile</span>
              </div>
            )}
          </div>
          
          <div className="student-info">
            <div className="input-group">
              <label htmlFor="name">Name</label>
              <input 
                type="text" 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Student Name"
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="usn">USN</label>
              <input 
                type="text" 
                id="usn" 
                value={usn} 
                onChange={(e) => setUsn(e.target.value)} 
                placeholder="University Serial Number"
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="branch">Branch</label>
              <input 
                type="text" 
                id="branch" 
                value={branch} 
                onChange={(e) => setBranch(e.target.value)} 
                placeholder="Branch"
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="year">Year</label>
              <input 
                type="text" 
                id="year" 
                value={year} 
                onChange={(e) => setYear(e.target.value)} 
                placeholder="Current Year"
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="councilor">Councilor</label>
              <input 
                type="text"
                id="councilor" 
                value={councilor} 
                onChange={(e) => setCouncilor(e.target.value)} 
                placeholder="Councilor Name"
              />
            </div>
          </div>
        </div>
        
        <div className="events-section">
          <div className="events-container">
            <div className="event-header">
              <h3>Activity Points</h3>
              <div className="total-points">{totalPoints}</div>
            </div>
            
            <div className="events-list">
              {events.map((event) => (
                <motion.div 
                  key={event.id} 
                  className="event-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="event-name">{event.name}</div>
                  <div className="event-points">{event.points}</div>
                  <button 
                    className="remove-event" 
                    onClick={() => removeEvent(event.id)}
                  >
                    &times;
                  </button>
                </motion.div>
              ))}
            </div>
            
            <div className="add-event">
              <input 
                type="text" 
                value={newEventName} 
                onChange={(e) => setNewEventName(e.target.value)} 
                placeholder="Event Name"
              />
              <input 
                type="number" 
                value={newEventPoints || ''} 
                onChange={(e) => setNewEventPoints(parseInt(e.target.value) || 0)} 
                placeholder="Points"
              />
              <button 
                className="add-event-btn" 
                onClick={addEvent}
                disabled={!newEventName || newEventPoints <= 0}
              >
                Add
              </button>
            </div>
          </div>
          
          <div className="upload-section">
            <div 
              className={`upload-container ${isDragging ? 'dragging' : ''}`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <span className="upload-text">Upload Certificate</span>
              <input 
                type="file" 
                id="certificate" 
                className="file-input" 
                onChange={handleFileChange}
                accept="image/*,.pdf"
              />
              <label htmlFor="certificate" className="upload-label" onClick={(e) => {
                e.preventDefault();
                openCertModal();
              }}>
                {selectedFile ? selectedFile.name : 'Choose file or drag & drop'}
              </label>
            </div>
            
            <div className="events-showcase">
              <h3>EVENTS</h3>
              <div className="events-calendar">
                <div className="calendar-item">Next Event</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Certificate Upload Modal */}
      <AnimatePresence>
        {isCertModalOpen && (
          <motion.div 
            className="cert-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="cert-modal"
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="cert-modal-header">
                <h2>NAME</h2>
                <button className="cert-close-button" onClick={closeCertModal}>×</button>
              </div>
              
              <div className="cert-modal-content">
                <div className="cert-input-groups">
                  <div className="cert-input-group">
                    <label>date</label>
                    <input 
                      type="date" 
                      value={certDate}
                      onChange={handleCertDateChange}
                    />
                  </div>
                  
                  <div className="cert-input-group">
                    <label>pdf</label>
                    <div 
                      className={`cert-pdf-container ${certFile && !certFile.type.startsWith('image/') ? 'has-pdf' : ''}`}
                    >
                      {certFile && !certFile.type.startsWith('image/') ? (
                        <div className="cert-pdf-filename">{certFile.name}</div>
                      ) : (
                        <span>Choose PDF</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div 
                  className={`cert-dropzone ${certIsDragging ? 'cert-dragging' : ''}`}
                  onDragEnter={handleCertDragEnter}
                  onDragLeave={handleCertDragLeave}
                  onDragOver={handleCertDragOver}
                  onDrop={handleCertDrop}
                >
                  {certPreviewUrl ? (
                    <div className="cert-preview">
                      <img src={certPreviewUrl} alt="Certificate preview" />
                    </div>
                  ) : (
                    <div className="cert-placeholder">
                      <div className="cert-placeholder-grid"></div>
                    </div>
                  )}
                  <input
                    type="file"
                    id="cert-upload"
                    className="cert-file-input"
                    onChange={handleCertFileChange}
                    accept="image/*,.pdf"
                  />
                </div>
                
                <div className="cert-upload-btn-container">
                  <button 
                    className="cert-upload-btn"
                    onClick={handleCertUpload}
                    disabled={!certFile || !certDate}
                  >
                    upload
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentCard;