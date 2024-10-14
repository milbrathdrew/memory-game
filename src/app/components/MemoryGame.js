"use client";
import { useState, useEffect } from 'react';
import { gameData } from '../data/gameData';

const MemoryGame = () => {
    const [flippedCard, setFlippedCard] = useState(null);
    const [matchedPairs, setMatchedPairs] = useState([]);
    const [shuffledData, setShuffledData] = useState([]);
    const [score, setScore] = useState(0);
    const [totalAttempts, setTotalAttempts] = useState(0);
    const [cardStatus, setCardStatus] = useState({});

    useEffect(() => {
        const shuffled = [...gameData].sort(() => Math.random() - 0.5);
        setShuffledData(shuffled);
    }, []);

    const handleCardClick = (index) => {
        if (flippedCard === index || matchedPairs.includes(shuffledData[index].question)) return;
        setFlippedCard(index);
    };

    const handleAnswerClick = (answer) => {
        if (flippedCard === null) return;

        const card = shuffledData[flippedCard];
        setTotalAttempts(prev => prev + 1);

        if (answer === card.correctAnswer) {
            setScore(prev => prev + 1);
            setMatchedPairs(prev => [...prev, card.question]);
            setCardStatus(prev => ({ ...prev, [flippedCard]: 'correct' }));
        } else {
            setCardStatus(prev => ({ ...prev, [flippedCard]: 'incorrect' }));
        }

        setTimeout(() => {
            setFlippedCard(null);
        }, 1000);
    };

    const getCardClass = (index) => {
        let className = 'card';
        if (flippedCard === index || matchedPairs.includes(shuffledData[index].question)) {
            className += ' flipped';
        }
        if (cardStatus[index] === 'correct') {
            className += ' correct';
        } else if (cardStatus[index] === 'incorrect') {
            className += ' incorrect';
        }
        return className;
    };

    const calculatePercentageScore = () => {
        return totalAttempts > 0 ? Math.round((score / totalAttempts) * 100) : 0;
    };

    if (shuffledData.length === 0) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="game-container">
            <h1 className="game-title">API Memory Game</h1>
            <div className="score-board">
                <div className="score-item">
                    <span className="score-label">Score:</span>
                    <span className="score-value">{score}</span>
                </div>
                <div className="score-item">
                    <span className="score-label">Attempts:</span>
                    <span className="score-value">{totalAttempts}</span>
                </div>
            </div>
            <div className="game-layout">
                <div className="card-grid">
                    {shuffledData.map((card, index) => (
                        <div
                            key={index}
                            className={getCardClass(index)}
                            onClick={() => handleCardClick(index)}
                        >
                            <div className="card-inner">
                                <div className="card-front">?</div>
                                <div className="card-back">{card.question}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="answer-section">
                    <h2 className="answer-title">Answers</h2>
                    <div className="answer-options">
                        {flippedCard !== null ? (
                            shuffledData[flippedCard].answers.map((answer, index) => (
                                <button 
                                    key={index} 
                                    onClick={() => handleAnswerClick(answer)}
                                    disabled={matchedPairs.includes(shuffledData[flippedCard].question)}
                                    className="answer-button"
                                >
                                    {answer}
                                </button>
                            ))
                        ) : (
                            <p className="select-card-message">Select a card to see answers</p>
                        )}
                    </div>
                </div>
            </div>
            {matchedPairs.length === gameData.length && (
                <div className="game-over">
                    <h2>Game Over!</h2>
                    <p>Your score: {calculatePercentageScore()}%</p>
                </div>
            )}
        </div>
    );
};

export default MemoryGame;
