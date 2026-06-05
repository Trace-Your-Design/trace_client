import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigate, Route, Routes } from 'react-router-dom'
import './TraceLearningBoard.css';
import Logo from '../../assets/TraceLogo.png';
import Robot from '../../assets/Tracer.png';

const ROADMAP = [
  {
    id: 1,
    title: '레이아웃과 그리드',
    desc: '화면을 안정적으로 배치하는 기준',
    assistant: '안녕! 첫 번째 단계야. 화면을 규칙적으로 나누는 12단 그리드를 조절해볼까? Columns와 Margin을 조절해서 안정적인 배치 기준을 만들어봐.',
  },
  {
    id: 2,
    title: '여백과 간격',
    desc: 'margin, padding, 요소 간 간격',
    assistant: '좋아! 이제 요소들의 숨통을 트여줄 차례야. 상자들 사이의 간격(Gap)과 내부 여백(Padding)을 조절해서 시각적으로 편안하게 만들어보자.',
  },
  {
    id: 3,
    title: '타이포그래피',
    desc: '제목, 본문, 보조 텍스트의 위계',
    assistant: '글자의 위계(Hierarchy)를 세워보자. 제목은 크게, 본문은 읽기 편하게! Serif와 Sans-serif 폰트의 차이도 직접 느껴봐.',
  },
  {
    id: 4,
    title: '색상과 대비',
    desc: '메인 컬러, 배경 컬러, 텍스트 대비',
    assistant: '브랜드의 성격을 결정하는 색상이야. 배경색과 글자색의 대비가 충분해야 읽기 편해. 메인 컬러를 선택해봐!',
  },
  {
    id: 5,
    title: '버튼과 카드',
    desc: '사용자가 누르고 읽는 컴포넌트',
    assistant: '이제 실제 컴포넌트를 디자인해보자. 버튼의 둥글기(Radius)와 카드의 그림자(Shadow)가 사용자 경험에 큰 영향을 줘.',
  },
  {
    id: 6,
    title: '디자인 시스템',
    desc: '색상, 폰트, 컴포넌트 규칙 정리',
    assistant: '지금까지 만든 규칙들을 한곳에 모았어. 이게 바로 너만의 "디자인 시스템"이야. 규칙이 일관적인지 확인해봐.',
  },
  {
    id: 7,
    title: '화면 레이아웃 적용',
    desc: '만든 요소들을 실제 화면 구성에 적용',
    assistant: '마지막이야! 네가 만든 시스템을 활용해서 실제 서비스 화면을 완성했어. 멋진 디자인 발자취를 남겼는걸?',
  },
];

