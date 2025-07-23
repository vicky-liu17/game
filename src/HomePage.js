import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MainComponent from './MainComponent'; // 引入MainComponent组件
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [characterData, setCharacterData] = useState(null);
  
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
        <MainComponent />
      </div>
      
    </div>
  );
}

export default HomePage;