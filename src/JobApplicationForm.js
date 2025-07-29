
import React, { useState } from 'react';
import {
  Form,
  Button,
  Modal,
  ProgressBar,
  Tooltip,
  OverlayTrigger,
  Toast,
  Row,
  Col,
  Alert
} from 'react-bootstrap';
// ✅ Phone Number Validation Function
const isValidPhone = (phone) => {
  const phoneRegex = /^[0-9]{11}$/; // Format: 03001234567
  return phoneRegex.test(phone);
};

const isValidCNIC = (cnic) => {
  const cnicRegex = /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/; // Format: 12345-1234567-1
  return cnicRegex.test(cnic);

};

const JobApplicationForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    cnic: '',
    education: '',
    skills: [],
    role: '',
    cv: null,
  });

  const [progress, setProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [validated, setValidated] = useState(false);
  const [previewURL, setPreviewURL] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [submissionData, setSubmissionData] = useState(null);

  const educationLevels = ['Matric', 'Intermediate', 'Bachelors', 'Masters'];
  const skillsList = ['HTML', 'CSS', 'JavaScript', 'React', 'Bootstrap'];
  const roles = ['Frontend Intern', 'Backend Intern', 'UI/UX Designer', 'Full Stack Developer'];

  const calculateProgress = (data) => {
    let filled = 0;
    if (data.fullName) filled++;
    if (data.email) filled++;
    if (data.phone) filled++;
    if (data.cnic) filled++;
    if (data.education) filled++;
    if (data.skills.length > 0) filled++;
    if (data.role) filled++;
    if (data.cv) filled++;
    return Math.round((filled / 8) * 100);
  };

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    let newFormData = { ...formData };

    if (type === 'checkbox') {
      if (checked) newFormData.skills.push(value);
      else newFormData.skills = newFormData.skills.filter(skill => skill !== value);
    } else if (type === 'file') {
      newFormData.cv = files[0];
      setPreviewURL(URL.createObjectURL(files[0]));
    } else {
      newFormData[name] = value;
    }

    setFormData(newFormData);
    setProgress(calculateProgress(newFormData));
  };

 const handleSubmit = (event) => {
  event.preventDefault();
  event.stopPropagation();

  const form = event.currentTarget;
  const isCNICCorrect = isValidCNIC(formData.cnic);
  const isCVUploaded = formData.cv !== null;

 const isPhoneCorrect = isValidPhone(formData.phone);

// Add isPhoneCorrect into the final if-check:
if (
  !formData.fullName ||
  !formData.email ||
  !formData.phone ||
  !formData.cnic ||
  !formData.education ||
  formData.skills.length === 0 ||
  !formData.role ||
  !isCVUploaded ||
  !isCNICCorrect ||
  !isPhoneCorrect
) {
  setValidated(true);
  alert("Please fill all fields correctly and upload your resume.");
  return;
}


  // All validations passed
  setValidated(false);
  setShowModal(true);
  setSubmissionData(formData);
  setShowToast(true);
};


  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 text-white">Mini Job Application Portal</h2>
      <ProgressBar now={progress} label={`${progress}% Completed`} className="mb-3" />

      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="fullName">
              <OverlayTrigger placement="top" overlay={<Tooltip>Enter your full legal name.</Tooltip>}>
                <Form.Label>Full Name</Form.Label>
              </OverlayTrigger>
              <Form.Control required type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
              <Form.Control.Feedback type="invalid">Please enter your full name.</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control required type="email" name="email" value={formData.email} onChange={handleChange} />
              <Form.Control.Feedback type="invalid">Please enter a valid email.</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="phone">
  <Form.Label>Phone Number</Form.Label>
  <Form.Control
    required
    type="text"
    name="phone"
    value={formData.phone}
    onChange={handleChange}
    isInvalid={validated && !isValidPhone(formData.phone)}
  />
  <Form.Control.Feedback type="invalid">
    Please enter a valid 11-digit phone number (e.g. 03001234567).
  </Form.Control.Feedback>
</Form.Group>

          </Col>
          <Col md={6}>
           <Form.Group className="mb-3" controlId="cnic">
  <Form.Label>CNIC</Form.Label>
  <Form.Control
    required
    type="text"
    name="cnic"
    value={formData.cnic}
    onChange={handleChange}
    isInvalid={validated && !isValidCNIC(formData.cnic)}
  />
  <Form.Control.Feedback type="invalid">
    Please enter a valid CNIC (e.g. 12345-1234567-1).
  </Form.Control.Feedback>
</Form.Group>

          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Education Level</Form.Label>
          <Form.Select required name="education" value={formData.education} onChange={handleChange}>
            <option value="">Select...</option>
            {educationLevels.map(level => <option key={level} value={level}>{level}</option>)}
          </Form.Select>
          <Form.Control.Feedback type="invalid">Select education level.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Skills</Form.Label>
          <div>
            {skillsList.map(skill => (
              <Form.Check
                key={skill}
                type="checkbox"
                label={skill}
                value={skill}
                onChange={handleChange}
                checked={formData.skills.includes(skill)}
              />
            ))}
          </div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Preferred Role</Form.Label>
          <Form.Select required name="role" value={formData.role} onChange={handleChange}>
            <option value="">Select...</option>
            {roles.map(role => <option key={role} value={role}>{role}</option>)}
          </Form.Select>
          <Form.Control.Feedback type="invalid">Select preferred role.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
  <Form.Label>Upload CV (Simulated)</Form.Label>
  <Form.Control
    required
    type="file"
    accept=".pdf,.doc,.docx"
    onChange={handleChange}
    isInvalid={validated && !formData.cv}
  />
  {previewURL && (
    <div className="mt-2">
      <Alert variant="info">Preview: {formData.cv.name}</Alert>
    </div>
  )}
  <Form.Control.Feedback type="invalid">
    Please upload your CV.
  </Form.Control.Feedback>
</Form.Group>


        <div className="text-center">
  <Button
    variant="primary"
    type="submit"
    className="px-4 py-2 btn-sm"
  >
    Submit Application
  </Button>
</div>

      </Form>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Application Summary</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Name:</strong> {submissionData?.fullName}</p>
          <p><strong>Email:</strong> {submissionData?.email}</p>
          <p><strong>Phone:</strong> {submissionData?.phone}</p>
          <p><strong>CNIC:</strong> {submissionData?.cnic}</p>
          <p><strong>Education:</strong> {submissionData?.education}</p>
          <p><strong>Skills:</strong> {submissionData?.skills.join(', ')}</p>
          <p><strong>Role:</strong> {submissionData?.role}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      <Toast
        className="position-fixed bottom-0 end-0 m-4"
        bg="success"
        show={showToast}
        onClose={() => setShowToast(false)}
        delay={4000}
        autohide
      >
        <Toast.Body className="text-white">Form submitted successfully!</Toast.Body>
      </Toast>
    </div>
  );
};

export default JobApplicationForm;
