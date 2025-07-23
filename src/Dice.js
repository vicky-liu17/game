// Dice.js
import React, { useState, useEffect } from 'react';
import './Dice.css';

const Dice = ({ onRollComplete }) => {
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  // 骰子各面对应的旋转角度
  const faceRotations = {
    1: { x: 0, y: 0 },       // 正面朝上 (1)
    2: { x: 0, y: -90 },     // 右面朝上 (2)
    3: { x: -90, y: 0 },     // 上面朝上 (3)
    4: { x: 90, y: 0 },      // 下面朝上 (4)
    5: { x: 0, y: 90 },      // 左面朝上 (5)
    6: { x: 180, y: 0 }      // 背面朝上 (6)
  };

  const rollDice = () => {
    if (rolling) return;
    
    setRolling(true);
    setResult(null);
    
    // 生成随机旋转角度以增加动画效果
    const randomX = Math.floor(Math.random() * 5 + 3) * 360;
    const randomY = Math.floor(Math.random() * 5 + 3) * 360;
    
    // 设置中间动画状态
    setRotation({ x: randomX, y: randomY });
    
    // 计算结果
    const newResult = Math.floor(Math.random() * 6) + 1;
    
    // 动画结束后显示结果
    setTimeout(() => {
      // 计算最终旋转角度以展示正确的面
      const targetRotation = faceRotations[newResult];
      
      // 保证旋转方向一致性 (加上随机的完整旋转次数)
      setRotation({
        x: randomX + targetRotation.x,
        y: randomY + targetRotation.y
      });
      
      setTimeout(() => {
        setResult(newResult);
        setRolling(false);
        if (onRollComplete) {
          onRollComplete(newResult);
        }
      }, 500); // 等待最终旋转完成
      
    }, 1500); // 随机旋转持续时间
  };

  return (
    <div className="dice-container">
      <div className="dice-area">
        <div 
          className={`dice ${rolling ? 'rolling' : ''}`} 
          onClick={rollDice}
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
          }}
        >
          <div className="face front">
            <span className="dot center"></span>
          </div>
          <div className="face back">
            <span className="dot top-left"></span>
            <span className="dot top-right"></span>
            <span className="dot center"></span>
            <span className="dot bottom-left"></span>
            <span className="dot bottom-right"></span>
            <span className="dot middle-left"></span>
          </div>
          <div className="face right">
            <span className="dot top-left"></span>
            <span className="dot bottom-right"></span>
          </div>
          <div className="face left">
            <span className="dot top-left"></span>
            <span className="dot center"></span>
            <span className="dot bottom-left"></span>
            <span className="dot top-right"></span>
            <span className="dot bottom-right"></span>
          </div>
          <div className="face top">
            <span className="dot top-left"></span>
            <span className="dot top-right"></span>
            <span className="dot bottom-left"></span>
          </div>
          <div className="face bottom">
            <span className="dot top-left"></span>
            <span className="dot top-right"></span>
            <span className="dot bottom-left"></span>
            <span className="dot bottom-right"></span>
          </div>
        </div>
      </div>
      
      {!rolling && result && (
        <div className="dice-result">
          <p>骰子点数: <strong>{result}</strong></p>
        </div>
      )}
      
      {!rolling && (
        <div className="dice-instruction">
          {result ? '再次点击骰子以重新投掷' : '点击骰子开始投掷'}
        </div>
      )}
    </div>
  );
};

export default Dice;