import React, { useState, useRef, useEffect } from 'react';
import './MainComponent.css';

// 模拟地点数据，增加健身房
const places = [
  { id: 1, name: '图书馆', icon: '📚', x: 50, y: 30 },
  { id: 2, name: '咖啡馆', icon: '☕', x: 70, y: 60 },
  { id: 3, name: '商店', icon: '🏪', x: 30, y: 70 },
  { id: 4, name: '健身房', icon: '🏋️', x: 60, y: 40 }
];

function MainComponent() {
  const [timeSlots, setTimeSlots] = useState(['', '', '', '']); // 时间轴槽位
  const [draggingItem, setDraggingItem] = useState(null);
  const [showTooltip, setShowTooltip] = useState(true); // 控制初始浮窗显示
  const mapRef = useRef(null);
  const timelineRef = useRef(null);
  
  // 自动在3秒后隐藏提示
  useEffect(() => {
    if (showTooltip) {
      const timer = setTimeout(() => {
        setShowTooltip(false);
      }, 5000); // 5秒后自动隐藏
      
      return () => clearTimeout(timer);
    }
  }, [showTooltip]);

  // 处理拖动开始
  const handleDragStart = (e, place) => {
    setDraggingItem(place);
    setShowTooltip(false); // 开始拖动时隐藏提示
    
    // 创建自定义拖动图像
    const dragIcon = document.createElement('div');
    dragIcon.className = 'drag-icon';
    dragIcon.textContent = place.icon;
    document.body.appendChild(dragIcon);
    e.dataTransfer.setDragImage(dragIcon, 15, 15);
    
    // 清理函数
    setTimeout(() => {
      document.body.removeChild(dragIcon);
    }, 0);

    e.dataTransfer.setData('text/plain', place.id);
  };

  // 处理拖放结束
  const handleDragEnd = () => {
    setDraggingItem(null);
  };

  // 允许放置
  const allowDrop = (e) => {
    e.preventDefault();
  };

  // 处理放置到时间轴槽位
  const handleDrop = (e, index) => {
    e.preventDefault();
    if (!draggingItem) return;
    
    const newTimeSlots = [...timeSlots];
    newTimeSlots[index] = draggingItem;
    setTimeSlots(newTimeSlots);
  };

  // 移除时间轴槽位的项目
  const removeFromTimeline = (index) => {
    const newTimeSlots = [...timeSlots];
    newTimeSlots[index] = '';
    setTimeSlots(newTimeSlots);
  };

  // 关闭提示浮窗
  const closeTooltip = () => {
    setShowTooltip(false);
  };

  return (
    <div className="main-container">
      {/* 初始提示浮窗 */}
      {showTooltip && (
        <div className="tooltip-overlay" onClick={closeTooltip}>
          <div className="tooltip-container" onClick={(e) => e.stopPropagation()}>
            <div className="tooltip-content">
              <p>拖动地点标签到下方时间轴，安排你一天的日程，点击确认后开始</p>
              <button className="tooltip-button" onClick={closeTooltip}>我知道了</button>
            </div>
          </div>
        </div>
      )}
      
      <div className="map-container" ref={mapRef}>
        <img src="/images/map.jpg" alt="Map" className="map-image" />
        
        {/* 地图上的地点图标 */}
        {places.map(place => (
          <div
            key={place.id}
            className="place-icon"
            style={{ 
              left: `${place.x}%`, 
              top: `${place.y}%` 
            }}
            draggable
            onDragStart={(e) => handleDragStart(e, place)}
            onDragEnd={handleDragEnd}
          >
            <div className="icon">{place.icon}</div>
            <div className="place-name">{place.name}</div>
          </div>
        ))}
      </div>

      {/* 底部时间轴 */}
      <div className="timeline-container" ref={timelineRef}>
        <div className="timeline-header">
          <div className="timeline-title">时间安排</div>
        </div>
        <div className="timeline">
          {timeSlots.map((slot, index) => (
            <div 
              key={index} 
              className={`timeline-slot ${slot ? 'filled' : ''}`}
              onDragOver={allowDrop}
              onDrop={(e) => handleDrop(e, index)}
              onClick={() => slot && removeFromTimeline(index)}
            >
              {slot && (
                <div className="slot-content">
                  <div className="slot-icon">{slot.icon}</div>
                  <div className="slot-name">{slot.name}</div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="confirm-button">确认</div>
      </div>
    </div>
  );
}

export default MainComponent;