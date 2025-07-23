// Cafe.js
import React, { useState, useEffect } from 'react';
import './Location.css';
import './Dice.css'; // 引入骰子样式

function Cafe({ characterData, onAttributeChange }) {
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
    
    // 只有当不显示女孩时，才增加金钱属性
    if (!willShowGirl && !attributeIncreased) {
      onAttributeChange && onAttributeChange('金钱', 1);
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
    // 获取魅力属性值
    const charmValue = characterData?.魅力 || 0;
    // 计算通过所需的骰子点数
    const requiredRoll = 7 - Math.min(charmValue / 2, 5); // 魅力越高，需要的点数越低
    
    // 显示判定结果
    const isSuccess = result >= requiredRoll;
    setJudgementText(`魅力检定：需要 ${requiredRoll}+ 点，掷出 ${result} 点，${isSuccess ? '成功！' : '失败！'}`);
    
    // 根据骰子结果设置对话状态
    setTimeout(() => {
      if (isSuccess) {
        setDialogueState('success');
        onAttributeChange && onAttributeChange('金钱', 2);
      } else {
        setDialogueState('failure');
        onAttributeChange && onAttributeChange('金钱', 1);
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
  
  const cafeStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(/images/Cafe.jpg)`
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
              <span className="character-name">池晓瑜</span>："哇！这里就是我要找的咖啡店！"
              <br />
              一位扎着双马尾的少女推开门，她穿着时尚的制服裙，活力四射。店铃清脆地响起，她朝你挥手示意。
              <br /><br />
              <span className="character-name">池晓瑜</span>："你好呀！我是晓瑜！我想点一杯...嗯..."
              <br />
              她认真地盯着菜单，眉头微皱，看起来有些犹豫不决。
                </p>
            {showChoices && (
              <div className="choice-container">
                <button className="choice-button" onClick={() => handleChoice('yes')}>热情推荐招牌饮品</button>
                <button className="choice-button" onClick={() => handleChoice('no')}>公式化介绍菜单</button>
              </div>
            )}
          </>
        );
      case 'rolling':
        return (
          <>
            <p className="library-text dialogue">
              <span className="character-name">池晓瑜</span>："哇，你这么热情啊！那我相信你的眼光！"
              <br />
              你微笑着为她介绍店里的招牌蓝莓星空气泡水和层次分明的彩虹拿铁，用你最生动的语言描述饮品的独特之处。
              <br /><br />
              <span style={{color: '#88ccff', fontWeight: 'bold'}}>进行魅力判定，看看你的推荐能否打动她...</span>
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
            <span className="character-name">池晓瑜</span>："哇！这杯星空气泡水也太好看了吧！"
            <br />
            少女兴奋地拿起饮品，从各个角度拍摄照片，眼睛里闪烁着星星。
            <br /><br />
            <span className="character-name">池晓瑜</span>："谢谢你的推荐！这简直太赞了！我一定要发朋友圈！对了，下次我带朋友一起来，你也给他们推荐吧！"
            <br />
            她开心地小小跳了一下，留下丰厚的小费，还加了你的联系方式。
            <br /><br />
            <span style={{color: '#ffcc00', fontWeight: 'bold'}}>金钱+2</span>
            <br />
            <span style={{color: '#88ccff', fontStyle: 'italic'}}>{judgementText}</span>
          </p>
        );
      case 'failure':
        return (
          <p className="library-text dialogue">
            <span className="character-name">池晓瑜</span>："嗯...看起来是挺好的..."
            <br />
            少女捧着饮品，表情略显犹豫，似乎并不完全满意。
            <br /><br />
            <span className="character-name">池晓瑜</span>："我还是觉得我朋友上次发的那家店更好看一些...不过这个也还行啦！谢谢你！"
            <br />
            她还是礼貌地付了钱，但只留下了正常小费。
            <br /><br />
            <span style={{color: '#ffcc00', fontWeight: 'bold'}}>金钱+1</span>
            <br />
            <span style={{color: '#88ccff', fontStyle: 'italic'}}>{judgementText}</span>
          </p>
        );
      case 'reject':
        return (
          <p className="library-text dialogue">
            <span className="character-name">池晓瑜</span>："呃...这些饮品的名字我都看不懂..."
            <br />
            少女听着你公式化的介绍，眼神渐渐失去了兴趣。
            <br /><br />
            <span className="character-name">池晓瑜</span>："那就...来杯最普通的美式吧，谢谢。"
            <br />
            她有些失望地低头玩起了手机，似乎对这次咖啡店体验并不满意。
          </p>
        );
      default:
        return null;
    }
  };

  return (
    <div className="location-container" style={cafeStyle}>
      <div className="location-title">咖啡馆</div>
      
      <div className={`content-wrapper ${fadeIn ? 'fade-in' : ''}`} style={{opacity: fadeIn ? 1 : 0, transition: 'opacity 0.5s ease'}}>
        {!showGirl ? (
          <p className="library-text">
            你推开咖啡馆的玻璃门，风铃清脆地响了一声。
            晨间的阳光斜照在吧台上，咖啡机嗡鸣，奶泡壶冒着热气。
            <br /><br />
            你系好围裙，擦干净最后一个马克杯，开始今日的打工修行。
            你做了7杯拿铁，其中3杯拉花失败，被自己偷偷喝掉。
            你擦了12遍桌子，第4桌的客人留下了小费——硬币一枚。
            你听了17遍"今天天气真好"，并回复了17遍"您的美式好了"。
            <br /><br />
            老板娘结算了工资。
            你数了数零钱，硬币叮当作响——
            <span style={{color: '#ffcc00', fontWeight: 'bold'}}>金钱+1</span>
          
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
              src={`/images/girl1.png`} 
              alt="池晓瑜" 
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Cafe;