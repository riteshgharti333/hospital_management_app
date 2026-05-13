import "./LandingPage.css";
import React, { useEffect, useRef } from "react";
import LPNavbar from "../../components/LandingPageComponents/LPNavbar";
import LPBanner from "../../components/LandingPageComponents/LPBanner";
import LPFeature from "../../components/LandingPageComponents/LPFeature";
import LPSystem from "../../components/LandingPageComponents/LPSystem";
import LPModules from "../../components/LandingPageComponents/LPModules";
import LPTech from "../../components/LandingPageComponents/LPTech";
import LPImpact from "../../components/LandingPageComponents/LPImpact";
import LPAction from "../../components/LandingPageComponents/LPAction";
import LPFooter from "../../components/LandingPageComponents/LPFooter";

const LandingPage = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let particles = [];

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Particle class
    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.opacityChange = (Math.random() - 0.5) * 0.003;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around edges
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        // Pulse opacity
        this.opacity += this.opacityChange;
        if (this.opacity > 0.5 || this.opacity < 0.1) {
          this.opacityChange *= -1;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${this.opacity})`;
        ctx.fill();

        // Glow effect
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${this.opacity * 0.3})`;
        ctx.fill();
      }
    }

    // Initialize particles
    const initParticles = () => {
      particles = [];
      const particleCount = Math.min(
        Math.floor((canvas.width * canvas.height) / 15000),
        150,
      );
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };
    initParticles();
    window.addEventListener("resize", initParticles);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connection lines
      particles.forEach((particle, i) => {
        particle.update();
        particle.draw();

        // Connect nearby particles
        particles.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.08 * (1 - distance / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("resize", initParticles);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="landing-page ">
      {/* Particle Canvas Background */}
      <canvas ref={canvasRef} className="particle-canvas" />

      {/* Content */}
      <div className="landing-content flex flex-col gap-20">
        <LPNavbar />

        <section id="home">
          <LPBanner />
        </section>

        <section id="features">
          <LPFeature />
        </section>

        <section id="capabilities">
          <LPSystem />
        </section>

        <section id="modules">
          <LPModules />
        </section>

        <section id="tech">
          <LPTech />
        </section>

        <section id="impact">
          <LPImpact />
        </section>

        <section id="cta">
          <LPAction />
        </section>

        <LPFooter />
      </div>
    </div>
  );
};

export default LandingPage;
