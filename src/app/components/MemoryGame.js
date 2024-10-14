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

        // Reset flipped card after a short delay, but keep the status
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
        return <div>Loading...</div>;
    }

    return (
        <div className="game-container">
            <h1>Memory Game</h1>
            <div className="score-board">
                <p>Score: {score}</p>
                <p>Attempts: {totalAttempts}</p>
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
                    <h2>Answers</h2>
                    <div className="answer-options">
                        {flippedCard !== null ? (
                            shuffledData[flippedCard].answers.map((answer, index) => (
                                <button 
                                    key={index} 
                                    onClick={() => handleAnswerClick(answer)}
                                    disabled={matchedPairs.includes(shuffledData[flippedCard].question)}
                                >
                                    {answer}
                                </button>
                            ))
                        ) : (
                            <p>Select a card to see answers</p>
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
