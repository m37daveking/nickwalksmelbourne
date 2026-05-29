import React, { useState, useEffect, useRef } from 'react';

const App = () => {
  const canvasRef = useRef(null);
  const viewRef = useRef({ x: 0, y: 0, zoom: 1, minZoom: 0.2, maxZoom: 15 });
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });

  const [lat, setLat] = useState('45.92');
  const [lng, setLng] = useState('-12.04');
  const [zoom, setZoom] = useState('x1.00');
  const [alt, setAlt] = useState('BASE');

  const peaks = [
    { cx: 0, cy: 0, height: 100, radius: 800, complexity: 6 },
    { cx: 1200, cy: -800, height: 80, radius: 600, complexity: 4 },
    { cx: -1500, cy: 1000, height: 120, radius: 1000, complexity: 8 }
  ];

  const textData = {
    broad: "BOUNDARY_ZONE // REGION_ALPHA // ELEVATION_STEADY // ",
    medium: "STRATA_7: SECURE // NO_ANOMALIES_DETECTED // TOPOLOGY_NOMINAL // ",
    tight: "FRAG_882: data_erosion_present // struct_integrity_98% // geo_variance_detected // ",
    micro: "x:33.2 y:91.1 z:04 // sys_err // null_pointer_in_stratum // "
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
      body, html { width: 100%; height: 100%; overflow: hidden; touch-action: none; overscroll-behavior: none; }
      :root {
        --font-display: 'Impact', 'Arial Narrow Bold', sans-serif;
        --font-serif: 'Georgia', 'Times New Roman', serif;
        --font-mono: 'Courier New', 'SFMono-Regular', Consolas, monospace;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    const dpr = window.devicePixelRatio || 1;
    let width = window.innerWidth;
    let height = window.innerHeight;
    const view = viewRef.current;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      if (view.x === 0 && view.y === 0) {
        view.x = width / 2;
        view.y = height / 2;
      }
      render();
    };

    const generatePath = (cx, cy, radius, complexity, phase) => {
      const points = [];
      const segments = 100;
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const noise = Math.sin(angle * complexity + phase) * (radius * 0.1) +
          Math.cos(angle * (complexity * 1.5)) * (radius * 0.05);
        const r = radius + noise;
        points.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
      }
      return points;
    };

    const drawTextAlongPath = (path, text, fontSize) => {
      ctx.font = `${fontSize}px 'Courier New', monospace`;
      ctx.fillStyle = '#e9f0a6';
      ctx.textBaseline = 'middle';

      let totalLength = 0;
      const segmentLengths = [];
      for (let i = 0; i < path.length - 1; i++) {
        const dx = path[i + 1].x - path[i].x;
        const dy = path[i + 1].y - path[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        segmentLengths.push(dist);
        totalLength += dist;
      }

      const charWidthCache = {};
      const getCharWidth = (char) => {
        if (!charWidthCache[char]) charWidthCache[char] = ctx.measureText(char).width;
        return charWidthCache[char];
      };

      const singleStrWidth = ctx.measureText(text).width;
      const repeats = Math.ceil(totalLength / singleStrWidth) + 1;
      const fullText = text.repeat(repeats);

      let pathDist = 0;
      let pathIndex = 0;

      for (let i = 0; i < fullText.length; i++) {
        const char = fullText[i];
        const charW = getCharWidth(char);
        const targetDist = pathDist + charW / 2;
        if (targetDist > totalLength) break;

        let currentSegDist = 0;
        let tempIndex = 0;
        let accumulatedDist = 0;

        while (tempIndex < segmentLengths.length) {
          if (accumulatedDist + segmentLengths[tempIndex] >= targetDist) {
            pathIndex = tempIndex;
            currentSegDist = targetDist - accumulatedDist;
            break;
          }
          accumulatedDist += segmentLengths[tempIndex];
          tempIndex++;
        }

        if (pathIndex >= path.length - 1) break;

        const p0 = path[pathIndex];
        const p1 = path[pathIndex + 1];
        const segmentL = segmentLengths[pathIndex];
        const t = currentSegDist / segmentL;
        const x = p0.x + (p1.x - p0.x) * t;
        const y = p0.y + (p1.y - p0.y) * t;
        const angle = Math.atan2(p1.y - p0.y, p1.x - p0.x);

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.fillText(char, -charW / 2, 0);
        ctx.restore();

        pathDist += charW + 2;
      }
    };

    const render = () => {
      ctx.fillStyle = '#1c1c1c';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(view.x, view.y);
      ctx.scale(view.zoom, view.zoom);

      let baseStep = 100;
      let currentText = textData.broad;
      let fontSize = 12 / view.zoom;

      if (view.zoom > 1.5) { baseStep = 50; currentText = textData.medium; }
      if (view.zoom > 3) { baseStep = 25; currentText = textData.tight; fontSize = 8 / view.zoom; }
      if (view.zoom > 6) { baseStep = 10; currentText = textData.micro; fontSize = 4 / view.zoom; }

      peaks.forEach((peak) => {
        const rings = Math.floor(peak.radius / baseStep);
        for (let r = 1; r <= rings; r++) {
          const currentRadius = r * baseStep;
          const screenX = view.x + peak.cx * view.zoom;
          const screenY = view.y + peak.cy * view.zoom;
          const screenR = currentRadius * view.zoom;
          if (screenX + screenR < 0 || screenX - screenR > width || screenY + screenR < 0 || screenY - screenR > height) continue;

          const path = generatePath(peak.cx, peak.cy, currentRadius, peak.complexity, r * 0.5);
          ctx.globalAlpha = 0.3 + (1 - (r / rings)) * 0.7;

          if (r % 3 === 0 && view.zoom > 1.5) {
            ctx.fillStyle = '#f2ebe5';
            drawTextAlongPath(path, "--- DATALINE_SECURE --- ", fontSize * 0.8);
          } else {
            drawTextAlongPath(path, currentText, fontSize);
          }
        }
      });

      ctx.restore();

      ctx.save();
      ctx.translate(view.x, view.y);
      ctx.scale(view.zoom, view.zoom);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = '#e9f0a6';
      ctx.lineWidth = 1 / view.zoom;
      ctx.beginPath();
      ctx.moveTo(-20, 0); ctx.lineTo(20, 0);
      ctx.moveTo(0, -20); ctx.lineTo(0, 20);
      ctx.stroke();
      ctx.restore();
    };

    const updateHUD = () => {
      const mapCenterX = (width / 2 - view.x) / view.zoom;
      const mapCenterY = (height / 2 - view.y) / view.zoom;
      setLat((mapCenterY * -0.01).toFixed(2));
      setLng((mapCenterX * 0.01).toFixed(2));
      setZoom('x' + view.zoom.toFixed(2));
      if (view.zoom > 5) setAlt('MICRO');
      else if (view.zoom > 2) setAlt('TIGHT');
      else setAlt('BASE');
    };

    const onMouseDown = (e) => {
      isDraggingRef.current = true;
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
      canvas.style.cursor = 'grabbing';
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
      canvas.style.cursor = 'crosshair';
    };

    const onMouseMove = (e) => {
      if (isDraggingRef.current) {
        const dx = e.clientX - lastMouseRef.current.x;
        const dy = e.clientY - lastMouseRef.current.y;
        view.x += dx;
        view.y += dy;
        lastMouseRef.current = { x: e.clientX, y: e.clientY };
        updateHUD();
        requestAnimationFrame(render);
      }
    };

    const onWheel = (e) => {
      e.preventDefault();
      const zoomSensitivity = 0.002;
      const delta = -e.deltaY * zoomSensitivity;
      const newZoom = Math.min(Math.max(view.zoom * Math.exp(delta), view.minZoom), view.maxZoom);
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      view.x = mouseX - (mouseX - view.x) * (newZoom / view.zoom);
      view.y = mouseY - (mouseY - view.y) * (newZoom / view.zoom);
      view.zoom = newZoom;
      updateHUD();
      requestAnimationFrame(render);
    };

    const preventDefault = (e) => e.preventDefault();

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    document.addEventListener('wheel', preventDefault, { passive: false });
    document.addEventListener('touchmove', preventDefault, { passive: false });
    window.addEventListener('resize', resize);

    resize();
    updateHUD();

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('wheel', onWheel);
      document.removeEventListener('wheel', preventDefault);
      document.removeEventListener('touchmove', preventDefault);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const styles = {
    root: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#1c1c1c',
      overflow: 'hidden',
    },
    canvas: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 1,
      cursor: 'crosshair',
    },
    gridOverlay: {
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundImage: 'linear-gradient(rgba(233,240,166,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(233,240,166,0.03) 1px, transparent 1px)',
      backgroundSize: '100px 100px',
      pointerEvents: 'none',
      zIndex: 2,
    },
    reticle: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 40,
      height: 40,
      pointerEvents: 'none',
      zIndex: 3,
    },
    reticleH: {
      position: 'absolute',
      top: '50%',
      left: 0,
      width: '100%',
      height: 1,
      background: '#e9f0a6',
      opacity: 0.5,
    },
    reticleV: {
      position: 'absolute',
      left: '50%',
      top: 0,
      height: '100%',
      width: 1,
      background: '#e9f0a6',
      opacity: 0.5,
    },
    uiLayer: {
      position: 'absolute',
      top: 0, left: 0,
      width: '100%',
      height: '100%',
      zIndex: 10,
      pointerEvents: 'none',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: 24,
    },
    hudTop: {
      display: 'flex',
      gap: 8,
      alignItems: 'flex-start',
    },
    tab: {
      padding: '12px 24px',
      fontFamily: "'Impact', 'Arial Narrow Bold', sans-serif",
      fontSize: '1.5rem',
      textTransform: 'uppercase',
      letterSpacing: '-0.5px',
      color: '#1a1a1a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    tabLabel: {
      fontFamily: "'Courier New', monospace",
      fontSize: '0.6rem',
      letterSpacing: '1px',
      opacity: 0.7,
      marginBottom: 2,
      color: '#1a1a1a',
    },
    tabLat: {
      backgroundColor: '#e9f0a6',
      borderTopLeftRadius: 12,
      borderBottomLeftRadius: 12,
      borderTopRightRadius: 4,
      borderBottomRightRadius: 4,
    },
    tabLng: {
      backgroundColor: '#f2ebe5',
      borderRadius: 4,
    },
    tabAlt: {
      backgroundColor: '#f1d3c5',
      borderRadius: 4,
      borderBottomRightRadius: 12,
      borderTopRightRadius: 4,
    },
    tabZoom: {
      backgroundColor: 'transparent',
      border: '2px solid #e9f0a6',
      color: '#e9f0a6',
      borderRadius: 12,
      borderTopLeftRadius: 4,
      marginLeft: 16,
    },
    tabZoomLabel: {
      fontFamily: "'Courier New', monospace",
      fontSize: '0.6rem',
      letterSpacing: '1px',
      opacity: 0.8,
      marginBottom: 2,
      color: '#e9f0a6',
    },
    tabZoomVal: {
      color: '#e9f0a6',
    },
    pillContainer: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      display: 'flex',
      gap: 120,
      pointerEvents: 'none',
    },
    pill: {
      backgroundColor: '#e9f0a6',
      color: '#1a1a1a',
      fontFamily: "'Courier New', monospace",
      fontSize: '0.75rem',
      fontWeight: 'bold',
      padding: '4px 12px',
      borderRadius: 20,
      border: '2px solid #1c1c1c',
      boxShadow: '0 0 0 2px #e9f0a6',
    },
    pillSecondary: {
      backgroundColor: 'transparent',
      color: '#e9f0a6',
      fontFamily: "'Courier New', monospace",
      fontSize: '0.75rem',
      fontWeight: 'bold',
      padding: '4px 12px',
      borderRadius: 20,
      border: '1px solid #e9f0a6',
      boxShadow: 'none',
    },
    hudBottom: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      width: '100%',
    },
    brandTitle: {
      fontFamily: "'Impact', 'Arial Narrow Bold', sans-serif",
      fontSize: '14vw',
      lineHeight: 0.8,
      color: '#e9f0a6',
      margin: 0,
      letterSpacing: '-2px',
      transform: 'scaleY(1.2)',
      transformOrigin: 'bottom left',
    },
    infoBlock: {
      width: 300,
      textAlign: 'right',
      pointerEvents: 'auto',
    },
    infoHeader: {
      fontFamily: "'Georgia', 'Times New Roman', serif",
      fontSize: '1.8rem',
      color: '#f2ebe5',
      fontStyle: 'italic',
      marginBottom: 12,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 12,
    },
    geoIcon: {
      display: 'inline-block',
      width: 24,
      height: 24,
      backgroundColor: '#e9f0a6',
      clipPath: 'polygon(0 0, 100% 0, 100% 40%, 40% 100%, 0 100%)',
      flexShrink: 0,
    },
    infoText: {
      fontFamily: "'Georgia', 'Times New Roman', serif",
      fontSize: '0.8rem',
      color: 'rgba(242,235,229,0.6)',
      lineHeight: 1.4,
      textAlign: 'right',
    },
  };

  return (
    <div style={styles.root}>
      <canvas ref={canvasRef} style={styles.canvas} />
      <div style={styles.gridOverlay} />
      <div style={styles.reticle}>
        <div style={styles.reticleH} />
        <div style={styles.reticleV} />
      </div>

      <div style={styles.uiLayer}>
        <div style={styles.hudTop}>
          <div style={{ ...styles.tab, ...styles.tabLat }}>
            <span style={styles.tabLabel}>LATITUDE</span>
            <span>{lat}</span>
          </div>
          <div style={{ ...styles.tab, ...styles.tabLng }}>
            <span style={styles.tabLabel}>LONGITUDE</span>
            <span>{lng}</span>
          </div>
          <div style={{ ...styles.tab, ...styles.tabAlt }}>
            <span style={styles.tabLabel}>ELEVATION</span>
            <span>{alt}</span>
          </div>
          <div style={{ ...styles.tab, ...styles.tabZoom }}>
            <span style={styles.tabZoomLabel}>SCALE</span>
            <span style={styles.tabZoomVal}>{zoom}</span>
          </div>
        </div>

        <div style={styles.pillContainer}>
          <div style={styles.pill}>(TOPOLOGY)</div>
          <div style={styles.pillSecondary}>(UNMAPPED)</div>
        </div>

        <div style={styles.hudBottom}>
          <h1 style={styles.brandTitle}>TERRAIN</h1>
          <div style={styles.infoBlock}>
            <div style={styles.infoHeader}>
              We render <br /> loud &amp; clear
              <div style={styles.geoIcon} />
            </div>
            <p style={styles.infoText}>
              Cartographic data represented purely through typographical contours.
              Zoom integration reflows string density to reveal micro-fissures and
              sub-level lore fragments. Data strata dynamically adjust.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;