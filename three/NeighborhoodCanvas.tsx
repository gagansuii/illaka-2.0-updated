'use client';

import { useEffect, useRef, type MutableRefObject } from 'react';
import * as THREE from 'three';

const CAMERA_TARGET = new THREE.Vector3(0, 0.3, 0);

const NODE_DATA = [
  { position: [-2.8, 0.18, -1.2] as const, color: '#f7a14f' },
  { position: [-1.4, 0.18, 2.1] as const, color: '#58d1c5' },
  { position: [-0.2, 0.18, -2.2] as const, color: '#f29b72' },
  { position: [1.2, 0.18, 1.6] as const, color: '#d58b6b' },
  { position: [2.6, 0.18, -0.5] as const, color: '#8ac6bc' },
  { position: [3.1, 0.18, 2.4] as const, color: '#f7a14f' }
];

export function NeighborhoodCanvas({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog('#f3ecdf', 7, 18);

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 40);
    camera.position.set(0, 5.8, 8.4);
    camera.lookAt(CAMERA_TARGET);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const resize = () => {
      const width = container.clientWidth || 1;
      const height = container.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    resize();

    const root = new THREE.Group();
    scene.add(root);

    scene.add(new THREE.AmbientLight('#fff4e0', 1.25));

    const sunLight = new THREE.DirectionalLight('#fef2d8', 2.2);
    sunLight.position.set(8, 10, 6);
    scene.add(sunLight);

    const tealLight = new THREE.PointLight('#58d1c5', 16, 18, 2);
    tealLight.position.set(0, 3, 0);
    scene.add(tealLight);

    const emberLight = new THREE.PointLight('#f7a14f', 14, 16, 2);
    emberLight.position.set(-4, 2, -2);
    scene.add(emberLight);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(16, 16),
      new THREE.MeshStandardMaterial({ color: '#d9cab8', metalness: 0.05, roughness: 0.92 })
    );
    ground.rotation.x = -Math.PI / 2;
    root.add(ground);

    const grid = new THREE.GridHelper(15.5, 18, '#d6c5b3', '#d6c5b3');
    const gridMaterial = grid.material as THREE.Material;
    gridMaterial.transparent = true;
    gridMaterial.opacity = 0.16;
    grid.position.y = 0.01;
    root.add(grid);

    const blockGeometry = new THREE.BoxGeometry(0.78, 1, 0.78);
    const blockMaterial = new THREE.MeshStandardMaterial({
      color: '#f6efe7',
      roughness: 0.88,
      metalness: 0.06
    });
    const blocks = new THREE.InstancedMesh(blockGeometry, blockMaterial, 81);
    const dummy = new THREE.Object3D();
    let instance = 0;

    for (let x = -4; x <= 4; x += 1) {
      for (let z = -4; z <= 4; z += 1) {
        const distance = Math.abs(x) + Math.abs(z);
        const height = 0.2 + ((x * x + z * 3 + 11) % 4) * 0.12 + distance * 0.015;
        dummy.position.set(x * 1.05, height / 2 - 0.18, z * 1.05);
        dummy.scale.set(1, height, 1);
        dummy.updateMatrix();
        blocks.setMatrixAt(instance, dummy.matrix);
        instance += 1;
      }
    }

    root.add(blocks);

    const nodeGeometry = new THREE.SphereGeometry(0.14, 18, 18);
    const haloGeometry = new THREE.RingGeometry(0.18, 0.42, 32);
    const nodes = NODE_DATA.map((node, index) => {
      const group = new THREE.Group();
      group.position.set(node.position[0], node.position[1], node.position[2]);

      const sphere = new THREE.Mesh(
        nodeGeometry,
        new THREE.MeshStandardMaterial({
          color: node.color,
          emissive: node.color,
          emissiveIntensity: 1.8,
          metalness: 0.16,
          roughness: 0.2
        })
      );

      const haloMaterial = new THREE.MeshBasicMaterial({
        color: node.color,
        transparent: true,
        opacity: 0.18,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      const halo = new THREE.Mesh(haloGeometry, haloMaterial);
      halo.rotation.x = -Math.PI / 2;

      group.add(halo);
      group.add(sphere);
      root.add(group);

      return { group, haloMaterial, index };
    });

    const particleCount = 120;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 16;
      particlePositions[i * 3 + 1] = Math.random() * 4.5 + 0.5;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: '#f7d7ba',
      size: 0.07,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    const clock = new THREE.Clock();
    let frameId = 0;
    let timeoutId = 0;
    let tabVisible = typeof document === 'undefined' ? true : document.visibilityState === 'visible';

    const animate = () => {
      if (!tabVisible) {
        timeoutId = window.setTimeout(() => {
          frameId = window.requestAnimationFrame(animate);
        }, 400);
        return;
      }

      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.elapsedTime;
      const progress = progressRef.current;

      root.rotation.x = THREE.MathUtils.lerp(root.rotation.x, -0.88 + progress * 0.18, 1 - Math.exp(-delta * 4));
      root.rotation.z = THREE.MathUtils.lerp(root.rotation.z, -0.08 + progress * 0.06, 1 - Math.exp(-delta * 4));
      root.rotation.y = THREE.MathUtils.lerp(root.rotation.y, -0.22 + progress * 0.38, 1 - Math.exp(-delta * 4));

      camera.position.x = THREE.MathUtils.lerp(camera.position.x, -2.4 + progress * 4.6, 1 - Math.exp(-delta * 3));
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, 5.8 - progress * 1.2, 1 - Math.exp(-delta * 3));
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, 8.4 - progress * 2.1, 1 - Math.exp(-delta * 3));
      camera.lookAt(CAMERA_TARGET);

      nodes.forEach((node) => {
        const pulse = 1 + Math.sin(elapsed * 1.8 + node.index) * 0.12;
        node.group.scale.setScalar(pulse);
        node.haloMaterial.opacity = 0.1 + ((Math.sin(elapsed * 1.25 + node.index) + 1) / 2) * 0.14;
      });

      particles.rotation.y += delta * 0.03;
      particles.position.y = Math.sin(elapsed * 0.35) * 0.08;

      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };

    const handleResize = () => resize();
    const handleVisibility = () => {
      tabVisible = document.visibilityState === 'visible';
      if (tabVisible) {
        clock.getDelta();
      }
    };
    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibility);
    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);

      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if ('geometry' in mesh && mesh.geometry) {
          mesh.geometry.dispose();
        }
        if ('material' in mesh && mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((material) => material.dispose());
          } else {
            mesh.material.dispose();
          }
        }
      });

      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [progressRef]);

  return <div ref={containerRef} className="h-full w-full" aria-hidden="true" />;
}
