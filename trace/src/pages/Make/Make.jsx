import { useEffect, useRef, useState } from 'react'
import './Make.css'

const backgrounds = [
  {
    id: 'white',
    label: 'White',
    className: 'make-canvas--white',
  },
  {
    id: 'blue',
    label: 'Blue',
    className: 'make-canvas--blue',
  },
  {
    id: 'purple',
    label: 'Purple',
    className: 'make-canvas--purple',
  },
  {
    id: 'green',
    label: 'Green',
    className: 'make-canvas--green',
  },
  {
    id: 'peach',
    label: 'Peach',
    className: 'make-canvas--peach',
  },
]

const stickerOptions = ['⭐', '❤️', '🌈', '🍀', '✨']

const makeId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`

const createElement = (type, stickerContent) => {
  const base = {
    id: makeId(type),
    type,
    x: 120 + Math.random() * 120,
    y: 110 + Math.random() * 90,
  }

  if (type === 'text') {
    return {
      ...base,
      content: 'My Design',
      color: '#202047',
      fontSize: 26,
    }
  }

  if (type === 'circle') {
    return {
      ...base,
      color: '#8ea7ff',
      size: 96,
    }
  }

  if (type === 'rectangle') {
    return {
      ...base,
      color: '#bda8ff',
      width: 150,
      height: 92,
    }
  }

  return {
    ...base,
    fontSize: 52,
    content: stickerContent || stickerOptions[Math.floor(Math.random() * stickerOptions.length)],
  }
}

function MakePage() {
  const canvasRef = useRef(null)
  const dragRef = useRef(null)
  const resizeRef = useRef(null)
  const [elements, setElements] = useState([])
  const [backgroundIndex, setBackgroundIndex] = useState(0)
  const [selectedId, setSelectedId] = useState(null)
  const [stickerInput, setStickerInput] = useState('✨')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!message) {
      return undefined
    }

    const timer = window.setTimeout(() => setMessage(''), 1800)

    return () => window.clearTimeout(timer)
  }, [message])

  useEffect(() => {
    const handlePointerMove = (event) => {
      if (!canvasRef.current) {
        return
      }

      const canvasRect = canvasRef.current.getBoundingClientRect()

      if (resizeRef.current) {
        const {
          id,
          type,
          startX,
          startY,
          startWidth,
          startHeight,
          startSize,
          startFontSize,
        } = resizeRef.current
        const deltaX = event.clientX - startX
        const deltaY = event.clientY - startY

        setElements((currentElements) =>
          currentElements.map((element) => {
            if (element.id !== id) {
              return element
            }

            if (type === 'rectangle') {
              return {
                ...element,
                width: Math.max(72, Math.min(canvasRect.width - element.x, startWidth + deltaX)),
                height: Math.max(48, Math.min(canvasRect.height - element.y, startHeight + deltaY)),
              }
            }

            if (type === 'circle') {
              const nextSize = Math.max(
                44,
                Math.min(canvasRect.width - element.x, canvasRect.height - element.y, startSize + Math.max(deltaX, deltaY)),
              )

              return {
                ...element,
                size: nextSize,
              }
            }

            return {
              ...element,
              fontSize: Math.max(18, Math.min(96, startFontSize + Math.max(deltaX, deltaY) * 0.45)),
            }
          }),
        )
        return
      }

      if (!dragRef.current) {
        return
      }

      const { id, offsetX, offsetY } = dragRef.current
      const nextX = event.clientX - canvasRect.left - offsetX
      const nextY = event.clientY - canvasRect.top - offsetY

      setElements((currentElements) =>
        currentElements.map((element) =>
          element.id === id
            ? {
                ...element,
                x: Math.max(0, Math.min(canvasRect.width - 48, nextX)),
                y: Math.max(0, Math.min(canvasRect.height - 48, nextY)),
              }
            : element,
        ),
      )
    }

    const handlePointerUp = () => {
      dragRef.current = null
      resizeRef.current = null
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [])

  const addElement = (type) => {
    const nextElement = createElement(type, type === 'sticker' ? stickerInput.trim() : undefined)

    setElements((currentElements) => [...currentElements, nextElement])
    setSelectedId(nextElement.id)
  }

  const startResize = (event, element) => {
    event.stopPropagation()
    event.preventDefault()
    setSelectedId(element.id)

    resizeRef.current = {
      id: element.id,
      type: element.type,
      startX: event.clientX,
      startY: event.clientY,
      startWidth: element.width || element.size || 96,
      startHeight: element.height || element.size || 96,
      startSize: element.size || 96,
      startFontSize: element.fontSize || 52,
    }
  }

  const startDrag = (event, element) => {
    if (!canvasRef.current) {
      return
    }

    const canvasRect = canvasRef.current.getBoundingClientRect()

    dragRef.current = {
      id: element.id,
      offsetX: event.clientX - canvasRect.left - element.x,
      offsetY: event.clientY - canvasRect.top - element.y,
    }

    setSelectedId(element.id)
  }

  const updateText = (id, content) => {
    setElements((currentElements) =>
      currentElements.map((element) => (element.id === id ? { ...element, content } : element)),
    )
  }

  const changeBackground = () => {
    setBackgroundIndex((currentIndex) => (currentIndex + 1) % backgrounds.length)
  }

  const clearCanvas = () => {
    setElements([])
    setSelectedId(null)
    setMessage('캔버스를 비웠어요.')
  }

  const saveDesign = () => {
    const savedDesigns = JSON.parse(localStorage.getItem('myDesigns') || '[]')
    const design = {
      id: makeId('design'),
      createdAt: new Date().toISOString(),
      background: backgrounds[backgroundIndex].id,
      elements,
    }

    localStorage.setItem('myDesigns', JSON.stringify([...savedDesigns, design]))
    setMessage('디자인이 저장되었어요!')
  }

  const activeBackground = backgrounds[backgroundIndex]

  return (
    <main className="make-page">
      <section className="make-hero">
        <div>
          <span className="make-kicker">Personal design studio</span>
          <h1>나만의 디자인 만들기</h1>
          <p>텍스트, 도형, 스티커를 자유롭게 배치하고 나만의 디자인을 저장해보세요.</p>
        </div>
        {message && <div className="make-toast">{message}</div>}
      </section>

      <section className="make-editor" aria-label="나만의 디자인 에디터">
        <div className="make-stage">
          <div className="make-canvasShell">
            <div className="make-canvasHeader">
              <div>
                <strong>Design board</strong>
                <span>{activeBackground.label} background</span>
              </div>
              <div className="make-canvasDots" aria-hidden="true">
                <i />
                <i />
                <i />
              </div>
            </div>

            <div
              className={`make-canvas ${activeBackground.className}`}
              ref={canvasRef}
              onPointerDown={() => setSelectedId(null)}
            >
              <div className="make-canvasGrid" aria-hidden="true" />
              {elements.length === 0 && (
                <div className="make-emptyCanvas">
                  <strong>아직 비어 있어요</strong>
                  <span>오른쪽 도구로 첫 디자인 흔적을 남겨보세요.</span>
                </div>
              )}

              {elements.map((element) => (
                <div
                  className={`make-element make-element--${element.type} ${
                    selectedId === element.id ? 'make-element--selected' : ''
                  }`}
                  key={element.id}
                  onPointerDown={(event) => {
                    event.stopPropagation()
                    startDrag(event, element)
                  }}
                  style={{
                    left: `${element.x}px`,
                    top: `${element.y}px`,
                    '--element-color': element.color,
                    '--element-width': `${element.width || element.size || 96}px`,
                    '--element-height': `${element.height || element.size || 96}px`,
                    '--element-font-size': `${element.fontSize || 52}px`,
                  }}
                >
                  {element.type === 'text' && (
                    <input
                      aria-label="텍스트 편집"
                      value={element.content}
                      onChange={(event) => updateText(element.id, event.target.value)}
                      onPointerDown={(event) => {
                        event.stopPropagation()
                        setSelectedId(element.id)
                      }}
                      style={{ fontSize: `${element.fontSize || 26}px` }}
                    />
                  )}
                  {element.type === 'sticker' && <span>{element.content}</span>}
                  {selectedId === element.id && (
                    <>
                      <button
                        className="make-moveHandle"
                        aria-label="요소 이동"
                        onPointerDown={(event) => {
                          event.stopPropagation()
                          startDrag(event, element)
                        }}
                        type="button"
                      />
                      <button
                        className="make-resizeHandle"
                        aria-label="요소 크기 조절"
                        onPointerDown={(event) => startResize(event, element)}
                        type="button"
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="make-toolbar" aria-label="디자인 도구">
          <div className="make-toolbarHeader">
            <span>Tools</span>
            <strong>쉽고 빠르게 만들기</strong>
          </div>
          <button className="make-toolButton" onClick={() => addElement('text')} type="button">
            <span>Aa</span>
            Add Text
          </button>
          <button className="make-toolButton" onClick={() => addElement('circle')} type="button">
            <span>●</span>
            Add Circle
          </button>
          <button className="make-toolButton" onClick={() => addElement('rectangle')} type="button">
            <span>▭</span>
            Add Rectangle
          </button>
          <button className="make-toolButton" onClick={() => addElement('sticker')} type="button">
            <span>✨</span>
            Add Sticker
          </button>
          <div className="make-emojiPicker" aria-label="스티커 이모지 선택">
            <label htmlFor="make-sticker-input">Sticker Emoji</label>
            <input
              id="make-sticker-input"
              value={stickerInput}
              onChange={(event) => setStickerInput(event.target.value)}
              placeholder="원하는 이모지 입력"
            />
            <div className="make-emojiChips">
              {stickerOptions.map((sticker) => (
                <button
                  className={stickerInput === sticker ? 'active' : ''}
                  key={sticker}
                  onClick={() => setStickerInput(sticker)}
                  type="button"
                >
                  {sticker}
                </button>
              ))}
            </div>
          </div>
          <button className="make-toolButton" onClick={changeBackground} type="button">
            <span>BG</span>
            Change Background
          </button>

          <div className="make-actions">
            <button className="make-clearButton" onClick={clearCanvas} type="button">
              Clear Canvas
            </button>
            <button className="make-saveButton" onClick={saveDesign} type="button">
              Save Design
            </button>
          </div>
        </aside>
      </section>
    </main>
  )
}

export default MakePage
