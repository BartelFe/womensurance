import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

function ParticleField() {
  const points = useRef(null);
  const { viewport, mouse } = useThree();
  const [color, setColor] = useState('#f4ede4');

  // Partikelfarbe folgt dem Theme (Farb-Panel)
  useEffect(() => {
    const readVar = () => {
      const v = getComputedStyle(document.documentElement).getPropertyValue('--color-paper').trim();
      if (v) setColor(v);
    };
    readVar();
    const onTheme = (e) => { if (e.detail?.paper) setColor(e.detail.paper); };
    window.addEventListener('wmns-theme', onTheme);
    return () => window.removeEventListener('wmns-theme', onTheme);
  }, []);

  // Generate static particle positions
  const { positions, scales } = useMemo(() => {
    const COUNT = 1400;
    const pos = new Float32Array(COUNT * 3);
    const sc = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 24;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
      sc[i] = Math.random();
    }
    return { positions: pos, scales: sc };
  }, []);

  useFrame(({ clock }) => {
    if (!points.current) return;
    const t = clock.getElapsedTime();
    points.current.rotation.x = mouse.y * 0.05 + t * 0.005;
    points.current.rotation.y = mouse.x * 0.07 + t * 0.008;
    // Subtle drift
    const arr = points.current.geometry.attributes.position.array;
    for (let i = 1; i < arr.length; i += 3) {
      arr[i] += Math.sin(t * 0.3 + i) * 0.0008;
    }
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-scale"
          count={scales.length}
          array={scales}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.012}
        color={color}
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function BackgroundField() {
  return (
    // Rein dekoratives Partikelfeld — trägt keine Information und wird
    // deshalb von assistiven Technologien übersprungen.
    //
    // Das Einblenden läuft als reine CSS-Animation (siehe globals.css). Ein
    // Zustandswechsel per requestAnimationFrame wäre naheliegender, greift aber
    // nicht, solange der Tab im Hintergrund liegt: dort feuert kein Frame, das
    // Feld bliebe auf Deckkraft 0 stehen. Die CSS-Animation startet mit dem
    // Element und holt das beim Sichtbarwerden von selbst nach.
    <div
      className="absolute inset-0 -z-10 pointer-events-none feld-einblenden"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ParticleField />
      </Canvas>
    </div>
  );
}
