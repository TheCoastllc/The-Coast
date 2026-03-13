'use client';

import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

type DottedSurfaceProps = Omit<React.ComponentProps<'div'>, 'ref'>;

export function DottedSurface({ className, ...props }: DottedSurfaceProps) {
	const { resolvedTheme } = useTheme();
	const containerRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		if (!isMounted || !canvasRef.current || !containerRef.current) return;

		const canvas = canvasRef.current;
		const container = containerRef.current;

		// --- Three.js Setup ---
		const scene = new THREE.Scene();

		const camera = new THREE.PerspectiveCamera(
			75,
			container.offsetWidth / container.offsetHeight || 1,
			0.1,
			5000,
		);
		camera.position.set(0, 450, 900);
		camera.lookAt(0, 0, 0);

		// Use the existing canvas element
		const renderer = new THREE.WebGLRenderer({
			canvas,
			alpha: true,
			antialias: true,
			powerPreference: 'high-performance',
		});
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.setSize(container.offsetWidth, container.offsetHeight);

		// --- Particles ---
		const SEPARATION = 150;
		const AMOUNTX = 40;
		const AMOUNTY = 40;

		const numParticles = AMOUNTX * AMOUNTY;
		const positions = new Float32Array(numParticles * 3);
		const colors = new Float32Array(numParticles * 3);

		// Color based on theme
		const color = new THREE.Color(resolvedTheme === 'dark' ? 0xffffff : 0x000000);

		for (let i = 0, ix = 0; ix < AMOUNTX; ix++) {
			for (let iy = 0; iy < AMOUNTY; iy++) {
				positions[i * 3] = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
				positions[i * 3 + 1] = 0;
				positions[i * 3 + 2] = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;

				colors[i * 3] = color.r;
				colors[i * 3 + 1] = color.g;
				colors[i * 3 + 2] = color.b;
				i++;
			}
		}

		const geometry = new THREE.BufferGeometry();
		geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
		geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

		const material = new THREE.PointsMaterial({
			size: 4,
			vertexColors: true,
			transparent: true,
			opacity: 0.5,
			sizeAttenuation: true,
		});

		const particles = new THREE.Points(geometry, material);
		scene.add(particles);

		// --- Animation ---
		let animationFrameId: number;
		let count = 0;

		const animate = () => {
			animationFrameId = requestAnimationFrame(animate);

			const positions = geometry.attributes.position.array as Float32Array;
			let i = 0;
			for (let ix = 0; ix < AMOUNTX; ix++) {
				for (let iy = 0; iy < AMOUNTY; iy++) {
					positions[i * 3 + 1] = (Math.sin((ix + count) * 0.3) * 50) +
						(Math.sin((iy + count) * 0.5) * 50);
					i++;
				}
			}

			geometry.attributes.position.needsUpdate = true;
			renderer.render(scene, camera);
			count += 0.05;
		};

		// --- Resize Handling ---
		const handleResize = () => {
			if (!container) return;
			const width = container.offsetWidth;
			const height = container.offsetHeight;
			camera.aspect = width / height;
			camera.updateProjectionMatrix();
			renderer.setSize(width, height);
		};

		window.addEventListener('resize', handleResize);
		animate();

		// --- Cleanup ---
		return () => {
			window.removeEventListener('resize', handleResize);
			cancelAnimationFrame(animationFrameId);
			geometry.dispose();
			material.dispose();
			renderer.dispose();
		};
	}, [isMounted, resolvedTheme]);

	if (!isMounted) return <div className={cn('absolute inset-0 -z-1', className)} />;

	return (
		<div
			ref={containerRef}
			className={cn('pointer-events-none absolute inset-0 z-0 overflow-hidden h-full w-full', className)}
			{...props}
		>
			<canvas
				ref={canvasRef}
				style={{ display: 'block', width: '100%', height: '100%' }}
			/>
		</div>
	);
}
