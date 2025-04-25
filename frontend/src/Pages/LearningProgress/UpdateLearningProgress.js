import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../../Components/NavBar/NavBar';
import { FaTrash } from 'react-icons/fa';
function UpdateLearningProgress() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    template: '',
    postOwnerID: '',
    postOwnerName: ''
  });
  const [skills, setSkills] = useState(['']); // Add state for skills

  useEffect(() => {
    fetch(`http://localhost:8080/learningProgress/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setFormData(data);
        setSkills(data.skills || []); // Initialize skills from fetched data
      })
      .catch((error) => console.error('Error fetching learning progress data:', error));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
    try {
      const dataToSubmit = { ...formData, skills }; // Include skills in the formData
      const response = await fetch(`http://localhost:8080/learningProgress/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit),
      });
      if (response.ok) {
        alert('Learning Progress updated successfully!');
        window.location.href = '/MylearningProgress';
      } else {
        alert('Failed to update Learning Progress.');
      }
    } catch (error) {
      console.error('Error updating learning progress:', error);
    }
  };

  return (
    <div>
      <NavBar />
      <div className="pro-learning-container">
        <div className="pro-learning-header">
          <h2>Update Learning Progress</h2>
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
          
          <button type="submit" className="pro-submit-btn">Update Progress</button>
        </form>
      </div>
    </div>
  );
}

export default UpdateLearningProgress;
