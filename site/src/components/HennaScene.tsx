import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import { onScrollProgress } from './scrollStore';
import { isDark, onThemeChange } from './themeStore';
import * as THREE from 'three';

/* ── Theme-aware color palette ──────────────────────────── */

type ThemeColors = ReturnType<typeof themeColors>;

function themeColors(dark: boolean) {
  return dark
    ? {
        // Night / indigo palette
        bg: '#0f0c29',
        ambientLight: '#2a2466',
        pointMain: '#6c5ce7',
        pointWarm: '#a29bfe',
        spotLight: '#3d3a7c',
        dirLight: '#e17055',
        formBody: '#a29bfe',
        formEmissive: '#1a1050',
        formAccent: '#fdcb6e',
        formAccentEmissive: '#3a2010',
        ringGold: '#fdcb6e',
        ringHenna: '#a29bfe',
        ringSand: '#636e72',
        particleColor: '#fdcb6e',
        dotColor: '#e17055',
        starsOpacity: 0.8,
        fogColor: '#0f0c29',
      }
    : {
        // Light / original palette
        bg: '#F6EDDD',
        ambientLight: '#F6EDDD',
        pointMain: '#F6EDDD',
        pointWarm: '#C29A4B',
        spotLight: '#DDC9A8',
        dirLight: '#8C2E2A',
        formBody: '#8C2E2A',
        formEmissive: '#2a0a08',
        formAccent: '#C29A4B',
        formAccentEmissive: '#3a2010',
        ringGold: '#C29A4B',
        ringHenna: '#8C2E2A',
        ringSand: '#DDC9A8',
        particleColor: '#C29A4B',
        dotColor: '#8C2E2A',
        starsOpacity: 0.5,
        fogColor: '#F6EDDD',
      };
}

/* ── Floating Mandala Ring ────────────────────────────────── */
function MandalaRing({
  radius = 1.8,
  rotationSpeed = 0.15,
  tilt = [0, 0, 0] as const,
  color = '#C29A4B',
  opacity = 0.55,
  dotColor = '#8C2E2A',
}: {
  radius?: number;
  rotationSpeed?: number;
  tilt?: readonly [number, number, number];
  color?: string;
  opacity?: number;
  dotColor?: string;
}) {
  const ref = useRef<THREE.Group>(null!);

  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const segments = 420;
    const petals = 8;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const petalWave = Math.sin(petals * angle) * 0.25 + 0.75;
      const r = radius * petalWave;
      const detail = Math.sin(petals * 2 * angle + 1.2) * 0.08;
      pts.push(new THREE.Vector3(Math.cos(angle) * (r + detail), Math.sin(angle) * (r + detail), 0));
    }
    return pts;
  }, [radius]);

  const lineGeo = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);
  const ringGeo = useMemo(() => new THREE.TorusGeometry(radius, 0.015, 16, 200), [radius]);

  const [scroll, setScroll] = useState(0);
  useEffect(() => onScrollProgress(setScroll), []);

  useFrame((_, delta) => {
    if (ref.current) {
      const boost = 1 + scroll * 3.5;
      ref.current.rotation.x += delta * rotationSpeed * 0.3 * boost;
      ref.current.rotation.y += delta * rotationSpeed * boost;
      ref.current.rotation.z += delta * rotationSpeed * 0.15 * boost;
    }
  });

  return (
    <group ref={ref} rotation={tilt as unknown as THREE.Euler}>
      <mesh geometry={ringGeo}>
        <meshBasicMaterial color={color} transparent opacity={opacity * 0.5} />
      </mesh>
      <line geometry={lineGeo}>
        <lineBasicMaterial color={color} transparent opacity={opacity} linewidth={1} />
      </line>
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (i / 16) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * radius, Math.sin(a) * radius, 0]}>
            <sphereGeometry args={[0.03, 6, 6]} />
            <meshBasicMaterial color={dotColor} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ── Floating Particle (henna paste dot) ──────────────────── */
function HennaParticle({ startPos, color }: { startPos: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Mesh>(null!);
  const speed = useMemo(() => 0.3 + Math.random() * 0.7, []);
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);
  const radius = useMemo(() => 0.8 + Math.random() * 3.5, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed + offset;
    ref.current.position.x = startPos[0] + Math.cos(t * 0.7) * radius;
    ref.current.position.y = startPos[1] + Math.sin(t * 0.9) * radius * 0.7;
    ref.current.position.z = startPos[2] + Math.sin(t * 0.5) * radius * 0.5;
    ref.current.scale.setScalar(0.6 + Math.sin(t * 1.3) * 0.3);
  });

  return (
    <mesh ref={ref} position={startPos}>
      <sphereGeometry args={[0.025, 6, 6]} />
      <meshBasicMaterial color={color} transparent opacity={0.7} />
    </mesh>
  );
}

