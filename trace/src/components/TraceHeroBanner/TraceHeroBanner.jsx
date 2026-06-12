import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import './TraceHeroBanner.css'

const SHOW_BLOB_DEBUG = false

const headline = (
  <>
    <span className="trace-hero-banner__title-line trace-hero-banner__title-line--first">
      Follow great
      <br className="trace-hero-banner__mobile-break" /> design traces,
    </span>
    <span className="trace-hero-banner__title-line trace-hero-banner__title-line--second">
      Leave your own.
    </span>
  </>
)

const subtitle = (
  <>
    좋은 UI의 발자취를 따라가며
    <br />
    나만의 디자인 시스템을 만들어보세요.
  </>
)

const createBlobs = (width, height) => {
  const scale = Math.max(0.78, Math.min(width / 1180, 1.16))

  return [
    {
      x: width * 0.72,
      y: height * 0.24,
      radius: 172 * scale,
      vx: -0.92,
      vy: 0.74,
      cursorPolarity: 1,
      cursorStrength: 24,
      cursorOffsetX: 0,
      cursorOffsetY: 0,
    },
    {
      x: width * 0.88,
      y: height * 0.76,
      radius: 126 * scale,
      vx: -1.08,
      vy: -0.78,
      cursorPolarity: -1,
      cursorStrength: 30,
      cursorOffsetX: 0,
      cursorOffsetY: 0,
    },
    {
      x: width * 0.44,
      y: height * 0.6,
      radius: 108 * scale,
      vx: 0.78,
      vy: -0.9,
      cursorPolarity: 1,
      cursorStrength: 18,
      cursorOffsetX: 0,
      cursorOffsetY: 0,
    },
    {
      x: width * 0.61,
      y: height * 0.18,
      radius: 68 * scale,
      vx: 1.12,
      vy: 0.64,
      cursorPolarity: 1,
      cursorStrength: 14,
      cursorOffsetX: 0,
      cursorOffsetY: 0,
    },
  ]
}

