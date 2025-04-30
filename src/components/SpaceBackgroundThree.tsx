'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface SpaceBackgroundThreeProps {
  starCount?: number;
  showAstronaut?: boolean;
}

export default function SpaceBackgroundThree({
  starCount = 1000,
}: SpaceBackgroundThreeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const starsRef = useRef<THREE.Points | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 20;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });

    const positions = [];
    const opacities = [];
    const sizes = [];

    for (let i = 0; i < starCount; i++) {
      const x = (Math.random() - 0.5) * 100;
      const y = (Math.random() - 0.5) * 100;
      const z = Math.random() * -50;
      positions.push(x, y, z);

      opacities.push(0.2 + Math.random() * 0.8);
      sizes.push(0.1 + Math.random() * 0.5);
    }

    starGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3)
    );
    starGeometry.setAttribute(
      'opacity',
      new THREE.Float32BufferAttribute(opacities, 1)
    );
    starGeometry.setAttribute(
      'size',
      new THREE.Float32BufferAttribute(sizes, 1)
    );

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    starsRef.current = stars;

    const animate = () => {
      requestAnimationFrame(animate);

      if (starsRef.current) {
        starsRef.current.rotation.x += 0.0001;
        starsRef.current.rotation.y += 0.0002;
      }

      if (starsRef.current && mouseRef.current) {
        starsRef.current.rotation.x +=
          (mouseRef.current.y * 0.0001 - starsRef.current.rotation.x) * 0.02;
        starsRef.current.rotation.y +=
          (mouseRef.current.x * 0.0001 - starsRef.current.rotation.y) * 0.02;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current = {
        x: event.clientX - window.innerWidth / 2,
        y: event.clientY - window.innerHeight / 2,
      };
    };

    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current && container) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [starCount]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        background:
          'linear-gradient(to bottom,rgb(1, 1, 8),rgb(1, 1, 15),rgb(2, 2, 26))',
      }}
    />
  );
}
