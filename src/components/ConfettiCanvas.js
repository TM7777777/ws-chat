import React, { useRef, useEffect, useCallback } from 'react';
import useReduxEventBusAction from '../hooks/useReduxEventBusAction';
import { MESSAGE_RECEIVED } from '../store/chat';

const ConfettiCanvas = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const confettiParticles = useRef([]);

  const playConfetti = useCallback((action) => {
    const message = action.payload;
    if (message && message.text && message.text.includes('🎉')) {
      setTimeout(() => {
        createConfetti(message.id);
        animate();
      }, 200);
    }
  }, []);

  useReduxEventBusAction(MESSAGE_RECEIVED, playConfetti);

  const createConfetti = (messageId) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
    let startX = canvas.width / 2;
    let startY = 0;

    if (messageElement) {
      const rect = messageElement.getBoundingClientRect();
      startX = rect.left + rect.width / 2;
      startY = rect.top;
    }

    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7'];
    const particleCount = 150;

    confettiParticles.current = [];

    for (let i = 0; i < particleCount; i++) {
      confettiParticles.current.push({
        x: startX + (Math.random() - 0.5) * 100,
        y: startY,
        vx: (Math.random() - 0.5) * 15,
        vy: Math.random() * -8 - 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 15,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        gravity: 0.4,
        life: 1,
        decay: Math.random() * 0.015 + 0.008,
      });
    }
  };

  const animate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confettiParticles.current = confettiParticles.current.filter((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += particle.gravity;
      particle.rotation += particle.rotationSpeed;
      particle.life -= particle.decay;

      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate((particle.rotation * Math.PI) / 180);
      ctx.globalAlpha = particle.life;
      ctx.fillStyle = particle.color;

      ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);

      ctx.restore();

      return particle.life > 0 && particle.y < canvas.height + 100;
    });

    if (confettiParticles.current.length > 0) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    />
  );
};

export default ConfettiCanvas;
