import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, PerspectiveCamera, OrbitControls } from '@react-three/drei';

function Box3D() {
  return (
    <mesh position={[0, 0, 0]} rotation={[0.4, 0.4, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#00ffff" wireframe />
    </mesh>
  );
}

function Sphere3D() {
  return (
    <mesh position={[4, 0, -2]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.5} />
    </mesh>
  );
}

function Torus3D() {
  return (
    <mesh position={[-4, 0, -2]} rotation={[0.4, 0, 0]}>
      <torusGeometry args={[1.5, 0.5, 16, 100]} />
      <meshStandardMaterial color="#ec4899" wireframe />
    </mesh>
  );
}

export function Scene3D() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={75} />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate
          autoRotateSpeed={2}
        />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Suspense fallback={null}>
          <Stars count={200} factor={6} fade />
          <Box3D />
          <Sphere3D />
          <Torus3D />
        </Suspense>
      </Canvas>
    </div>
  );
}
