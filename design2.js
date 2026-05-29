import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

const styles = {
  root: {
    '--sage': '#a3bca2',
    '--sage-dark': '#90a88f',
    '--black': '#0b0b0b',
  },
  body: {
    backgroundColor: '#0b0b0b',
    color: '#0b0b0b',
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  noiseOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    opacity: 0.12,
    mixBlendMode: 'multiply',
    pointerEvents: 'none',
    zIndex: 999,
  },
  splatters: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 998,
    background: `
      radial-gradient(circle at 15% 25%, #0b0b0b 1px, transparent 1.5px),
      radial-gradient(circle at 85% 75%, #0b0b0b 1.5px, transparent 2px),
      radial-gradient(circle at 50% 10%, #0b0b0b 1px, transparent 1.5px),
      radial-gradient(circle at 20% 80%, #0b0b0b 2px, transparent 2.5px),
      radial-gradient(circle at 70% 30%, #0b0b0b 1px, transparent 2px)
    `,
    backgroundSize: '300px 300px',
    opacity: 0.6,
    mixBlendMode: 'overlay',
  },
  mainframe: {
    display: 'grid',
    width: 'calc(100vw - 20px)',
    height: 'calc(100vh - 20px)',
    gridTemplateColumns: '320px 1fr 280px',
    gridTemplateRows: '55px 1fr 140px',
    gap: '1.5px',
    backgroundColor: '#0b0b0b',
    border: '1.5px solid #0b0b0b',
  },
  pane: {
    backgroundColor: '#a3bca2',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  headerLogo: {
    gridColumn: '1',
    gridRow: '1',
    fontSize: '32px',
    fontWeight: 700,
    letterSpacing: '-0.06em',
    paddingLeft: '15px',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#a3bca2',
  },
  headerMeta: {
    gridColumn: '2',
    gridRow: '1',
    display: 'flex',
    alignItems: 'center',
    fontSize: '11px',
    fontWeight: 500,
    padding: '0 20px',
    letterSpacing: '0.02em',
    backgroundColor: '#a3bca2',
  },
  headerNav: {
    gridColumn: '3',
    gridRow: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 15px',
    fontSize: '12px',
    fontWeight: 500,
    textTransform: 'uppercase',
    backgroundColor: '#a3bca2',
  },
  sidebarLeft: {
    gridColumn: '1',
    gridRow: '2 / 4',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#a3bca2',
  },
  statusPill: {
    display: 'inline-flex',
    alignItems: 'center',
    border: '1px solid #0b0b0b',
    borderRadius: '50px',
    padding: '4px 12px',
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.05em',
    marginBottom: '40px',
    width: 'fit-content',
  },
  statusDot: {
    width: '6px',
    height: '6px',
    backgroundColor: '#0b0b0b',
    borderRadius: '50%',
    marginRight: '8px',
  },
  missionLabel: {
    fontSize: '10px',
    fontWeight: 700,
    textTransform: 'uppercase',
    borderBottom: '1px solid #0b0b0b',
    paddingBottom: '4px',
    marginBottom: '12px',
    display: 'block',
  },
  missionText: {
    fontSize: '14px',
    lineHeight: 1.4,
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '-0.02em',
  },
  sysData: {
    fontFamily: 'monospace',
    fontSize: '10px',
    lineHeight: 1.6,
    opacity: 0.8,
    marginTop: '40px',
  },
  sysDataRow: {
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px dotted rgba(11,11,11,0.3)',
    marginBottom: '4px',
  },
  canvasPane: {
    gridColumn: '2 / 4',
    gridRow: '2',
    position: 'relative',
    backgroundColor: '#a3bca2',
    overflow: 'hidden',
  },
  bgTypography: {
    position: 'absolute',
    top: '20px',
    left: '-10px',
    fontSize: '14vw',
    lineHeight: 0.85,
    fontWeight: 700,
    letterSpacing: '-0.07em',
    color: '#0b0b0b',
    opacity: 0.8,
    mixBlendMode: 'color-burn',
    pointerEvents: 'none',
    zIndex: 1,
    whiteSpace: 'nowrap',
  },
  line2: {
    marginLeft: '10vw',
  },
  line3: {
    marginLeft: '-5vw',
  },
  dateStamp: {
    position: 'absolute',
    bottom: '20px',
    left: '20px',
    fontSize: '6vw',
    fontWeight: 700,
    letterSpacing: '-0.05em',
    zIndex: 1,
    opacity: 0.9,
    color: '#0b0b0b',
  },
  webglContainer: {
    position: 'absolute',
    inset: 0,
    zIndex: 2,
    cursor: 'crosshair',
  },
  regMark: {
    position: 'absolute',
    width: '15px',
    height: '15px',
    zIndex: 3,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 12px',
    borderRadius: '20px',
    cursor: 'pointer',
  },
  circleIcon: {
    width: '24px',
    height: '24px',
    backgroundColor: '#0b0b0b',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleIconLarge: {
    width: '40px',
    height: '40px',
    backgroundColor: '#0b0b0b',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'background-color 0.2s',
  },
};

const RegMark = ({ position }) => {
  const posStyle = {
    ...(position === 'tl' && { top: '15px', left: '15px' }),
    ...(position === 'tr' && { top: '15px', right: '15px' }),
    ...(position === 'bl' && { bottom: '15px', left: '15px' }),
    ...(position === 'br' && { bottom: '15px', right: '15px' }),
  };

  return (
    <div style={{ ...styles.regMark, ...posStyle }}>
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '1px',
        top: '7px',
        left: 0,
        backgroundColor: '#0b0b0b',
      }} />
      <div style={{
        position: 'absolute',
        width: '1px',
        height: '100%',
        top: 0,
        left: '7px',
        backgroundColor: '#0b0b0b',
      }} />
    </div>
  );
};

