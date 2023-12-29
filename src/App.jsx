import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [polls, setPolls] = useState([]);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [reward, setReward] = useState(null);

  useEffect(() => {
    // Fetch all polls on component mount
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/polls');
      setPolls(response.data);
    } catch (error) {
      console.error('Error fetching polls:', error);
    }
  };

  const fetchQuestions = async (pollId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/questions/poll/${pollId}`);
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handlePollSelect = (pollId) => {
    setSelectedPoll(pollId);
    // Fetch questions for the selected poll
    fetchQuestions(pollId);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handlePollSubmit = async () => {
    try {
      const response = await axios.post(`http://localhost:3000/api/polls/${selectedPoll}/submit`, {
        selectedOption,
      });
      setReward(response.data.reward);
      // Refresh polls and questions after submission
      fetchPolls();
      setQuestions([]);
      setSelectedPoll(null);
      setSelectedOption('');
    } catch (error) {
      console.error('Error submitting poll:', error);
    }
  };

  return (
    <div>
      <h1>Poll Application</h1>
      <div>
        <h2>Polls</h2>
        <ul>
          {polls.map((poll) => (
            <li key={poll._id}>
              {poll.title} -{' '}
              <button onClick={() => handlePollSelect(poll._id)}>Select</button>
            </li>
          ))}
        </ul>
      </div>
      {selectedPoll && (
        <div>
          <h2>Questions for Poll: {selectedPoll}</h2>
          <ul>
            {questions.map((question) => (
              <li key={question._id}>
                {question.text} -{' '}
                {question.options.map((option) => (
                  <button key={option} onClick={() => handleOptionSelect(option)}>
                    {option}
                  </button>
                ))}
              </li>
            ))}
          </ul>
          <div>
            <h3>Selected Option: {selectedOption}</h3>
            <button onClick={handlePollSubmit}>Submit Poll</button>
          </div>
          {reward && (
            <div>
              <h3>Reward for submitting the poll: {reward}</h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
