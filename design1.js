import React, { useEffect, useRef } from 'react';

const App = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;800;900&display=swap');

      :root {
        --bg-gray: #d9dadd;
        --ink-dark: #231c18;
        --brand-red: #eb1c24;
        --brand-pink: #f4799a;
        --brand-green: #2a7a40;
        --brand-orange: #f36523;
        --font-display: 'Outfit', sans-serif;
      }

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body, html {
        width: 100%;
        height: 100%;
        overflow: hidden;
        background-color: var(--bg-gray);
        font-family: var(--font-display);
        color: var(--ink-dark);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      .hero-container {
        position: relative;
        width: 100%;
        height: 100vh;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;
      }

      .shape-green-corner {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 50vw;
        height: 60vh;
        background-color: var(--brand-green);
        clip-path: polygon(0 0, 0% 100%, 100% 100%);
        z-index: 1;
      }

      .shape-pink-backdrop {
        position: absolute;
        top: 20%;
        right: 15%;
        width: 45vw;
        height: 70vh;
        background-color: var(--brand-pink);
        clip-path: polygon(20% 0%, 100% 20%, 80% 100%, 0% 80%);
        z-index: 1;
        transform: rotate(-15deg);
      }

      #webgl-canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 5;
        pointer-events: none;
      }

      .ui-layer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10;
        pointer-events: none;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 3rem;
      }

      .header-cluster {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 1.5rem;
        pointer-events: auto;
      }

      .header-logo {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 800;
        font-size: 1.1rem;
        letter-spacing: -0.02em;
        font-family: 'Outfit', sans-serif;
      }

      .header-logo svg {
        width: 24px;
        height: 24px;
      }

      .display-title-group {
        position: absolute;
        top: 3rem;
        left: 3rem;
        pointer-events: auto;
      }

      .display-title {
        font-weight: 900;
        font-size: clamp(6rem, 12vw, 15rem);
        line-height: 0.8;
        letter-spacing: -0.04em;
        text-transform: uppercase;
        position: relative;
        font-family: 'Outfit', sans-serif;
      }

      .title-line {
        display: block;
        position: relative;
      }

      .title-line-1 {
        color: #231c18;
      }

      .title-line-2 {
        color: #231c18;
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .star-icon {
        width: clamp(3rem, 7vw, 8rem);
        height: clamp(3rem, 7vw, 8rem);
        fill: #231c18;
        transform: translateY(-10%);
      }

      .vertical-ticker {
        position: absolute;
        right: 3rem;
        top: 50%;
        transform: translateY(-50%) rotate(90deg);
        transform-origin: center right;
        font-weight: 800;
        font-size: clamp(2rem, 4vw, 4rem);
        letter-spacing: 0.05em;
        color: #231c18;
        white-space: nowrap;
        mix-blend-mode: color-burn;
        opacity: 0.9;
        font-family: 'Outfit', sans-serif;
      }

      .metadata-cluster {
        position: absolute;
        bottom: 3rem;
        left: 3rem;
        pointer-events: auto;
        max-width: 300px;
      }

      .meta-title {
        font-weight: 900;
        font-size: 2.5rem;
        line-height: 1;
        letter-spacing: -0.02em;
        margin-bottom: 1rem;
        color: #231c18;
        font-family: 'Outfit', sans-serif;
      }

      .meta-description {
        font-weight: 500;
        font-size: 1rem;
        line-height: 1.4;
        color: #231c18;
        opacity: 0.8;
        font-family: 'Outfit', sans-serif;
      }

      .meta-description span {
        display: block;
      }

      .decorative-node-1, .decorative-node-2 {
        position: absolute;
        border-radius: 50%;
        background-color: #231c18;
        z-index: 2;
      }

      .decorative-node-1 {
        width: 4vw;
        height: 4vw;
        bottom: 25%;
        left: 45%;
      }

      .decorative-node-2 {
        width: 3vw;
        height: 3vw;
        bottom: 15%;
        left: 65%;
      }

      .decorative-node-3 {
        position: absolute;
        width: 3vw;
        height: 3vw;
        border-radius: 50%;
        background-color: #f36523;
        bottom: 10%;
        left: 48%;
        z-index: 2;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    let animationId;
    let renderer;

    const initThree = async () => {
      try {
        const THREE = await import('https://unpkg.com/three@0.160.0/build/three.module.js');

        const COLORS = {
          ink: 0x231c18,
          red: 0xeb1c24,
          pink: 0xf4799a,
          green: 0x2a7a40,
          orange: 0xf36523
        };

        const HUBS = {
          london: { lat: 51.5074, lon: -0.1278, color: COLORS.red },
          newYork: { lat: 40.7128, lon: -74.0060, color: COLORS.orange },
          singapore: { lat: 1.3521, lon: 103.8198, color: COLORS.red },
          dubai: { lat: 25.2048, lon: 55.2708, color: COLORS.green }
        };

        function getPositionFromLatLon(lat, lon, radius) {
          const phi = (90 - lat) * (Math.PI / 180);
          const theta = (lon + 180) * (Math.PI / 180);
          const x = -(radius * Math.sin(phi) * Math.cos(theta));
          const z = (radius * Math.sin(phi) * Math.sin(theta));
          const y = (radius * Math.cos(phi));
          return new THREE.Vector3(x, y, z);
        }

        const canvas = canvasRef.current;
        if (!canvas) return;

        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 50);

        const globeGroup = new THREE.Group();
        globeGroup.position.set(10, -5, 0);
        scene.add(globeGroup);

        const GLOBE_RADIUS = 15;

        const sphereGeo = new THREE.IcosahedronGeometry(GLOBE_RADIUS, 4);
        const sphereMat = new THREE.MeshBasicMaterial({
          color: COLORS.ink,
          wireframe: true,
          transparent: true,
          opacity: 0.8
        });
        const sphere = new THREE.Mesh(sphereGeo, sphereMat);
        globeGroup.add(sphere);

        const nodeGeo = new THREE.CircleGeometry(0.8, 32);
        const hubMeshes = [];

        Object.keys(HUBS).forEach(key => {
          const hub = HUBS[key];
          const pos = getPositionFromLatLon(hub.lat, hub.lon, GLOBE_RADIUS);
          const nodeMat = new THREE.MeshBasicMaterial({
            color: hub.color,
            side: THREE.DoubleSide,
            depthTest: false
          });
          const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
          nodeMesh.position.copy(pos);
          nodeMesh.lookAt(new THREE.Vector3(0, 0, 0));
          nodeMesh.translateZ(-0.1);
          globeGroup.add(nodeMesh);
          hubMeshes.push(nodeMesh);
        });

        const arcMaterials = [
          new THREE.MeshBasicMaterial({ color: COLORS.red }),
          new THREE.MeshBasicMaterial({ color: COLORS.pink }),
          new THREE.MeshBasicMaterial({ color: COLORS.orange })
        ];

        function createArc(startHub, endHub, material, heightMultiplier = 1.3) {
          const start = getPositionFromLatLon(startHub.lat, startHub.lon, GLOBE_RADIUS);
          const end = getPositionFromLatLon(endHub.lat, endHub.lon, GLOBE_RADIUS);
          const mid = start.clone().lerp(end, 0.5);
          const distance = start.distanceTo(end);
          mid.normalize().multiplyScalar(GLOBE_RADIUS + (distance * 0.3 * heightMultiplier));
          const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
          const tubeGeo = new THREE.TubeGeometry(curve, 40, 0.3, 8, false);
          const tubeMesh = new THREE.Mesh(tubeGeo, material);
          globeGroup.add(tubeMesh);
          return tubeMesh;
        }

        createArc(HUBS.newYork, HUBS.london, arcMaterials[0], 1.2);
        createArc(HUBS.london, HUBS.dubai, arcMaterials[2], 1.4);
        createArc(HUBS.dubai, HUBS.singapore, arcMaterials[1], 1.1);
        createArc(HUBS.singapore, HUBS.london, arcMaterials[0], 1.6);

        function resize() {
          const width = window.innerWidth;
          const height = window.innerHeight;
          renderer.setSize(width, height);
          camera.aspect = width / height;
          if (width < 768) {
            camera.position.z = 70;
            globeGroup.position.set(0, -10, 0);
          } else {
            camera.position.z = 50;
            globeGroup.position.set(12, -5, 0);
          }
          camera.updateProjectionMatrix();
        }

        window.addEventListener('resize', resize);
        resize();

        const clock = new THREE.Clock();

        function animate() {
          animationId = requestAnimationFrame(animate);
          const time = clock.getElapsedTime();
          globeGroup.rotation.x = Math.sin(time * 0.1) * 0.2 + 0.2;
          globeGroup.rotation.y += 0.003;
          hubMeshes.forEach((mesh, index) => {
            const scale = 1 + Math.sin(time * 3 + index) * 0.15;
            mesh.scale.set(scale, scale, 1);
          });
          renderer.render(scene, camera);
        }

        animate();

        return () => {
          window.removeEventListener('resize', resize);
        };
      } catch (err) {
        console.error('Three.js failed to load:', err);
      }
    };

    initThree();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (renderer) renderer.dispose();
    };
  }, []);

  return (
    <div className="hero-container">
      <div className="shape-green-corner"></div>
      <div className="shape-pink-backdrop"></div>

      <div className="decorative-node-1"></div>
      <div className="decorative-node-2"></div>
      <div className="decorative-node-3"></div>

      <canvas id="webgl-canvas" ref={canvasRef}></canvas>

      <div className="ui-layer">
        <div className="header-cluster">
          <div className="header-logo">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" fill="currentColor"></path>
            </svg>
            GLOBAL CAPITAL
          </div>
        </div>

        <div className="display-title-group">
          <h1 className="display-title">
            <span className="title-line title-line-1">PRIVATE</span>
            <span className="title-line title-line-2">
              CREDIT
              <svg className="star-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 0 C50 40, 60 50, 100 50 C60 50, 50 60, 50 100 C50 60, 40 50, 0 50 C40 50, 50 40, 50 0 Z"></path>
              </svg>
            </span>
            <span className="title-line title-line-1">FLOWS</span>
          </h1>
        </div>

        <div className="vertical-ticker">
          LDN - NYC - SGP - DXB • 2024.Q4
        </div>

        <div className="metadata-cluster">
          <div className="meta-title">CROSS<br />BORDER<br />YIELD</div>
          <div className="meta-description">
            <span>Institutional allocations</span>
            <span>Direct lending networks</span>
            <span>Real-time settlement</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;