const ArrowIcon = ({ color = '#fff' }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '12px', height: '12px' }}>
    <path d="M4 12H20M20 12L13 5M20 12L13 19" stroke={color} strokeWidth="2" strokeLinecap="square" />
  </svg>
);

const WebGLCanvas = () => {
  const containerRef = useRef(null);
  const animFrameRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!window.THREE) return;

    const THREE = window.THREE;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 1000);
    camera.position.z = 60;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const dnaGroup = new THREE.Group();

    const numTurns = 4;
    const height = 45;
    const radius = 8;
    const segments = 150;

    const materialLine = new THREE.LineBasicMaterial({
      color: 0x0b0b0b,
      linewidth: 1,
      transparent: true,
      opacity: 0.85,
    });

    const materialDot = new THREE.PointsMaterial({
      color: 0x0b0b0b,
      size: 0.6,
      sizeAttenuation: true,
    });

    const points1 = [];
    const points2 = [];
    const rungPositions = [];

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const angle = t * Math.PI * 2 * numTurns;
      const y = (t - 0.5) * height;

      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;
      points1.push(new THREE.Vector3(x1, y, z1));

      const x2 = Math.cos(angle + Math.PI) * radius;
      const z2 = Math.sin(angle + Math.PI) * radius;
      points2.push(new THREE.Vector3(x2, y, z2));

      if (i % 5 === 0) {
        rungPositions.push(x1, y, z1);
        rungPositions.push(x2, y, z2);
      }
    }

    const geom1 = new THREE.BufferGeometry().setFromPoints(points1);
    const geom2 = new THREE.BufferGeometry().setFromPoints(points2);

    const line1 = new THREE.Line(geom1, materialLine);
    const line2 = new THREE.Line(geom2, materialLine);

    const dots1 = new THREE.Points(geom1, materialDot);
    const dots2 = new THREE.Points(geom2, materialDot);

    const rungsGeom = new THREE.BufferGeometry();
    rungsGeom.setAttribute('position', new THREE.Float32BufferAttribute(rungPositions, 3));
    const rungs = new THREE.LineSegments(rungsGeom, materialLine);

    dnaGroup.add(line1);
    dnaGroup.add(line2);
    dnaGroup.add(dots1);
    dnaGroup.add(dots2);
    dnaGroup.add(rungs);

    dnaGroup.rotation.z = Math.PI / 12;
    scene.add(dnaGroup);

    const particlesGeom = new THREE.BufferGeometry();
    const particleCount = 200;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 80;
    }
    particlesGeom.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({
      size: 0.4,
      color: 0x0b0b0b,
      transparent: true,
      opacity: 0.5,
    });
    const particlesMesh = new THREE.Points(particlesGeom, particlesMat);
    scene.add(particlesMesh);

    const clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      dnaGroup.rotation.y = elapsedTime * 0.15;
      dnaGroup.position.y = Math.sin(elapsedTime * 0.5) * 1.5;
      particlesMesh.rotation.y = elapsedTime * 0.05;
      particlesMesh.rotation.x = elapsedTime * 0.02;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} style={styles.webglContainer} />;
};

