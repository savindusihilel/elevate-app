import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPen, FaUserCircle, FaEdit, FaTrash, } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import './LearningPlan.css';
import NavBar from '../../Components/NavBar/NavBar'

function MyLearningPlan() {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const navigate = useNavigate();
    const userID = localStorage.getItem("userID");
    useEffect(() => {
        fetch('http://localhost:8080/learningPlan')
            .then((response) => response.json())
            .then((data) => {
                const userSpecificData = data.filter(progress => progress.postOwnerID === userID);
                setPosts(userSpecificData);
                setFilteredPosts(userSpecificData);
            })
            .catch((error) => console.error('Error fetching learning Post data:', error));
    }, [userID]);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this learning Post?")) {
            fetch(`http://localhost:8080/learningPlan/${id}`, {
                method: 'DELETE',
            })
                .then(() => {
                    const updatedData = filteredPosts.filter(progress => progress.id !== id);
                    setFilteredPosts(updatedData);
                    alert("Learning Post deleted successfully.");
                })
                .catch((error) => console.error('Error deleting learning Post:', error));
        }
    };
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div>
            <NavBar />
            <div className="progress-container">
                <div className="progress-header">
                    <h1>My Learning Plan</h1>
                    <p></p>
                </div>
                <div className='create_btn' onClick={() => (window.location.href = '/addLeariningPlan')}>
                    <FaPen />
                </div>
                <div className="progress-grid">
                    {filteredPosts.length === 0 ? (
                        <div className="empty-state">
                            <p>No posts found. Please create a new post.</p>
                        </div>
                    ) : (
                        filteredPosts.map((post) => (
                            <div className="progress-card" key={post.id}>
                                <div className="card-header">
                                    <div className="LPost-user-info">
                                        <div className="user-avatar">
                                            <FaUserCircle />
                                        </div>
                                        <div className="LPost-user-name">{post.postOwnerName}</div>
                                    </div>
                                    <div className="progress-date">{formatDate(post.createdAt)}</div>
                                </div>

                                <div className="card-body">
                                    <h3 className="progress-title">{post.title}</h3>
                                    <div className="skil_card_dis">
                                        <div>
                                            {post.skills && post.skills.length > 0 ? (
                                                post.skills.join(', ')
                                            ) : (
                                                <span>No skills added</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="LPost-content-section">
                                        <hr></hr>
                                        {post.description.map((desc, index) => (
                                            <div key={index} className="LPost-content-flow">
                                                <p className="LPost-content-text">{desc}</p>
                                                {index < post.description.length - 1 && <span className="LPost-arrow">↓</span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="card-actions">
                                    <button
                                        className="edit-btn"
                                        onClick={() => navigate(`/updateLearnPlan/${post.id}`)}
                                    >
                                        <FaEdit /> 
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(post.id)}
                                    >
                                        <FaTrash /> 
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default MyLearningPlan
