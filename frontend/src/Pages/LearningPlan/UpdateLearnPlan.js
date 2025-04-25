import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LearningPlan.css';
import NavBar from '../../Components/NavBar/NavBar';
import { FaTrash } from 'react-icons/fa';
function UpdateLearnPlan() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    postOwnerID: '',
    postOwnerName: '',
  });
  const [descriptions, setDescriptions] = useState([]);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8080/learningPlan/${id}`)
      .then((response) => {
        setFormData(response.data);
        setDescriptions(response.data.description || []);
        setSkills(response.data.skills || []);
      })
      .catch((error) => console.error('Error fetching post data:', error));
  }, [id]);

  const handleAddDescription = () => {
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

    // Check for duplicate descriptions
    const uniqueDescriptions = new Set(descriptions);
    if (uniqueDescriptions.size !== descriptions.length) {
      alert('Duplicate descriptions are not allowed.');
      return;
    }

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

    const updatedPost = { ...formData, description: descriptions, skills };
    try {
      await axios.put(`http://localhost:8080/learningPlan/${id}`, updatedPost);
      alert('Post updated successfully!');
      navigate('/myLearningPlan');
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post.');
    }
  };

  return (
    <div>
      <NavBar />
      <div className="pro-learning-container">
        <div className="pro-learning-header">
          <h2>Update Learning Post</h2>
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
          <button type="submit" className="pro-submit-btn">Update Post</button>
        </form>
      </div>
    </div>
  );
}

export default UpdateLearnPlan;