const App = () => {
  const [ctaHovered, setCtaHovered] = useState(false);
  const [navHover, setNavHover] = useState(null);
  const [dotVisible, setDotVisible] = useState(true);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotVisible(v => !v);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      * { box-sizing: border-box; margin: 0; padding: 0; cursor: default; }
      ::selection { background: #0b0b0b; color: #a3bca2; }
      body { overflow: hidden; }
      @media (max-width: 1024px) {
        .mainframe-responsive {
          grid-template-columns: 250px 1fr !important;
          grid-template-rows: 50px 1fr 100px !important;
        }
        .header-nav-responsive { display: none !important; }
        .sidebar-left-responsive { grid-row: 2 !important; grid-column: 1 !important; }
        .canvas-pane-responsive { grid-column: 2 !important; grid-row: 2 !important; }
        .cta-pane-responsive { grid-column: 1 / 3 !important; grid-row: 3 !important; }
        .bg-typo-responsive { font-size: 18vw !important; }
        .cta-text-responsive { font-size: 36px !important; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleCtaClick = () => {
    setShowAlert(true);
  };

  return (
    <Router basename="/">
      <div style={styles.body}>
        {/* Noise overlay */}
        <div style={styles.noiseOverlay} />
        {/* Splatters */}
        <div style={styles.splatters} />

        {/* Alert Modal */}
        {showAlert && (
          <div
            onClick={() => setShowAlert(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(11,11,11,0.7)',
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                backgroundColor: '#a3bca2',
                border: '1.5px solid #0b0b0b',
                padding: '40px 50px',
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '20px', textTransform: 'uppercase' }}>
                Access sequence initiated.
              </div>
              <button
                onClick={() => setShowAlert(false)}
                style={{
                  backgroundColor: '#0b0b0b',
                  color: '#a3bca2',
                  border: 'none',
                  padding: '8px 24px',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                DISMISS
              </button>
            </div>
          </div>
        )}

        {/* Mainframe Grid */}
        <div
          className="mainframe-responsive"
          style={styles.mainframe}
        >
          {/* Header Logo */}
          <div style={styles.headerLogo}>S.G.A.</div>

          {/* Header Meta */}
          <div style={styles.headerMeta}>
            SYNTHETIC GENOMIC ASSEMBLY <br /> INITIALIZATION PROTOCOL // PHASE 1
          </div>

          {/* Header Nav */}
          <div className="header-nav-responsive" style={styles.headerNav}>
            <div
              style={{
                ...styles.navItem,
                backgroundColor: navHover === 'archive' ? '#90a88f' : 'transparent',
              }}
              onMouseEnter={() => setNavHover('archive')}
              onMouseLeave={() => setNavHover(null)}
            >
              <div style={styles.circleIcon}>
                <ArrowIcon />
              </div>
              ARCHIVE
            </div>
            <div
              style={{
                ...styles.navItem,
                backgroundColor: navHover === 'system' ? '#90a88f' : 'transparent',
              }}
              onMouseEnter={() => setNavHover('system')}
              onMouseLeave={() => setNavHover(null)}
            >
              <div style={styles.circleIcon}>
                <ArrowIcon />
              </div>
              SYSTEM
            </div>
          </div>

          {/* Sidebar Left */}
          <div className="sidebar-left-responsive" style={styles.sidebarLeft}>
            <div>
              <div style={styles.statusPill}>
                <div style={{
                  ...styles.statusDot,
                  opacity: dotVisible ? 1 : 0,
                  transition: 'opacity 0.3s',
                }} />
                AWAITING INPUT
              </div>

              <div style={{ marginBottom: 'auto' }}>
                <span style={styles.missionLabel}>Ref: Dir-88.4 / Core</span>
                <div style={styles.missionText}>
                  Isolation protocol active. Primary structural analysis initiated. Awaiting manual override clearance to commence sequencing of unidentified biological assets.
                </div>
              </div>
            </div>

            <div style={styles.sysData}>
              {[
                ['LAT', "47°22'41\"N"],
                ['LON', "08°32'25\"E"],
                ['NODE', '094.88.A'],
                ['MEM', 'ALLOCATED'],
                ['CRYPTO', 'SHA-256'],
              ].map(([key, val]) => (
                <div key={key} style={styles.sysDataRow}>
                  <span>{key}</span>
                  <span>{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Canvas Pane */}
          <div className="canvas-pane-responsive" style={styles.canvasPane}>
            <RegMark position="tl" />
            <RegMark position="tr" />
            <RegMark position="bl" />
            <RegMark position="br" />

            <div className="bg-typo-responsive" style={styles.bgTypography}>
              <div>STRUCTURAL</div>
              <div style={styles.line2}>ANALYSIS</div>
              <div style={styles.line3}>PENDING</div>
            </div>

            <div style={styles.dateStamp}>31.08.2024</div>

            <WebGLCanvas />
          </div>

          {/* CTA Pane */}
          <div
            className="cta-pane-responsive"
            onClick={handleCtaClick}
            onMouseEnter={() => setCtaHovered(true)}
            onMouseLeave={() => setCtaHovered(false)}
            style={{
              gridColumn: '2 / 4',
              gridRow: '3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 40px',
              cursor: 'pointer',
              backgroundColor: ctaHovered ? '#0b0b0b' : '#a3bca2',
              transition: 'background-color 0s',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              className="cta-text-responsive"
              style={{
                fontSize: '4vw',
                fontWeight: 700,
                letterSpacing: '-0.05em',
                textTransform: 'uppercase',
                color: ctaHovered ? '#a3bca2' : '#0b0b0b',
              }}
            >
              ENTER LAB
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <div style={{
                ...styles.circleIconLarge,
                backgroundColor: ctaHovered ? '#a3bca2' : '#0b0b0b',
              }}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '16px', height: '16px' }}>
                  <path
                    d="M4 12H20M20 12L13 5M20 12L13 19"
                    stroke={ctaHovered ? '#0b0b0b' : '#fff'}
                    strokeWidth="2"
                    strokeLinecap="square"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;