/* ── Central Abstract Form (stylized paisley) ─────────────── */
function CentralForm({ colors, dark }: { colors: ThemeColors; dark: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);
  const sparkRefs = useRef<THREE.Mesh[]>([]);

  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 1.4);
    s.bezierCurveTo(0.55, 1.1, 0.7, 0.4, 0.5, -0.15);
    s.bezierCurveTo(0.3, -0.7, -0.3, -1.1, -0.55, -1.35);
    s.bezierCurveTo(-0.15, -1.15, 0.1, -0.8, 0, -0.45);
    s.bezierCurveTo(-0.1, -0.1, -0.45, 0.25, -0.55, 0.55);
    s.bezierCurveTo(-0.65, 0.85, -0.35, 1.15, 0, 1.4);
    return s;
  }, []);

  const extrudeSettings = useMemo(
    () => ({ steps: 1, depth: 0.08, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.02, bevelSegments: 3 }),
    [],
  );

  /* Perimeter path for glow sparks (sampled densely) */
  const perimeterPath = useMemo(() => {
    const pts = shape.getPoints(120);
    return pts.map((p) => new THREE.Vector3(p.x, p.y, 0.06));
  }, [shape]);

  /* Wireframe edges of the extruded form (only visible in dark mode) */
  const edgeGeo = useMemo(() => {
    const extrudeGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    return new THREE.EdgesGeometry(extrudeGeo);
  }, [shape, extrudeSettings]);

  const [scroll, setScroll] = useState(0);
  useEffect(() => onScrollProgress(setScroll), []);

  /* Spark phases — one per spark */
  const sparkCount = 14;
  const sparkPhases = useMemo(
    () => Array.from({ length: sparkCount }, () => Math.random() * Math.PI * 2),
    [],
  );
  const sparkSpeeds = useMemo(
    () => Array.from({ length: sparkCount }, () => 0.3 + Math.random() * 0.5),
    [],
  );

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const scaleBoost = 1 + scroll * 0.35;
      const amplitudeBoost = 1 + scroll * 1.2;
      groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.25) * 0.25 * amplitudeBoost;
      groupRef.current.rotation.z = Math.cos(clock.elapsedTime * 0.2) * 0.1 * amplitudeBoost;
      groupRef.current.position.y = Math.sin(clock.elapsedTime * 0.4) * 0.12 * amplitudeBoost;
      groupRef.current.scale.setScalar(scaleBoost);
    }

    /* Animate glow sparks along the perimeter */
    const pathLen = perimeterPath.length;
    if (dark && pathLen > 0) {
      const t = clock.elapsedTime;
      for (let i = 0; i < sparkCount; i++) {
        const mesh = sparkRefs.current[i];
        if (!mesh) continue;
        const idx = ((t * sparkSpeeds[i] + sparkPhases[i]) % 1) * (pathLen - 1);
        const lo = Math.floor(idx);
        const hi = (lo + 1) % pathLen;
        const frac = idx - lo;
        const a = perimeterPath[lo];
        const b = perimeterPath[hi];
        mesh.position.set(
          a.x + (b.x - a.x) * frac,
          a.y + (b.y - a.y) * frac,
          a.z + Math.sin(t * 3 + i) * 0.04,
        );
        mesh.scale.setScalar(0.7 + Math.sin(t * 4 + sparkPhases[i]) * 0.3);
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main body — higher emissive in dark mode for an ethereal glow */}
      <mesh>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshStandardMaterial
          color={colors.formBody}
          metalness={dark ? 0.15 : 0.3}
          roughness={dark ? 0.35 : 0.45}
          emissive={colors.formEmissive}
          emissiveIntensity={dark ? 0.55 : 0.2}
        />
      </mesh>

      {/* Inner gold accent */}
      <mesh position={[0, 0, 0.09]}>
        <extrudeGeometry args={[shape, { ...extrudeSettings, depth: 0.005 }]} />
        <meshStandardMaterial
          color={colors.formAccent}
          metalness={0.6}
          roughness={0.3}
          emissive={colors.formAccentEmissive}
          emissiveIntensity={dark ? 0.35 : 0.15}
        />
      </mesh>

      {/* Neon wireframe edge — dark mode only */}
      {dark && (
        <lineSegments geometry={edgeGeo}>
          <lineBasicMaterial
            color={colors.formAccent}
            transparent
            opacity={0.55}
            linewidth={1}
          />
        </lineSegments>
      )}

      {/* Glow sparks tracing the perimeter — dark mode only */}
      {dark &&
        Array.from({ length: sparkCount }).map((_, i) => (
          <mesh
            key={`spark-${i}`}
            ref={(el) => {
              if (el) sparkRefs.current[i] = el;
            }}
          >
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshBasicMaterial
              color={i % 3 === 0 ? '#fdcb6e' : '#a29bfe'}
              transparent
              opacity={0.85}
            />
          </mesh>
        ))}
    </group>
  );
}

