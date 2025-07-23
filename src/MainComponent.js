import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainComponent.css';

// 模拟地点数据，增加健身房
const places = [
  { id: 1, name: '图书馆', icon: '📚', x: 50, y: 30 },
  { id: 2, name: '咖啡馆', icon: '☕', x: 70, y: 60 },
  { id: 3, name: '商店', icon: '🏪', x: 30, y: 70 },
  { id: 4, name: '健身房', icon: '🏋️', x: 60, y: 40 }
];

function MainComponent({ onScheduleConfirm }) {
  const [timeSlots, setTimeSlots] = useState(['', '', '', '']); // 时间轴槽位
  const [draggingItem, setDraggingItem] = useState(null);
  const [showTooltip, setShowTooltip] = useState(true); // 控制初始浮窗显示
  const [touchDragItem, setTouchDragItem] = useState(null); // 触摸拖动的项目
  const [touchPosition, setTouchPosition] = useState({ x: 0, y: 0 }); // 触摸位置
  const [activeDragElement, setActiveDragElement] = useState(null); // 用于视觉反馈
  const mapRef = useRef(null);
  const timelineRef = useRef(null);
  const navigate = useNavigate();
  
  // 自动在5秒后隐藏提示
  useEffect(() => {
    if (showTooltip) {
      const timer = setTimeout(() => {
        setShowTooltip(false);
      }, 5000); // 5秒后自动隐藏
      
      return () => clearTimeout(timer);
    }
  }, [showTooltip]);

  // 处理鼠标拖动开始
  const handleDragStart = (e, place) => {
    setDraggingItem(place);
    setShowTooltip(false); // 开始拖动时隐藏提示
    
    // 创建自定义拖动图像
    const dragIcon = document.createElement('div');
    dragIcon.className = 'drag-icon';
    dragIcon.textContent = place.icon;
    document.body.appendChild(dragIcon);
    
    // 只有在dataTransfer可用时才设置拖动图像
    if (e.dataTransfer) {
      e.dataTransfer.setDragImage(dragIcon, 15, 15);
      e.dataTransfer.setData('text/plain', place.id);
    }
    
    // 清理函数
    setTimeout(() => {
      document.body.removeChild(dragIcon);
    }, 0);
  };

  // 处理拖放结束
  const handleDragEnd = () => {
    setDraggingItem(null);
  };

  // 允许放置
  const allowDrop = (e) => {
    if (e.preventDefault) {
      e.preventDefault();
    }
  };

  // 处理放置到时间轴槽位
  const handleDrop = (e, index) => {
    if (e.preventDefault) {
      e.preventDefault();
    }
    
    const item = draggingItem || touchDragItem;
    if (!item) return;
    
    const newTimeSlots = [...timeSlots];
    newTimeSlots[index] = item;
    setTimeSlots(newTimeSlots);
    
    // 清除触摸状态
    setTouchDragItem(null);
    setActiveDragElement(null);
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

  // 确认时间安排
  const handleConfirm = () => {
    // 过滤掉空的时间槽
    const schedule = timeSlots.filter(slot => slot !== '');
    
    // 如果没有安排任何活动，显示提示
    if (schedule.length === 0) {
      alert('请至少安排一个地点！');
      return;
    }
    
    // 调用父组件传入的回调函数，传递安排好的日程
    if (onScheduleConfirm) {
      onScheduleConfirm(schedule);
    }
  };
  
  // 触摸事件处理 - 开始触摸
  const handleTouchStart = (e, place) => {
    setShowTooltip(false);
    setTouchDragItem(place);
    
    // 创建一个悬浮的拖拽元素
    const dragElement = document.createElement('div');
    dragElement.className = 'floating-drag-element';
    dragElement.innerHTML = `<div class="icon">${place.icon}</div><div class="place-name">${place.name}</div>`;
    document.body.appendChild(dragElement);
    
    // 保存元素引用以便移动和删除
    setActiveDragElement(dragElement);
    
    // 设置初始位置
    const touch = e.touches[0];
    setTouchPosition({ x: touch.clientX, y: touch.clientY });
    
    // 移动元素到触摸位置
    dragElement.style.left = `${touch.clientX - 20}px`;
    dragElement.style.top = `${touch.clientY - 20}px`;
  };
  
  // 触摸事件处理 - 移动
  const handleTouchMove = (e) => {
    if (touchDragItem && activeDragElement) {
      e.preventDefault(); // 防止页面滚动
      const touch = e.touches[0];
      setTouchPosition({ x: touch.clientX, y: touch.clientY });
      
      // 移动元素跟随手指
      activeDragElement.style.left = `${touch.clientX - 20}px`;
      activeDragElement.style.top = `${touch.clientY - 20}px`;
    }
  };
  
  // 触摸事件处理 - 结束触摸
  const handleTouchEnd = (e) => {
    if (touchDragItem && activeDragElement) {
      // 检查触摸结束时的位置是否在时间轴槽位上
      const timelineSlots = document.querySelectorAll('.timeline-slot');
      
      // 从DOM中移除拖拽元素
      document.body.removeChild(activeDragElement);
      setActiveDragElement(null);
      
      // 检查是否放在时间轴上的某个槽位
      let dropped = false;
      timelineSlots.forEach((slot, index) => {
        const rect = slot.getBoundingClientRect();
        if (
          touchPosition.x >= rect.left &&
          touchPosition.x <= rect.right &&
          touchPosition.y >= rect.top &&
          touchPosition.y <= rect.bottom
        ) {
          // 放置到此槽位
          const newTimeSlots = [...timeSlots];
          newTimeSlots[index] = touchDragItem;
          setTimeSlots(newTimeSlots);
          dropped = true;
        }
      });
      
      // 重置状态
      if (!dropped) {
        setTouchDragItem(null);
      } else {
        setTouchDragItem(null);
      }
    }
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
        <div className="confirm-button" onClick={handleConfirm}>确认</div>
      </div>
    </div>
  );
}

export default MainComponent;