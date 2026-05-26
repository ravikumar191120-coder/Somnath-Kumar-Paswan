import { useEffect, useRef } from "react";

interface FloatingParticlesProps {
  intensity?: "gentle" | "medium" | "romantic";
}

export default function FloatingParticles({ intensity = "medium" }: FloatingParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Array<{
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      fadeSpeed: number;
      color: string;
      type: "heart" | "star" | "sparkle";
      rotation: number;
      rotationSpeed: number;
    }> = [];

    // Set canvas dimensions
    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    // Use ResizeObserver for responsive resizing
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.contentRect) {
          // Debounced-like standard frame sizing
          requestAnimationFrame(() => {
            resizeCanvas();
          });
        }
      }
    });

    resizeObserver.observe(container);
    resizeCanvas();

    const getMaxParticles = () => {
      switch (intensity) {
        case "gentle": return 30;
        case "romantic": return 80;
        default: return 50;
      }
    };

    const colors = [
      "rgba(244, 63, 94, 0.61)",  // Rose 500
      "rgba(251, 113, 133, 0.52)", // Rose 400
      "rgba(252, 165, 185, 0.55)", // Rose 300
      "rgba(244, 114, 182, 0.48)", // Pink 400
      "rgba(253, 224, 71, 0.59)",  // Yellow 300 (Stars)
      "rgba(254, 244, 199, 0.65)"  // Amber 100
    ];

    const createParticle = (yPos?: number) => {
      const sizeList = [6, 8, 10, 12, 14];
      const size = sizeList[Math.floor(Math.random() * sizeList.length)];
      const typeRand = Math.random();
      let type: "heart" | "star" | "sparkle" = "sparkle";
      if (typeRand < 0.4) type = "heart";
      else if (typeRand < 0.8) type = "star";

      return {
        x: Math.random() * canvas.width,
        y: yPos !== undefined ? yPos : canvas.height + 20,
        size,
        speedY: -(0.4 + Math.random() * 0.9),
        speedX: (Math.random() - 0.5) * 0.5,
        opacity: 0.1 + Math.random() * 0.8,
        fadeSpeed: 0.001 + Math.random() * 0.003,
        color: colors[Math.floor(Math.random() * colors.length)],
        type,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.015
      };
    };

    // Populate initial particles
    const maxParticles = getMaxParticles();
    for (let i = 0; i < maxParticles; i++) {
      particles.push(createParticle(Math.random() * canvas.height));
    }

    // Interactive mouse trace
    let mouse = { x: -1000, y: -1000, active: false };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;

      // Sparkle on hover
      if (Math.random() < 0.25) {
        particles.push({
          x: mouse.x,
          y: mouse.y,
          size: 6 + Math.random() * 8,
          speedY: -(0.5 + Math.random() * 1.0),
          speedX: (Math.random() - 0.5) * 1.5,
          opacity: 0.9,
          fadeSpeed: 0.01 + Math.random() * 0.01,
          color: colors[Math.floor(Math.random() * colors.length)],
          type: Math.random() > 0.5 ? "heart" : "sparkle",
          rotation: Math.random() * Math.PI,
          rotationSpeed: (Math.random() - 0.5) * 0.05
        });
      }
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    const drawHeart = (ctxObj: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctxObj.beginPath();
      const topScale = size / 2;
      ctxObj.moveTo(x, y + topScale / 4);
      // Beautiful parametric heart curves
      ctxObj.bezierCurveTo(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
      ctxObj.bezierCurveTo(x + size, y + size / 3, x + size / 2, y - size / 2, x, y + topScale / 4);
      ctxObj.closePath();
    };

    const drawStar = (ctxObj: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const stepValue = Math.PI / spikes;

      ctxObj.beginPath();
      ctxObj.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctxObj.lineTo(x, y);
        rot += stepValue;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctxObj.lineTo(x, y);
        rot += stepValue;
      }
      ctxObj.lineTo(cx, cy - outerRadius);
      ctxObj.closePath();
    };

    let animationId: number;
    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Physics & positioning
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotationSpeed;
        p.opacity -= p.fadeSpeed;

        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            // Gentle love repulsion/attraction magnet
            p.x += (dx / dist) * 0.45;
            p.y += (dy / dist) * 0.45;
          }
        }

        // Check bounds or opacity
        if (p.y < -20 || p.opacity <= 0) {
          // Recycle
          particles[i] = createParticle();
          continue;
        }

        // Render particle
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        // Shadow glow for romance atmosphere
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;

        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.type === "heart") {
          drawHeart(ctx, 0, 0, p.size);
          ctx.fill();
        } else if (p.type === "star") {
          drawStar(ctx, 0, 0, 4, p.size / 2, p.size / 4);
          ctx.fill();
        } else {
          // Circle sparkle
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 3, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      // Limit array size safely
      if (particles.length > maxParticles + 40) {
        particles.splice(maxParticles);
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [intensity]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-auto overflow-hidden z-[1]"
      id="floating-particles-container"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        id="floating-particles-canvas"
      />
    </div>
  );
}
