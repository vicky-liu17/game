// Shop.js
import React, { useState } from 'react';
import './Shop.css';

function Shop({ characterData, onAttributeChange }) {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleBuyItem = (item) => {
    // 检查是否有足够的金钱
    if (characterData.attributes.金钱 >= 1) {
      // 减少金钱
      onAttributeChange('金钱', -1);
      // 增加魅力
      onAttributeChange('魅力', 1);
    } else {
      alert('金钱不足，无法购买！');
    }
  };

  const handleGoBack = () => {
    // 不执行任何操作，goToNextActivity 函数会处理导航
  };

  return (
    <div className="shop-container">
      <div className="shop-content">
        <div className="shop-description">
          <p>
            你推开挂着风铃的玻璃门，暖光灯下陈列着当季新款。
            人造毛皮与雪纺布料摩挲作响，店员露出职业性微笑：
            "欢迎光临，新品第二件八折哦~"
          </p>
        </div>
        
        <div className="shop-items">
          <div className="shop-items-container">
            <div 
              className={`shop-item ${selectedItem === 'casual' ? 'selected' : ''}`}
              onClick={() => setSelectedItem('casual')}
            >
              <div className="item-icon">👕</div>
              <div className="item-name">休闲装</div>
              <div className="item-price">💰1</div>
            </div>
            
            <div 
              className={`shop-item ${selectedItem === 'formal' ? 'selected' : ''}`}
              onClick={() => setSelectedItem('formal')}
            >
              <div className="item-icon">👔</div>
              <div className="item-name">正装</div>
              <div className="item-price">💰1</div>
            </div>
          </div>
          
          <div className="item-description">
            {selectedItem ? <p>购买衣服可以增加魅力1点</p> : <p>请选择一件衣服</p>}
          </div>
          
          <div className="shop-actions">
            <button 
              className="buy-button" 
              disabled={!selectedItem} 
              onClick={() => handleBuyItem(selectedItem)}
            >
              购买
            </button>
            <button 
              className="leave-button" 
              onClick={handleGoBack}
            >
              离开
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Shop;