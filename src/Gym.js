// Gym.js
import React, { useState, useEffect } from 'react';
import './Location.css';
import './Dice.css'; // 引入骰子样式

function Gym({ characterData, onAttributeChange }) {
  const [showGirl, setShowGirl] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [attributeIncreased, setAttributeIncreased] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [dialogueState, setDialogueState] = useState('initial'); // initial, choice, rolling, success, failure
  const [showResult, setShowResult] = useState(false);
  const [showDice, setShowDice] = useState(false);
  const [diceResult, setDiceResult] = useState(null);
  const [judgementText, setJudgementText] = useState('');
  
  useEffect(() => {
    const randomValue = Math.random();
    const willShowGirl = randomValue < 0.5;
    setShowGirl(willShowGirl);
    
    // 添加淡入效果
    setTimeout(() => {
      setFadeIn(true);
    }, 100);

    // 只有当不显示女孩时，才增加体能属性
    if (!willShowGirl && !attributeIncreased) {
      onAttributeChange && onAttributeChange('体能', 1);
      setAttributeIncreased(true);
    }
  }, []); // 空依赖数组确保效果只在组件挂载时运行一次
  
  const handleChoice = (choice) => {
    if (choice === 'yes') {
      // 显示骰子进行判定
      setDialogueState('rolling');
      setShowDice(true);
      setShowChoices(false);
    } else {
      // 选择不接受挑战
      setDialogueState('reject');
      setShowChoices(false);
      setShowResult(true);
    }
  };
  
  const handleDiceResult = (result) => {
    // 获取体能属性值
    const strengthValue = characterData?.体能 || 0;
    // 计算通过所需的骰子点数
    const requiredRoll = 7 - Math.min(strengthValue / 2, 5); // 体能越高，需要的点数越低
    
    // 显示判定结果
    const isSuccess = result >= requiredRoll;
    setJudgementText(`体能检定：需要 ${requiredRoll}+ 点，掷出 ${result} 点，${isSuccess ? '成功！' : '失败！'}`);
    
    // 根据骰子结果设置对话状态
    setTimeout(() => {
      if (isSuccess) {
        setDialogueState('success');
        onAttributeChange && onAttributeChange('体能', 2);
      } else {
        setDialogueState('failure');
        onAttributeChange && onAttributeChange('体能', 1);
      }
      setShowDice(false);
      setDiceResult(result);
      setShowResult(true);
    }, 1500);
  };
  
  const showInitialDialogue = () => {
    setDialogueState('initial');
    setShowChoices(true);
  };
  
  const gymStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${process.env.PUBLIC_URL}/images/gym.jpg)`
  };

  // 骰子组件
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
  
    useEffect(() => {
      // 组件挂载时自动掷骰子
      rollDice();
    }, []);
  
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
      </div>
    );
  };

  const renderGirlContent = () => {
    switch (dialogueState) {
      case 'initial':
        return (
          <>
            <p className="gym-text dialogue">
              一位扎着高马尾的少女向你走来，她穿着活力十足的运动套装。汗水让她的皮肤闪闪发光。
              <br />
              <span className="character-name">季清梨</span>："喂！你也是来训练的吗？我是校队的季清梨！你看起来身体素质不错嘛！要不要来场友谊赛？我正需要一个陪练！怎么样，敢接受挑战吗？"
            </p>
            {showChoices && (
              <div className="choice-container">
                <button className="choice-button" onClick={() => handleChoice('yes')}>接受挑战</button>
                <button className="choice-button" onClick={() => handleChoice('no')}>婉拒邀请</button>
              </div>
            )}
          </>
        );
      case 'rolling':
        return (
          <>
            <p className="gym-text dialogue">
              <span className="character-name">季清梨</span>："好样的！这才是我喜欢的态度！"
              <span className="character-name">季清梨</span>："先做个简单的热身赛吧，看看你的实力如何！"
              <span style={{color: '#88ccff', fontWeight: 'bold'}}>进行体能判定，看看你的表现如何...</span>
            </p>
            {showDice && (
              <div className="dice-wrapper">
                <Dice onRollComplete={handleDiceResult} />
              </div>
            )}
          </>
        );
      case 'success':
        return (
          <p className="gym-text dialogue">
            <span className="character-name">季清梨</span>："哇！没想到你这么厉害！"
            <br />
            她惊讶地睁大眼睛，大汗淋漓地站在原地，呼吸急促却笑容满面。
            <br /><br />
            <span className="character-name">季清梨</span>："太棒了！我好久没遇到能跟上我节奏的人了！你的技巧和体力都很出色！"
            <br />
            她兴奋地拍了拍你的肩膀，眼神中充满了敬佩。
            <br /><br />
            <span className="character-name">季清梨</span>："从今天起，你就是我的固定训练搭档了！我会教你一些特别的训练方法，绝对能让你更强！"
            <br /><br />
            <span style={{color: '#ffcc00', fontWeight: 'bold'}}>体能+2</span>
            <br />
            <span style={{color: '#88ccff', fontStyle: 'italic'}}>{judgementText}</span>
          </p>
        );
      case 'failure':
        return (
          <p className="gym-text dialogue">
            <span className="character-name">季清梨</span>："嘿，已经很不错了！别气馁！"
            <br />
            你气喘吁吁地靠在墙边，而她看起来依然精力充沛。
            <br /><br />
            <span className="character-name">季清梨</span>："对新手来说，你的表现已经超出我预期了！不过看来我们还需要加强你的耐力训练。"
            <br />
            她递给你一瓶水，友善地笑着。
            <br /><br />
            <span style={{color: '#ffcc00', fontWeight: 'bold'}}>体能+1</span>
            <br />
            <span style={{color: '#88ccff', fontStyle: 'italic'}}>{judgementText}</span>
          </p>
        );
      case 'reject':
        return (
          <p className="gym-text dialogue">
            <span className="character-name">季清梨</span>："哎？不敢挑战吗？真可惜！"
            <br />
            她略显失望，但很快又恢复了阳光的笑容。
            <br /><br />
            <span className="character-name">季清梨</span>："没关系啦！健身本来就是量力而行。下次你准备好了，随时可以来找我！"
            <br />
            她挥了挥手，转身回到自己的训练区域，继续专注地锻炼着。
          </p>
        );
      default:
        return null;
    }
  };

  return (
    <div className="location-container" style={gymStyle}>
      <div className="location-title">健身房</div>
      
      <div className={`content-wrapper ${fadeIn ? 'fade-in' : ''}`} style={{opacity: fadeIn ? 1 : 0, transition: 'opacity 0.5s ease'}}>
        {!showGirl ? (
          <p className="gym-text">
            你踏入健身房，熟悉的运动气息迎面扑来。
            今天的训练计划已在脑中成型，你活动了一下筋骨，开始了锻炼。
            <br /><br />
            你完成了三组深蹲，汗水浸透了背部。
            你坚持了最后一组卧推，肌肉的酸痛感如潮水般袭来。
            在跑步机上，你跑完了计划的5公里，呼吸渐渐平稳。
            <br /><br />
            离开健身房时，你感到身体更加轻盈有力——
            <span style={{color: '#ffcc00', fontWeight: 'bold'}}>体能+1</span>
          </p>
        ) : (
          <div className="girl-content">
            {dialogueState === 'initial' && !showChoices ? (
              <button className="start-dialogue" onClick={showInitialDialogue}>开始对话</button>
            ) : (
              renderGirlContent()
            )}
            <img 
              className="girl-image"
              src={`${process.env.PUBLIC_URL}/images/girl3.png`} 
              alt="季清梨" 
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Gym;