import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MainComponent from './MainComponent'; // 引入MainComponent组件
import Library from './Library'; // 引入图书馆组件
import Gym from './Gym'; // 引入健身房组件
import Cafe from './Cafe'; // 引入咖啡馆组件
import Shop from './Shop'; // 引入商店组件
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [characterData, setCharacterData] = useState(null);
  const [schedule, setSchedule] = useState([]); // 存储时间安排
  const [showScheduler, setShowScheduler] = useState(true); // 控制是否显示调度器
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0); // 当前显示的活动索引

  useEffect(() => {
    // 尝试从location.state获取数据
    if (location.state && location.state.name) {
      setCharacterData(location.state);
      localStorage.setItem('characterData', JSON.stringify(location.state));
    } else {
      // 尝试从localStorage获取
      const savedData = localStorage.getItem('characterData');
      if (savedData) {
        setCharacterData(JSON.parse(savedData));
      } else {
        // 无数据则返回角色创建页
        navigate('/');
      }
    }
  }, [location, navigate]);

  // 处理属性变化的函数
  const handleAttributeChange = (attributeName, value) => {
    if (characterData) {
      const updatedCharacter = {
        ...characterData,
        attributes: {
          ...characterData.attributes,
          [attributeName]: (characterData.attributes[attributeName] || 0) + value
        }
      };
      setCharacterData(updatedCharacter);
      localStorage.setItem('characterData', JSON.stringify(updatedCharacter));
    }
  };

  // 处理时间安排确认
  const handleScheduleConfirm = (confirmedSchedule) => {
    setSchedule(confirmedSchedule);
    setShowScheduler(false); // 隐藏调度器，显示安排结果
    setCurrentActivityIndex(0); // 重置当前活动索引
  };

  // 继续到下一个活动
  const goToNextActivity = () => {
    if (currentActivityIndex < schedule.length - 1) {
      setCurrentActivityIndex(currentActivityIndex + 1);
    } else {
      // 所有活动结束后，重新显示MainComponent
      setShowScheduler(true);
      setSchedule([]);
    }
  };

  // 根据场所名称返回对应的组件
  const renderPlaceComponent = (place) => {
    const placeName = place.name.toLowerCase();
    
    if (placeName.includes('图书馆')) {
      return <Library characterData={characterData} onAttributeChange={handleAttributeChange} />;
    } else if (placeName.includes('健身房')) {
      return <Gym characterData={characterData} onAttributeChange={handleAttributeChange} />;
    } else if (placeName.includes('咖啡馆')) {
      return <Cafe characterData={characterData} onAttributeChange={handleAttributeChange} />;
    } else if (placeName.includes('商店')) {
      return <Shop characterData={characterData} onAttributeChange={handleAttributeChange} />;
    } else {
      return (
        <div className="generic-place">
          <h3>{place.name}</h3>
          <p>正在{place.name}活动...</p>
        </div>
      );
    }
  };

  if (!characterData) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>加载中...</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* 顶部角色信息卡牌 */}
      <div className="character-card">
        <div className="character-avatar">
          <img src={characterData.image} alt="角色头像" />
        </div>
        <div className="character-info">
          <div className="character-name">{characterData.name}</div>
          <div className="character-attributes">
            <div className="attribute-item">
              <span className="attribute-label">学识: </span>
              <span className="attribute-value">{characterData.attributes.学识}</span>
            </div>
            <div className="attribute-item">
              <span className="attribute-label">艺术: </span>
              <span className="attribute-value">{characterData.attributes.艺术}</span>
            </div>
            <div className="attribute-item">
              <span className="attribute-label">魅力: </span>
              <span className="attribute-value">{characterData.attributes.魅力}</span>
            </div>
            <div className="attribute-item">
              <span className="attribute-label">体能: </span>
              <span className="attribute-value">{characterData.attributes.体能}</span>
            </div>
            <div className="attribute-item">
              <span className="attribute-label">洞察: </span>
              <span className="attribute-value">{characterData.attributes.洞察 || 0}</span>
            </div>
            <div className="attribute-item">
              <span className="attribute-label">金钱: </span>
              <span className="attribute-value">{characterData.attributes.金钱 || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 分隔线 */}
      <div className="separator-line"></div>

      {/* 主要内容区域 */}
      <div className="main-content">
        {showScheduler ? (
          <MainComponent onScheduleConfirm={handleScheduleConfirm} />
        ) : (
          <div className="schedule-display">
            <div className="schedule-header-container">
              {/* <h2 className="schedule-title">今日安排</h2> */}
              <div className="schedule-summary">
                {schedule.map((place, index) => (
                  <span key={index} className={`schedule-item-compact ${index === currentActivityIndex ? 'active' : index < currentActivityIndex ? 'completed' : ''}`}>
                    {getTimeSlot(index).split(' ')[1]}: {place.name}
                    {index < schedule.length - 1 ? ' → ' : ''}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="activity-display">
              <h3>{getTimeSlot(currentActivityIndex)} - {schedule[currentActivityIndex]?.name}</h3>
              {schedule.length > 0 && renderPlaceComponent(schedule[currentActivityIndex])}
              
              <div className="navigation-buttons">
                <button 
                  onClick={goToNextActivity} 
                  className="continue-button"
                >
                  {currentActivityIndex < schedule.length - 1 ? "继续" : "结束今日行程"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 辅助函数：根据索引返回时间段
function getTimeSlot(index) {
  const timeSlots = ["上午", "中午", "下午", "晚上"];
  return timeSlots[index] || `时段 ${index + 1}`;
}

export default HomePage;