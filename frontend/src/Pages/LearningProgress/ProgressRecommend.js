import React, { useEffect, useState } from 'react';
import { FaUserCircle, FaPen } from "react-icons/fa";
import './LearningPro.css';
import NavBar from '../../Components/NavBar/NavBar'
function ProgressRecommend() {
  const [filteredData, setFilteredData] = useState([]);
  const userType = localStorage.getItem('userType');
  useEffect(() => {
    const fetchFilteredProgress = async () => {
      try {
        const userID = localStorage.getItem('userID');
        const userSkillsResponse = await fetch(`http://localhost:8080/user/${userID}/skills`);
        const userSkills = (await userSkillsResponse.json()).map(skill => skill.toUpperCase());

        const progressResponse = await fetch('http://localhost:8080/learningProgress/filterBySkills', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userSkills),
        });
        const filteredProgress = await progressResponse.json();
        setFilteredData(filteredProgress);
      } catch (error) {
        console.error('Error fetching filtered progress:', error);
      }
    };

    fetchFilteredProgress();
  }, []);
  return (
    <div>
      <NavBar />
      <div className="progress-container">
        <div className="progress-header">
          <h1>Recommend Learning Progress</h1>
          <p></p>
        </div>

        <div className='create_btn' onClick={() => (window.location.href = '/addLearningProgress')}>
          <FaPen className='create_btn_icon' />
        </div>
        <div className="progress-grid">
          {filteredData.length === 0 ? (
            <div className="empty-state">
              <p>No learning progress found. Start by creating your first progress entry.</p>
            </div>
          ) : (
            filteredData.map((progress) => (
              <div className="progress-card" key={progress.id}>
                <div className="card-header">
                  <div className="user-avatar">
                    <FaUserCircle />
                  </div>
                  <div className="user-name">
                    {progress.postOwnerName}
                    <p className="progress-date">{progress.date}</p>
                  </div>
                </div>
                <div className="card-body">
                  <h3 className="progress-title">{progress.title}</h3>
                  <p className='progress-templt'>{progress.template}</p>
                  <div className="skil_card_dis">
                    <div>
                      {progress.skills && progress.skills.length > 0 ? (
                        progress.skills.join(', ')
                      ) : (
                        <span>No skills added</span>
                      )}
                    </div>
                  </div>
                  <p className="progress-description">{progress.description}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default ProgressRecommend