export default function TraceLearningBoard() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  // 1-2단계: 레이아웃 & 간격
  const [gridColumns, setGridColumns] = useState(12);
  const [gridMargin, setGridMargin] = useState(24);
  const [boxGap, setBoxGap] = useState(16);
  const [boxPadding, setBoxPadding] = useState(20);

  // 3단계: 타이포그래피
  const [fontFamily, setFontFamily] = useState('Inter');
  const [titleSize, setTitleSize] = useState(32);
  const [bodySize, setBodySize] = useState(16);

  // 4단계: 색상
  const [primaryColor, setPrimaryColor] = useState('#18a0fb');
  const [canvasBg, setCanvasBg] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#333333');

  // 5단계: 컴포넌트
  const [borderRadius, setBorderRadius] = useState(8);
  const [elevation, setElevation] = useState(4);

  const stepData = ROADMAP.find((s) => s.id === currentStep);

  // 6~7단계용 localStorage 데이터 불러오기 변수
  const savedPrimary = localStorage.getItem('trace_primaryColor') || '#18a0fb';
  const savedBg = localStorage.getItem('trace_canvasBg') || '#ffffff';

  return (
    <div className="trace-app">
      {/* 왼쪽 사이드바 */}
      <aside className="sidebar">
        <div className="logo">
          <h2>Trace</h2>
          <p>Design System Lab</p>
        </div>
        <nav className="roadmap">
          {ROADMAP.map((step) => (
            <div
              key={step.id}
              className={`roadmap-item ${currentStep === step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}
              onClick={() => setCurrentStep(step.id)}
            >
              <div className="step-number">{step.id}</div>
              <div className="step-info">
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* 메인 워크스페이스 */}
      <main className="main-workspace">
        <header className="assistant-bar">
          <div className="assistant-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={Robot} alt="Tracer" style={{ width: '45px', height: '45px', objectFit: 'contain' }} />
          </div>
          <div className="assistant-message">
            <strong>도우미: </strong> {stepData.assistant}
          </div>
          <button 
            className="next-btn" 
            onClick={() => {
              // 4번에서 5번 단계로 넘어갈 때 색상 초기화
              if (currentStep === 4) {
                setPrimaryColor('#18a0fb');
                setCanvasBg('#ffffff');
              }
              // navigate를 사용하여 /Homepage로 이동
              if (currentStep === 7) {
                navigate('/Homepage');
              } else if (currentStep < 7) {
                setCurrentStep(currentStep + 1);
              }
            }}
          >
            {currentStep === 7 ? '학습 완료' : '다음 단계로'}
          </button>
        </header>

        <div className="canvas-area">
          <div 
            className="canvas-frame" 
            style={{ 
              backgroundColor: (currentStep === 6 || currentStep === 7) ? savedBg : canvasBg, 
              fontFamily: fontFamily 
            }}
          >
            {/* 1단계: 그리드 */}
            {currentStep === 1 && (
              <div className="grid-layer" style={{ padding: `0 ${gridMargin}px` }}>
                {Array.from({ length: gridColumns }).map((_, i) => (
                  <div key={i} className="grid-col"></div>
                ))}
              </div>
            )}

            {/* 2단계: 여백 */}
            {currentStep === 2 && (
              <div className="spacing-demo" style={{ gap: `${boxGap}px` }}>
                {[1, 2, 3].map(i => (
                  <div key={i} className="demo-box" style={{ padding: `${boxPadding}px` }}>Box {i}</div>
                ))}
              </div>
            )}

            {/* 3단계: 타이포그래피 */}
            {currentStep === 3 && (
              <div className="typo-demo" style={{ color: textColor }}>
                <h1 style={{ fontSize: `${titleSize}px`, marginBottom: '16px' }}>이것은 제목입니다 (Title)</h1>
                <p style={{ fontSize: `${bodySize}px`, lineHeight: 1.6 }}>
                  본문 텍스트입니다. 폰트의 크기와 종류에 따라 가독성이 어떻게 달라지는지 확인해보세요. 
                  우측 패널에서 Serif와 Sans-serif를 교체해볼 수 있습니다.
                </p>
                <span style={{ fontSize: '12px', opacity: 0.6, marginTop: '20px', display: 'block' }}>보조 텍스트 (Caption)</span>
              </div>
            )}

            {/* 4단계: 색상 */}
            {currentStep === 4 && (
              <div className="color-demo">
                <div className="color-card" style={{ backgroundColor: primaryColor, color: '#fff' }}>
                  Main Brand Color
                </div>
                <p style={{ color: textColor, marginTop: '20px' }}>배경과 텍스트의 대비를 확인하세요.</p>
              </div>
            )}

            {/* 5단계: 버튼과 카드 */}
            {currentStep === 5 && (
              <div className="component-demo">
                <div className="preview-card" style={{ 
                  borderRadius: `${borderRadius}px`, 
                  boxShadow: `0 ${elevation}px ${elevation * 2}px rgba(0,0,0,0.1)`,
                  padding: '24px',
                  backgroundColor: '#fff'
                }}>
                  <h3 style={{ marginBottom: '12px', color: textColor }}>Card Component</h3>
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>컴포넌트의 형태를 조절해보세요.</p>
                  <button style={{ 
                    backgroundColor: primaryColor, 
                    color: '#fff', 
                    padding: '10px 20px', 
                    border: 'none', 
                    borderRadius: `${borderRadius / 2}px`,
                    cursor: 'pointer'
                  }}>Button</button>
                </div>
              </div>
            )}

            {/* 6단계: 디자인 시스템 요약 */}
            {currentStep === 6 && (
              <div className="system-summary-spec">
                <h2>Design Tokens</h2>
                <p className="spec-subtitle">내가 정의한 가이드라인 수치 명세표입니다.</p>
                <div className="spec-sheet">
                  <div className="spec-line"><span className="spec-prop">grid-columns:</span> <span className="spec-val">{gridColumns};</span></div>
                  <div className="spec-line"><span className="spec-prop">canvas-margin:</span> <span className="spec-val">{gridMargin}px;</span></div>
                  <div className="spec-line"><span className="spec-prop">element-gap:</span> <span className="spec-val">{boxGap}px;</span></div>
                  <div className="spec-line"><span className="spec-prop">inside-padding:</span> <span className="spec-val">{boxPadding}px;</span></div>
                  <div className="spec-line"><span className="spec-prop">font-family:</span> <span className="spec-val">'{fontFamily}';</span></div>
                  <div className="spec-line"><span className="spec-prop">title-size:</span> <span className="spec-val">{titleSize}px;</span></div>
                  <div className="spec-line"><span className="spec-prop">primary-color:</span> <span className="spec-val">{savedPrimary};</span></div>
                  <div className="spec-line"><span className="spec-prop">background-color:</span> <span className="spec-val">{savedBg};</span></div>
                  <div className="spec-line"><span className="spec-prop">corner-radius:</span> <span className="spec-val">{borderRadius}px;</span></div>
                  <div className="spec-line"><span className="spec-prop">shadow-elevation:</span> <span className="spec-val">{elevation}dp;</span></div>
                </div>
              </div>
            )}

            {/* 7단계: 최종 화면 적용 */}
            {currentStep === 7 && (
              <div className="final-screen" style={{ color: textColor, width: '100%', height: '100%' }}>
                <nav style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ color: savedPrimary }}>TRACE</strong>
                  <div style={{ display: 'flex', gap: '15px', fontSize: '14px' }}><span>Home</span><span>About</span></div>
                </nav>
                <div style={{ padding: `${gridMargin}px`, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: `${boxGap}px` }}>
                  <div style={{ padding: `${boxPadding}px` }}>
                    <h1 style={{ fontSize: `${titleSize}px`, marginBottom: '16px' }}>Connect with Beauty</h1>
                    <p style={{ fontSize: `${bodySize}px`, marginBottom: '24px' }}>네가 만든 시스템으로 완성된 첫 번째 대시보드야.</p>
                    <button style={{ backgroundColor: savedPrimary, padding: '12px 24px', border: 'none', borderRadius: `${borderRadius}px`, color: '#fff' }}>Get Started</button>
                  </div>
                  <img 
                    src={Logo} 
                    alt="Trace Logo"
                    style={{ 
                      borderRadius: `${borderRadius}px`,
                      height: '200px',
                      width: '100%',
                      objectFit: 'cover',
                      boxShadow: `0 ${elevation}px ${elevation * 2}px rgba(0,0,0,0.05)`
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <aside className="properties-panel">
        <div className="panel-header"><h3>Properties</h3></div>
        <div className="panel-content">
          {/* 단계별 프로퍼티 노출 */}
          {(currentStep === 1 || currentStep === 7) && (
            <>
              <div className="prop-group"><label>Grid Columns</label>
                <input type="range" min="1" max="12" value={gridColumns} onChange={e => setGridColumns(Number(e.target.value))} />
              </div>
              <div className="prop-group"><label>Canvas Margin</label>
                <input type="range" min="0" max="60" value={gridMargin} onChange={e => setGridMargin(Number(e.target.value))} />
              </div>
            </>
          )}

          {(currentStep === 2 || currentStep === 7) && (
            <>
              <div className="prop-group"><label>Element Gap</label>
                <input type="range" min="0" max="40" value={boxGap} onChange={e => setBoxGap(Number(e.target.value))} />
              </div>
              <div className="prop-group"><label>Inside Padding</label>
                <input type="range" min="0" max="40" value={boxPadding} onChange={e => setBoxPadding(Number(e.target.value))} />
              </div>
            </>
          )}

          {(currentStep === 3 || currentStep === 7) && (
            <>
              <div className="prop-group"><label>Font Family</label>
                <select value={fontFamily} onChange={e => setFontFamily(e.target.value)}>
                  <option value="Inter">Inter (Sans)</option>
                  <option value="Roboto">Roboto (Sans)</option>
                  <option value="Merriweather">Merriweather (Serif)</option>
                  <option value="Playfair Display">Playfair (Serif)</option>
                </select>
              </div>
              <div className="prop-group"><label>Title Size</label>
                <input type="range" min="20" max="60" value={titleSize} onChange={e => setTitleSize(Number(e.target.value))} />
              </div>
            </>
          )}

          {(currentStep === 4 || currentStep === 7) && (
            <>
              <div className="prop-group"><label>Primary Color</label>
                <input 
                  type="color" 
                  value={currentStep === 7 ? savedPrimary : primaryColor} 
                  onChange={e => {
                    localStorage.setItem('trace_primaryColor', e.target.value);
                    setPrimaryColor(e.target.value);
                  }} 
                />
              </div>
              <div className="prop-group"><label>Background</label>
                <input 
                  type="color" 
                  value={currentStep === 7 ? savedBg : canvasBg} 
                  onChange={e => {
                    localStorage.setItem('trace_canvasBg', e.target.value);
                    setCanvasBg(e.target.value);
                  }} 
                />
              </div>
              {/* 4단계 전용 리셋 버튼 */}
              {currentStep === 4 && (
                <button 
                  className="reset-color-btn"
                  onClick={() => {
                    setPrimaryColor('#18a0fb');
                    setCanvasBg('#ffffff');
                    localStorage.setItem('trace_primaryColor', '#18a0fb');
                    localStorage.setItem('trace_canvasBg', '#ffffff');
                  }}
                >
                  색상 초기화
                </button>
              )}
            </>
          )}

          {(currentStep === 5 || currentStep === 7) && (
            <>
              <div className="prop-group"><label>Corner Radius</label>
                <input type="range" min="0" max="40" value={borderRadius} onChange={e => setBorderRadius(Number(e.target.value))} />
              </div>
              <div className="prop-group"><label>Elevation (Shadow)</label>
                <input type="range" min="0" max="20" value={elevation} onChange={e => setElevation(Number(e.target.value))} />
              </div>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}