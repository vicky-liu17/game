import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import HomePage from './HomePage'; // 从同一文件夹导入
import './App.css';

// 角色创建页组件
function CharacterCreation() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [customImage, setCustomImage] = useState(null);
  const [attributes, setAttributes] = useState({
    学识: 0,
    艺术: 0,
    魅力: 0,
    体能: 0,
    洞察: 0
  });

  // 默认图片列表 - 确保这些文件存在于 public/images 文件夹中
  const defaultImages = [
    '/images/avatar1.png',
    '/images/avatar2.png'
  ];
  
  // 计算剩余点数
  const totalPoints = 6;
  const usedPoints = Object.values(attributes).reduce((sum, value) => sum + value, 0);
  const remainingPoints = totalPoints - usedPoints;

  // 切换图片
  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? defaultImages.length - 1 : prevIndex - 1
    );
  };
  
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex + 1) % defaultImages.length
    );
  };

  // 处理上传图片
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCustomImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 处理属性点分配
  const handleAttributeChange = (attr, value) => {
    const newValue = Math.max(0, value); // 不能小于0
    const newAttributes = { ...attributes, [attr]: newValue };
    const newUsedPoints = Object.values(newAttributes).reduce((sum, val) => sum + val, 0);
    
    // 检查是否超过总点数
    if (newUsedPoints <= totalPoints) {
      setAttributes(newAttributes);
    }
  };

  // 处理角色创建和导航
  const handleCreateCharacter = () => {
    // 确保所有点数都已分配且名字不为空
    if (name && remainingPoints === 0) {
      // 创建角色数据对象
      const characterData = {
        name,
        image: customImage || `${process.env.PUBLIC_URL}${defaultImages[currentImageIndex]}`,
        attributes
      };
      
      // 导航到主页并传递角色数据
      navigate('/home', { state: characterData });
    }
  };

  return (
    <div className="character-creation">
      
      <div className="name-input-section">
        <input
          type="text"
          placeholder="输入你的名字，开始创建角色"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={20}
        />
      </div>
      
      <div className="avatar-section">
        <button className="arrow-btn left" onClick={handlePrevImage}>
          &lt;
        </button>
        
        <div className="avatar-container">
          <img 
            src={customImage || `${process.env.PUBLIC_URL}${defaultImages[currentImageIndex]}`}
            className="avatar-image" 
            alt="角色头像" 
          />
        </div>
        
        <button className="arrow-btn right" onClick={handleNextImage}>
          &gt;
        </button>
      </div>
      
      <div className="upload-section">
        <label className="upload-btn">
          上传自定义头像
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
            style={{ display: 'none' }} 
          />
        </label>
      </div>
      
      <div className="attributes-section">
        <h3>属性点分配 (剩余: {remainingPoints})</h3>
        <div className="attributes-container">
          {Object.keys(attributes).map((attr) => (
            <div className="attribute-row" key={attr}>
              <span className="attribute-name">{attr}</span>
              <div className="attribute-controls">
                <button 
                  onClick={() => handleAttributeChange(attr, attributes[attr] - 1)}
                  disabled={attributes[attr] <= 0}
                >
                  -
                </button>
                <span className="attribute-value">{attributes[attr]}</span>
                <button 
                  onClick={() => handleAttributeChange(attr, attributes[attr] + 1)}
                  disabled={remainingPoints <= 0}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <button 
        className="create-btn"
        disabled={!name || remainingPoints > 0}
        onClick={handleCreateCharacter}
      >
        创建角色
      </button>
    </div>
  );
}

// 主应用组件
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<CharacterCreation />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
