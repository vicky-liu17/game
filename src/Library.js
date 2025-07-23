// Library.js
import React, { useState, useEffect } from 'react';
import './Location.css';
import './Dice.css'; // 确保引入骰子样式

function Library({ characterData, onAttributeChange }) {
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
    
    // 只有当不显示女孩时，才增加学识属性
    if (!willShowGirl && !attributeIncreased) {
      onAttributeChange && onAttributeChange('学识', 1);
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
      // 选择不帮忙
      setDialogueState('reject');
      setShowChoices(false);
      setShowResult(true);
    }
  };
  
  const handleDiceResult = (result) => {
    // 获取学识属性值
    const knowledgeValue = characterData?.学识 || 0;
    // 计算通过所需的骰子点数
    const requiredRoll = 7 - Math.min(knowledgeValue / 3, 5); // 学识越高，需要的点数越低
    
    // 显示判定结果
    const isSuccess = result >= requiredRoll;
    setJudgementText(`学识检定：需要 ${requiredRoll}+ 点，掷出 ${result} 点，${isSuccess ? '成功！' : '失败！'}`);
    
    // 根据骰子结果设置对话状态
    setTimeout(() => {
      if (isSuccess) {
        setDialogueState('success');
        onAttributeChange && onAttributeChange('魅力', 1);
      } else {
        setDialogueState('failure');
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
  
  const libraryStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(/images/library.jpg)`
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
            <p className="library-text dialogue">
              <span className="character-name">沈疏桐</span>："那个...同学，打扰一下。"
              <br />
              坐在角落里的少女抬起头来，乌黑的长发轻轻滑过肩膀。她身着学院特制的制服，气质清冷而高贵。
              <br /><br />
              <span className="character-name">沈疏桐</span>："我对这道微积分题有些困惑，听说你在数学方面很有造诣...能帮我看一下吗？"
            </p>
            {showChoices && (
              <div className="choice-container">
                <button className="choice-button" onClick={() => handleChoice('yes')}>帮忙解答问题</button>
                <button className="choice-button" onClick={() => handleChoice('no')}>婉拒请求</button>
              </div>
            )}
          </>
        );
      case 'rolling':
        return (
          <>
            <p className="library-text dialogue">
              <span className="character-name">沈疏桐</span>："这道题目涉及到隐函数求导，我不太确定怎么处理这个部分..."
              <br />
              你仔细看了一眼题目，心里默默评估着自己的知识储备。
              <br /><br />
              <span style={{color: '#88ccff', fontWeight: 'bold'}}>进行学识判定，看看你能否成功解答...</span>
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
          <p className="library-text dialogue">
            <span className="character-name">沈疏桐</span>："哦！原来是这样解...我明白了。"
            <br />
            少女的眼睛亮了起来，嘴角露出一丝微笑。
            <br /><br />
            <span className="character-name">沈疏桐</span>："真是太感谢你了。你讲解得很清晰，比老师还要好。下次...如果还有不会的题，我可以再来找你吗？"
            <br /><br />
            <span style={{color: '#ffcc00', fontWeight: 'bold'}}>魅力+1</span>
            <br />
            <span style={{color: '#88ccff', fontStyle: 'italic'}}>{judgementText}</span>
          </p>
        );
      case 'failure':
        return (
          <p className="library-text dialogue">
            <span className="character-name">沈疏桐</span>："嗯...我觉得这个解法好像不太对..."
            <br />
            少女微蹙眉头，手指轻点着纸张。
            <br /><br />
            <span className="character-name">沈疏桐</span>："不过还是谢谢你愿意帮忙。我想我可能需要去请教一下数学教授。"
            <br /><br />
            <span style={{color: '#88ccff', fontStyle: 'italic'}}>{judgementText}</span>
          </p>
        );
      case 'reject':
        return (
          <p className="library-text dialogue">
            <span className="character-name">沈疏桐</span>："啊，抱歉打扰你了。我理解你也有自己的学习安排..."
            <br />
            少女略显失落地低下头，将散落的发丝别到耳后。
            <br /><br />
            <span className="character-name">沈疏桐</span>："那我不打扰你了，再见。"
          </p>
        );
      default:
        return null;
    }
  };

  return (
    <div className="location-container" style={libraryStyle}>
      <div className="location-title">图书馆</div>
      
      <div className={`content-wrapper ${fadeIn ? 'fade-in' : ''}`} style={{opacity: fadeIn ? 1 : 0, transition: 'opacity 0.5s ease'}}>
        {!showGirl ? (
          <p className="library-text">
            你推开图书馆的大门，油墨与旧纸的气息扑面而来。
            晨光斜照在书架上，你选了个安静的角落坐下，摊开笔记，开始今日的修行。
            <br /><br />
            你读完了《中世纪欧洲农业史·下册》，窗外的麻雀叫了17次。
            你啃透了《线性代数习题集》，隔壁桌的情侣悄悄牵了手又松开。
            你抄写《古典哲学金句300条》，钢笔没水了，换了一支。
            <br /><br />
            你合上最后一本书，伸了个懒腰——
            <span style={{color: '#ffcc00', fontWeight: 'bold'}}>学识+1</span>
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
              src={`/images/girl2.png`} 
              alt="沈疏桐" 
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Library;