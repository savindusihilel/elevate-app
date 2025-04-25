import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LearningPlan.css';
import NavBar from '../../Components/NavBar/NavBar';
import { FaTrash } from 'react-icons/fa';
function AddLeariningPlan() {
  const [formData, setFormData] = useState({
    title: '',
    postOwnerID: '',
    postOwnerName: '',
    createdAt: '',
  });
  const [descriptions, setDescriptions] = useState(['']);
  const [skills, setSkills] = useState(['']);

  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userID');
    if (userId) {
      setFormData((prevData) => ({ ...prevData, postOwnerID: userId }));
      fetch(`http://localhost:8080/user/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.fullname) {
            setFormData((prevData) => ({ ...prevData, postOwnerName: data.fullname }));
          }
        })
        .catch((error) => console.error('Error fetching user data:', error));
    }
  }, []);

  const handleAddDescription = () => {
    if (descriptions.includes('')) {
      alert('Please fill the current descriptions before adding a new one.');
      return;
    }
    setDescriptions([...descriptions, '']);
  };

  const handleDescriptionChange = (index, value) => {
    const updatedDescriptions = [...descriptions];
    updatedDescriptions[index] = value;
    setDescriptions(updatedDescriptions);
  };

  const handleDeleteDescription = (index) => {
    const updatedDescriptions = descriptions.filter((_, i) => i !== index);
    setDescriptions(updatedDescriptions);
  };

  const handleAddSkill = () => {
    if (skills.includes('')) {
      alert('Please fill the current skill before adding a new one.');
      return;
    }
    setSkills([...skills, '']);
  };

  const handleSkillChange = (index, value) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = value;
    setSkills(updatedSkills);
  };

  const handleDeleteSkill = (index) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    setSkills(updatedSkills);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for duplicate skills
    const uniqueSkills = new Set(skills);
    if (uniqueSkills.size !== skills.length) {
      alert('Duplicate skills are not allowed.');
      return;
    }

    if (skills.length < 2) {
      alert('Please add at least two skills.');
      return;
    }

    const newPost = { ...formData, description: descriptions, skills, createdAt: new Date().toISOString() };
    try {
      await axios.post('http://localhost:8080/learningPlan', newPost);
      alert('Post added successfully!');
      setFormData({
        title: '',
        postOwnerID: '',
        postOwnerName: '',
        createdAt: '',
      });
      setDescriptions(['']);
      setSkills(['']);
      navigate('/myLearningPlan');
    } catch (error) {
      console.error('Error adding post:', error);
      alert('Failed to add post.');
    }
  };

  return (
    <div>
      <NavBar />
      <div className="pro-learning-container">
        <div className="pro-learning-header">
          <h2>Add Learning Post</h2>
        </div>

        <form className="pro-learning-form" onSubmit={handleSubmit}>
          <div className="LPost-form-group">
            <label>Title</label>
            <input
              className="LPost-form-input"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Enter your learning topic"
            />
          </div>

          <div className="LPost-form-group">
            <label>Descriptions</label>
            {descriptions.map((desc, index) => (
              <div key={index} className="LPost-content-flow-from">
                <textarea
                  className="LPost-form-textarea"
                  value={desc}
                  onChange={(e) => handleDescriptionChange(index, e.target.value)}
                  required
                  rows={2}
                  placeholder={`Description ${index + 1}`}
                />
                <button
                  type="button"
                  className="LPost-delete-btn"
                  onClick={() => handleDeleteDescription(index)}
                >
                  <FaTrash/>
                </button>
              </div>
            ))}
            <button type="button" onClick={handleAddDescription} className="LPost-add-btn">
              Add Description
            </button>
          </div>

          <div className="LPost-form-group">
            <label>Skills</label>
            {skills.map((skill, index) => (
              <div key={index} className="LPost-content-flow-from">
                <input
                  className="LPost-form-input"
                  type="text"
                  value={skill}
                  onChange={(e) => handleSkillChange(index, e.target.value)}
                  required
                  placeholder={`Skill ${index + 1}`}
                />
                <button
                  type="button"
                  className="LPost-delete-btn"
                  onClick={() => handleDeleteSkill(index)}
                >
                  <FaTrash/>
                </button>
              </div>
            ))}
            <button type="button" onClick={handleAddSkill} className="LPost-add-btn">
              Add Skill
            </button>
          </div>

          <button type="submit" className="pro-submit-btn">Add Post</button>
        </form>
      </div>
    </div>
  );
}

export default AddLeariningPlan;