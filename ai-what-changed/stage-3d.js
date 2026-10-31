/**
 * Clean 3D Depth Atmosphere Stage (Three.js r128)
 * Pure editorial dark space + subtle perspective dot/line plane + soft bokeh dust
 * Synchronized with the 2D/2.5D Virtual Camera (pan & portal-zoom) — zero visual clutter!
 */
(function () {
  const E = window.MGEasing;

  function createSoftDotTexture() {
    const c = document.createElement('canvas');
    c.width = 64;
    c.height = 64;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,255,255,0.95)');
    g.addColorStop(0.35, 'rgba(125,211,252,0.45)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }

  class SpatialStage3D {
    constructor(mountEl) {
      this.mountEl = mountEl;
      this.width = mountEl.clientWidth || 1280;
      this.height = mountEl.clientHeight || 720;

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x060911);
      this.scene.fog = new THREE.FogExp2(0x060911, 0.035);

      this.camera = new THREE.PerspectiveCamera(46, this.width / this.height, 0.1, 120);
      this.camera.position.set(0, 0, 14);

      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: true
      });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.setSize(this.width, this.height);
      mountEl.innerHTML = '';
      mountEl.appendChild(this.renderer.domElement);

      this._setupSubtleGrid();
      this._setupAmbientParticles();
    }

    _setupSubtleGrid() {
      // Very subtle architectural background grid plane at z = -6
      const cols = 32;
      const rows = 20;
      const step = 1.4;
      const w = cols * step;
      const h = rows * step;
      const pos = [];

      for (let i = 0; i <= cols; i++) {
        const x = -w / 2 + i * step;
        pos.push(x, -h / 2, -6, x, h / 2, -6);
      }
      for (let j = 0; j <= rows; j++) {
        const y = -h / 2 + j * step;
        pos.push(-w / 2, y, -6, w / 2, y, -6);
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pos), 3));
      this.gridMat = new THREE.LineBasicMaterial({
        color: 0x1e3a5f,
        transparent: true,
        opacity: 0.16,
        blending: THREE.AdditiveBlending
      });
      this.gridMesh = new THREE.LineSegments(geo, this.gridMat);
      this.scene.add(this.gridMesh);
    }

    _setupAmbientParticles() {
      const count = 420;
      const pos = new Float32Array(count * 3);
      const col = new Float32Array(count * 3);
      this.seeds = new Float32Array(count * 4);

      for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * 28;
        const y = (Math.random() - 0.5) * 16;
        const z = -5 + Math.random() * 14;
        pos[i * 3] = x;
        pos[i * 3 + 1] = y;
        pos[i * 3 + 2] = z;

        this.seeds[i * 4] = x;
        this.seeds[i * 4 + 1] = y;
        this.seeds[i * 4 + 2] = z;
        this.seeds[i * 4 + 3] = Math.random();

        if (i % 3 === 0) {
          col[i * 3] = 0.15; col[i * 3 + 1] = 0.82; col[i * 3 + 2] = 1.0;
        } else if (i % 3 === 1) {
          col[i * 3] = 0.35; col[i * 3 + 1] = 0.52; col[i * 3 + 2] = 0.98;
        } else {
          col[i * 3] = 0.65; col[i * 3 + 1] = 0.85; col[i * 3 + 2] = 1.0;
        }
      }

      const geo = new THREE.BufferGeometry();
      this.pPosAttr = new THREE.BufferAttribute(pos, 3);
      geo.setAttribute('position', this.pPosAttr);
      geo.setAttribute('color', new THREE.BufferAttribute(col, 3));

      this.pMat = new THREE.PointsMaterial({
        size: 0.18,
        map: createSoftDotTexture(),
        vertexColors: true,
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });

      this.points = new THREE.Points(geo, this.pMat);
      this.scene.add(this.points);
    }

    resize(w, h) {
      this.width = Math.max(1, w);
      this.height = Math.max(1, h);
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
    }

    updateS01(t) {
      // Camera gently breathes during typing (0-1.95s), pulls out slightly on burst (1.95-3.95s),
      // then dives smoothly into the Left Design Card portal (3.95-5.40s)!
      const burstP = E.snappyOut(E.clamp((t - 1.92) / 0.75));
      const portalP = E.cinematicInOut(E.clamp((t - 3.95) / 1.25));

      const camX = E.lerp(0, -3.4, portalP) + Math.sin(t * 0.9) * 0.08 * (1 - portalP);
      const camY = E.lerp(0, 0.35, portalP) + Math.cos(t * 0.7) * 0.06 * (1 - portalP);
      const camZ = E.lerp(14.2, 13.0, burstP) - portalP * 7.8;

      this.camera.position.set(camX, camY, camZ);
      this.camera.lookAt(camX * 0.92, camY * 0.92, 0);
      this.camera.updateMatrixWorld();

      this.gridMat.opacity = 0.11 + burstP * 0.10;
      this.pMat.opacity = 0.30 + burstP * 0.28;

      const arr = this.pPosAttr.array;
      const s = this.seeds;
      const count = s.length / 4;
      for (let i = 0; i < count; i++) {
        const bx = s[i * 4];
        const by = s[i * 4 + 1];
        const bz = s[i * 4 + 2];
        const rnd = s[i * 4 + 3];

        // Subtle radial push when Send button triggers burst at t = 1.92s
        const push = 1 + burstP * 0.22;
        arr[i * 3] = bx * push + Math.sin(t * 0.55 + rnd * 9) * 0.22;
        arr[i * 3 + 1] = by * push + Math.cos(t * 0.48 + rnd * 7) * 0.22;
        arr[i * 3 + 2] = bz;
      }
      this.pPosAttr.needsUpdate = true;

      this.renderer.render(this.scene, this.camera);
    }
  }

  window.SpatialStage3D = SpatialStage3D;
})();