/* ── Mouse- + scroll-responsive camera ────────────────────── */
function CameraController() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);
  const baseZ = 8;

  useEffect(() => onScrollProgress((v) => { scrollRef.current = v; }), []);

  useFrame(() => {
    target.current.x += (mouse.current.x - target.current.x) * 0.04;
    target.current.y += (mouse.current.y - target.current.y) * 0.04;
    const z = baseZ + scrollRef.current * 3.5;
    camera.position.x = target.current.x * 1.2;
    camera.position.y = target.current.y * 0.8;
    camera.position.z += (z - camera.position.z) * 0.06;
    camera.lookAt(0, 0, 0);
  });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return null;
}

/* ── Scene assembly ──────────────────────────────────────── */
function SceneContent() {
  const [dark, setDark] = useState(() => isDark());
  useEffect(() => onThemeChange(setDark), []);

  const c = useMemo(() => themeColors(dark), [dark]);

  return (
    <>
      <CameraController />

      {/* Lighting — swap intensities and hues */}
      <ambientLight intensity={dark ? 0.4 : 0.5} color={c.ambientLight} />
      <pointLight position={[4, 3, 6]} intensity={dark ? 1.8 : 2.5} color={c.pointMain} />
      <pointLight position={[-3, -1, 3]} intensity={dark ? 1.2 : 1.5} color={c.pointWarm} />
      <spotLight position={[0, 5, 5]} angle={0.5} penumbra={0.6} intensity={dark ? 2 : 3} color={c.spotLight} />
      <directionalLight position={[-2, 2, -1]} intensity={dark ? 0.5 : 0.6} color={c.dirLight} />

      {/* Background fog for atmosphere */}
      <fog attach="fog" args={[c.fogColor, 12, 30]} />

      {/* Stars: denser and brighter in dark mode */}
      <Stars
        radius={20}
        depth={30}
        count={dark ? 350 : 200}
        factor={dark ? 0.0006 : 0.0003}
        saturation={dark ? 0.3 : 0.2}
        fade
        speed={0.3}
      />

      {/* Central form */}
      <Float speed={0.8} rotationIntensity={0.3} floatIntensity={0.4}>
        <CentralForm colors={c} dark={dark} />
      </Float>

      {/* Mandala rings */}
      <MandalaRing
        radius={2.4} tilt={[0.4, 0.2, 0.6]}
        color={c.ringGold} opacity={dark ? 0.55 : 0.5}
        rotationSpeed={0.18} dotColor={c.dotColor}
      />
      <MandalaRing
        radius={2.8} tilt={[-0.6, -0.3, 1.1]}
        color={c.ringHenna} opacity={dark ? 0.4 : 0.35}
        rotationSpeed={-0.12} dotColor={c.dotColor}
      />
      <MandalaRing
        radius={2.0} tilt={[1.0, 0.5, -0.3]}
        color={c.ringGold} opacity={dark ? 0.45 : 0.4}
        rotationSpeed={0.22} dotColor={c.dotColor}
      />
      <MandalaRing
        radius={3.0} tilt={[0.15, 0.8, 0.4]}
        color={c.ringSand} opacity={dark ? 0.3 : 0.25}
        rotationSpeed={0.1} dotColor={c.dotColor}
      />

      {/* Floating henna particles */}
      {Array.from({ length: 60 }).map((_, i) => (
        <HennaParticle
          key={i}
          color={c.particleColor}
          startPos={[
            (Math.random() - 0.5) * 7,
            (Math.random() - 0.5) * 7,
            (Math.random() - 0.5) * 5,
          ]}
        />
      ))}
    </>
  );
}

/* ── Top-level Canvas wrapper ──────────────────────────── */
export default function HennaScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
    >
      <SceneContent />
    </Canvas>
  );
}