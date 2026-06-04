import React, { useState, useEffect } from 'react';
import './Gallery.css';

// 하트 아이콘
const HeartIcon = ({ isLiked }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    width="24" 
    height="24"
    fill={isLiked ? "#ff4757" : "none"} 
    stroke={isLiked ? "#ff4757" : "#333"} 
    strokeWidth="2"
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export default function Gallery() {
  // 1. Unsplash 데이터를 저장할 상태 추가
  const [items, setItems] = useState([]);

  const [likedIds, setLikedIds] = useState(() => {
    const savedLikes = localStorage.getItem('liked_ui_refs');
    return savedLikes ? JSON.parse(savedLikes) : [];
  });
  
  const [showFavorites, setShowFavorites] = useState(false);
  
  const [selectedItem, setSelectedItem] = useState(null);

  // 2. 컴포넌트 마운트 시 Unsplash API 호출
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const accessKey = import.meta.env.VITE_UNSPLASH_KEY;
        
        // ui-design 키워드로 래퍼런스 이미지 30개 가져오기
        const response = await fetch(`https://api.unsplash.com/search/photos?query=ui-design&per_page=30&client_id=${accessKey}`);
        const data = await response.json();
        
        const formattedData = data.results.map((img) => ({
          id: img.id,
          url: img.urls.regular,
          title: img.description || img.alt_description || 'UI/UX Design'
        }));
        
        setItems(formattedData);
      } catch (error) {
        console.error("데이터를 불러오는데 실패했습니다:", error);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    localStorage.setItem('liked_ui_refs', JSON.stringify(likedIds));
  }, [likedIds]);

  const toggleLike = (e, id) => {
    e.stopPropagation(); 
    setLikedIds((prev) =>
      prev.includes(id) 
        ? prev.filter((likedId) => likedId !== id) 
        : [...prev, id] 
    );
  };

  // 4. API로 받아온 items 상태를 필터링
  const displayedItems = showFavorites 
    ? items.filter(item => likedIds.includes(item.id))
    : items;

  return (
    <div className="gallery-wrapper">
      <header className="gallery-header">
        <h2>UI/UX 레퍼런스 갤러리</h2>
        <p>마음에 드는 디자인에 하트를 눌러 즐겨찾기 해보세요!</p>
        
        <div className="filter-tabs">
          <button 
            className={`tab-btn ${!showFavorites ? 'active' : ''}`}
            onClick={() => setShowFavorites(false)}
          >
            전체 보기
          </button>
          <button 
            className={`tab-btn ${showFavorites ? 'active' : ''}`}
            onClick={() => setShowFavorites(true)}
          >
            즐겨찾기 ({likedIds.length})
          </button>
        </div>
      </header>

      <div className="masonry-grid">
        {displayedItems.length === 0 ? (
          <div className="empty-state">
            <p>아직 즐겨찾기한 레퍼런스가 없거나 불러오는 중입니다.</p>
          </div>
        ) : (
          displayedItems.map((item) => {
            const isLiked = likedIds.includes(item.id);

            return (
              <div 
                key={item.id} 
                className="masonry-item"
                onClick={() => setSelectedItem(item)}
              >
                <img src={item.url} alt={item.title} className="ref-image" />
                
                <div className="item-overlay">
                  <span className="item-title">{item.title}</span>
                  <button
                    className="heart-btn"
                    onClick={(e) => toggleLike(e, item.id)}
                  >
                    <HeartIcon isLiked={isLiked} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedItem(null)}>✕</button>
            <img src={selectedItem.url} alt={selectedItem.title} className="modal-image" />
            <div className="modal-info">
              <h3>{selectedItem.title}</h3>
              <button
                className="heart-btn"
                onClick={(e) => toggleLike(e, selectedItem.id)}
              >
                <HeartIcon isLiked={likedIds.includes(selectedItem.id)} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}