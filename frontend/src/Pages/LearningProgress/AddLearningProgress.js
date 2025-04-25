import React, { useState, useEffect } from 'react';
import './LearningPro.css';
import NavBar from '../../Components/NavBar/NavBar';
import { FaTrash } from 'react-icons/fa';
function AddLearningProgress() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    template: '',
    postOwnerID: '',
    postOwnerName: ''
  });
  const [skills, setSkills] = useState(['']);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

    try {
      const dataToSubmit = { ...formData, skills }; // Include skills in the formData
      const response = await fetch('http://localhost:8080/learningProgress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit),
      });
      if (response.ok) {
        alert('Learning Progress added successfully!');
        window.location.href = '/MylearningProgress';
      } else {
        alert('Failed to add Learning Progress.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
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

  return (
    <div>
      <NavBar />
      <div className="pro-learning-container">
        <div className="pro-learning-header">
          <h2>Add Learning Progress</h2>
        </div>

        <form className="pro-learning-form" onSubmit={handleSubmit}>
          <div className="pro-form-group">
            <label>Title</label>
            <input
              className="pro-form-input"
              name="title"
              placeholder="Enter progress title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="pro-form-group">
            <label>Description</label>
            <textarea
              className="pro-form-textarea"
              name="description"
              placeholder="Describe what you've learned"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="pro-form-group">
            <label>Template</label>
            <select
              className="pro-form-input"
              name="template"
              value={formData.template}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select an option</option>
              <option value="completed tutorial">Completed Tutorial</option>
              <option value="skill learned">Skill Learned</option>
              <option value="milestones">Milestones</option>
            </select>
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

          <button type="submit" className="pro-submit-btn">Add Progress</button>
        </form>
      </div>
    </div>
  );
}

export default AddLearningProgress;