function TraceHeroBanner() {
  const bannerRef = useRef(null)
  const svgRef = useRef(null)
  const maskSvgRef = useRef(null)
  const blobsRef = useRef([])
  const frameRef = useRef()
  const sizeRef = useRef({ width: 0, height: 0 })
  const cursorRef = useRef({ active: false, x: 0, y: 0 })
  const particleIdRef = useRef(0)
  const [particles, setParticles] = useState([])
  const maskId = useId().replaceAll(':', '')

  useEffect(() => {
    const banner = bannerRef.current
    const svg = svgRef.current
    const maskSvg = maskSvgRef.current

    if (!banner || !svg || !maskSvg) {
      return undefined
    }

    const visualCircles = Array.from(svg.querySelectorAll('[data-blob-circle]'))
    const debugCircles = Array.from(svg.querySelectorAll('[data-debug-circle]'))
    const maskCircles = Array.from(maskSvg.querySelectorAll('[data-mask-circle]'))

    const syncSvgSize = (width, height) => {
      sizeRef.current = { width, height }
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
      maskSvg.setAttribute('viewBox', `0 0 ${width} ${height}`)
      blobsRef.current = createBlobs(width, height)
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect

      if (width > 0 && height > 0) {
        syncSvgSize(width, height)
      }
    })

    resizeObserver.observe(banner)

    const initialRect = banner.getBoundingClientRect()

    if (initialRect.width > 0 && initialRect.height > 0) {
      syncSvgSize(initialRect.width, initialRect.height)
    }

    const animate = () => {
      const { width, height } = sizeRef.current

      blobsRef.current.forEach((blob, index) => {
        blob.x += blob.vx
        blob.y += blob.vy

        // Collision logic: when a blob reaches a banner edge, clamp it inside
        // the bounds and reverse velocity to create a soft bounce.
        if (blob.x - blob.radius <= 0) {
          blob.x = blob.radius
          blob.vx *= -1
        } else if (blob.x + blob.radius >= width) {
          blob.x = width - blob.radius
          blob.vx *= -1
        }

        if (blob.y - blob.radius <= 0) {
          blob.y = blob.radius
          blob.vy *= -1
        } else if (blob.y + blob.radius >= height) {
          blob.y = height - blob.radius
          blob.vy *= -1
        }

        const cursor = cursorRef.current
        let targetOffsetX = 0
        let targetOffsetY = 0

        if (cursor.active) {
          const distanceX = cursor.x - blob.x
          const distanceY = cursor.y - blob.y
          const distance = Math.max(1, Math.hypot(distanceX, distanceY))
          const influence = Math.max(0, 1 - distance / 520)
          const directionX = distanceX / distance
          const directionY = distanceY / distance
          const pull = blob.cursorPolarity * blob.cursorStrength * influence

          // Cursor reaction is layered on top of the normal x/y/vx/vy bounce.
          // Positive polarity moves toward the cursor; negative polarity moves away.
          targetOffsetX = directionX * pull
          targetOffsetY = directionY * pull
        }

        blob.cursorOffsetX += (targetOffsetX - blob.cursorOffsetX) * 0.08
        blob.cursorOffsetY += (targetOffsetY - blob.cursorOffsetY) * 0.08

        const renderX = blob.x + blob.cursorOffsetX
        const renderY = blob.y + blob.cursorOffsetY
        const visualCircle = visualCircles[index]
        const maskCircle = maskCircles[index]

        if (visualCircle && maskCircle) {
          visualCircle.setAttribute('cx', renderX)
          visualCircle.setAttribute('cy', renderY)
          visualCircle.setAttribute('r', blob.radius)

          // Text mask/overlay logic: the same moving circles that render the
          // visible blobs also reveal the duplicate blue headline above it.
          maskCircle.setAttribute('cx', renderX)
          maskCircle.setAttribute('cy', renderY)
          maskCircle.setAttribute('r', blob.radius * 0.92)
        }

        const debugCircle = debugCircles[index]

        if (debugCircle) {
          debugCircle.setAttribute('cx', renderX)
          debugCircle.setAttribute('cy', renderY)
          debugCircle.setAttribute('r', blob.radius)
        }
      })

      frameRef.current = requestAnimationFrame(animate)
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      resizeObserver.disconnect()
      cancelAnimationFrame(frameRef.current)
    }
  }, [])

  const handlePointerMove = (event) => {
    const banner = bannerRef.current

    if (!banner) {
      return
    }

    const rect = banner.getBoundingClientRect()

    banner.style.setProperty('--cursor-glow-x', `${event.clientX - rect.left}px`)
    banner.style.setProperty('--cursor-glow-y', `${event.clientY - rect.top}px`)
    banner.style.setProperty('--cursor-glow-opacity', '0.18')
    cursorRef.current = {
      active: true,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }

    const magneticButtons = Array.from(
      banner.querySelectorAll(
        '.trace-hero-banner__actions:not(.trace-hero-banner__actions--ghost) .trace-hero-banner__cta',
      ),
    )

    if (magneticButtons.length === 0) {
      return
    }

    const magneticRange = 130
    let closestButton = null
    let closestDistance = Number.POSITIVE_INFINITY
    let closestDistanceX = 0
    let closestDistanceY = 0

    magneticButtons.forEach((button) => {
      const buttonRect = button.getBoundingClientRect()
      const buttonCenterX = buttonRect.left + buttonRect.width / 2
      const buttonCenterY = buttonRect.top + buttonRect.height / 2
      const distanceX = event.clientX - buttonCenterX
      const distanceY = event.clientY - buttonCenterY
      const distance = Math.hypot(distanceX, distanceY)

      button.style.setProperty('--cta-shift-x', '0px')
      button.style.setProperty('--cta-shift-y', '0px')

      if (distance < closestDistance) {
        closestButton = button
        closestDistance = distance
        closestDistanceX = distanceX
        closestDistanceY = distanceY
      }
    })

    if (!closestButton || closestDistance > magneticRange) {
      return
    }

    const pull = 1 - closestDistance / magneticRange
    const maxOffset = 10
    const shiftX = Math.max(-maxOffset, Math.min(maxOffset, closestDistanceX * pull * 0.16))
    const shiftY = Math.max(-maxOffset, Math.min(maxOffset, closestDistanceY * pull * 0.16))

    closestButton.style.setProperty('--cta-shift-x', `${shiftX}px`)
    closestButton.style.setProperty('--cta-shift-y', `${shiftY}px`)
  }

  const handlePointerLeave = () => {
    const banner = bannerRef.current

    banner?.style.setProperty('--cursor-glow-opacity', '0')
    cursorRef.current.active = false
    banner
      ?.querySelectorAll('.trace-hero-banner__actions:not(.trace-hero-banner__actions--ghost) .trace-hero-banner__cta')
      .forEach((button) => {
        button.style.setProperty('--cta-shift-x', '0px')
        button.style.setProperty('--cta-shift-y', '0px')
      })
  }

  const handleHeroClick = (event) => {
    const banner = bannerRef.current

    if (!banner) {
      return
    }

    const rect = banner.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const colors = ['#ffffff', '#e8e5ff', '#352bff']
    const nextParticles = Array.from({ length: 9 }, (_, index) => {
      const angle = (Math.PI * 2 * index) / 9 + Math.random() * 0.35
      const distance = 16 + Math.random() * 22
      const isLine = index % 3 === 0

      return {
        id: particleIdRef.current++,
        x,
        y,
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance,
        color: colors[index % colors.length],
        delay: `${Math.random() * 80}ms`,
        duration: `${680 + Math.random() * 420}ms`,
        size: isLine ? 12 + Math.random() * 6 : 4 + Math.random() * 4,
        rotate: `${angle}rad`,
        type: isLine ? 'line' : 'dot',
      }
    })

    setParticles((currentParticles) => [...currentParticles, ...nextParticles])
  }

  const removeParticle = (particleId) => {
    setParticles((currentParticles) =>
      currentParticles.filter((particle) => particle.id !== particleId),
    )
  }

  return (
    <section
      className="trace-hero-banner"
      ref={bannerRef}
      aria-labelledby="trace-hero-title"
      onClick={handleHeroClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <svg className="trace-hero-banner__motion" ref={svgRef} aria-hidden="true">
        <defs>
          <filter id={`${maskId}-blur`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="24" />
          </filter>
        </defs>

        {/* Blob movement is driven by requestAnimationFrame in the effect above. */}
        <g filter={`url(#${maskId}-blur)`}>
          {[
            'rgba(255,255,255,0.58)',
            'rgba(234,232,255,0.48)',
            'rgba(255,255,255,0.52)',
            'rgba(220,218,255,0.42)',
            'rgba(245,245,255,0.36)',
          ].map((color) => (
            <circle data-blob-circle fill={color} key={color} />
          ))}
        </g>

        {/* Debug mode: set SHOW_BLOB_DEBUG to true to see collision circles. */}
        {SHOW_BLOB_DEBUG && (
          <g className="trace-hero-banner__debug-circles">
            {[0, 1, 2, 3].map((item) => (
              <circle data-debug-circle key={`debug-${item}`} />
            ))}
          </g>
        )}
      </svg>

      <div className="trace-hero-banner__cursor-glow" aria-hidden="true" />

      <div className="trace-hero-banner__particles" aria-hidden="true">
        {particles.map((particle) => (
          <span
            className={`trace-hero-banner__particle trace-hero-banner__particle--${particle.type}`}
            key={particle.id}
            onAnimationEnd={() => removeParticle(particle.id)}
            style={{
              '--particle-x': `${particle.x}px`,
              '--particle-y': `${particle.y}px`,
              '--particle-dx': `${particle.dx}px`,
              '--particle-dy': `${particle.dy}px`,
              '--particle-color': particle.color,
              '--particle-delay': particle.delay,
              '--particle-duration': particle.duration,
              '--particle-size': `${particle.size}px`,
              '--particle-rotate': particle.rotate,
            }}
          />
        ))}
      </div>

      <svg className="trace-hero-banner__text-mask" ref={maskSvgRef} aria-hidden="true">
        <defs>
          <filter id={`${maskId}-mask-blur`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="16" />
          </filter>
          <mask id={`${maskId}-headline-mask`} maskUnits="userSpaceOnUse">
            <rect width="100%" height="100%" fill="black" />
            {[0, 1, 2, 3].map((item) => (
              <circle
                data-mask-circle
                fill="white"
                filter={`url(#${maskId}-mask-blur)`}
                key={`mask-${item}`}
              />
            ))}
          </mask>
        </defs>

        <foreignObject
          className="trace-hero-banner__blue-copy-wrap"
          width="100%"
          height="100%"
          mask={`url(#${maskId}-headline-mask)`}
        >
          <div className="trace-hero-banner__copy" xmlns="http://www.w3.org/1999/xhtml">
            <h1 className="trace-hero-banner__title trace-hero-banner__title--blue">
              {headline}
            </h1>
            <p className="trace-hero-banner__subtitle trace-hero-banner__subtitle--ghost">
              {subtitle}
            </p>
            <div className="trace-hero-banner__actions trace-hero-banner__actions--ghost">
              <Link className="trace-hero-banner__cta trace-hero-banner__cta--primary" to="/learn">
                Start Tracing
              </Link>
              <Link className="trace-hero-banner__cta trace-hero-banner__cta--secondary" to="/gallery">
                View References
              </Link>
            </div>
          </div>
        </foreignObject>
      </svg>

      {/* Noise texture is added with CSS over the whole banner. */}
      <div className="trace-hero-banner__copy">
        <h1 className="trace-hero-banner__title" id="trace-hero-title">
          {headline}
        </h1>
        <p className="trace-hero-banner__subtitle">{subtitle}</p>
        <div className="trace-hero-banner__actions">
          <Link className="trace-hero-banner__cta trace-hero-banner__cta--primary" to="/learn">
            Start Tracing
          </Link>
          <Link className="trace-hero-banner__cta trace-hero-banner__cta--secondary" to="/gallery">
            View References
          </Link>
        </div>
      </div>
    </section>
  )
}

export default TraceHeroBanner
