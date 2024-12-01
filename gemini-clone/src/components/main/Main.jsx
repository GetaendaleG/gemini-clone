/* eslint-disable no-unused-vars */
import React, { useContext, useEffect } from 'react';
import { assets } from '../../assets/assets';
import './Main.css';
import { Context } from '../../context/Context';

const Main = () => {
    const {
        onSent,
        recentPrompt,
        showResult,
        loading,
        resultData,
        setInput,
        input,
        conversation,
        setConversation,
        prevPrompts,
        setPrevPrompts,
    } = useContext(Context);

    useEffect(() => {
        // This ensures that the input field is reset after sending a prompt
        setInput('');
    }, [conversation]); // Reset input when the conversation changes

    return (
        <div className='main'>
            <div className="nav">
                <p>Gemini</p>
                <img src={assets.user_icon} alt="" />
            </div>
            <div className="main-container">
                {!showResult ? (
                    <>
                        <div className="greet">
                            <p><span>Hello.</span></p>
                            <p>How can I help you today?</p>
                        </div>
                    </>
                ) : (
                    <div className='result'>
                        <div className="result-title">
                            <img src={assets.user_icon} alt="" />
                            <p>{recentPrompt}</p>
                        </div>
                        <div className="result-data">
                            <img src={assets.gemini_icon} alt="" />
                            {loading ? (
                                <div className='loader'>
                                    <hr />
                                    <hr />
                                    <hr />
                                </div>
                            ) : (
                                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
                            )}
                        </div>
                    </div>
                )}

                <div className="main-bottom">
                    <div className="search-box">
                        <input
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    onSent(); // Send prompt when Enter key is pressed
                                }
                            }}
                            onChange={(e) => setInput(e.target.value)}
                            value={input}
                            type="text"
                            placeholder='Enter a prompt here'
                        />
                        <div>
                            <img onClick={() => onSent()} src={assets.send_icon} alt="" />
                        </div>
                    </div>
                    <p className="bottom-info">
                        Gemini may display inaccurate info, including about people, so double-check its response, Your privacy and Gemini Apps
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Main;
