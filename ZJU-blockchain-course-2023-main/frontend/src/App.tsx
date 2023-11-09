import React from 'react';
import './App.css';
import BorrowYourCarPage from "./pages/BorrowYourCar";

function App() {
    return (
        <div className="App">
            <BorrowYourCarPage/>
            <div className="message-container">
                <span className="message">汽车租用系统</span>
                <br />
                <span className="message">基于以太坊</span>
                <br />
                <span className="message">--by ayuan</span>
                <br />
                <span className="message">ZJU-BlockChainCourse-2023</span>
            </div>
        </div>
    );
}

export default App;
