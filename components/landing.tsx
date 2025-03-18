import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

const Landing: React.FC = () => {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;
      
      // Set canvas dimensions
      const resizeCanvas = () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      };
      
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      
      // Animation variables
      let particles: Particle[] = [];
      const particleCount = 150;
      const maxDistance = 150;
      
      // Mouse tracking
      let mouse = {
        x: 0,
        y: 0,
        radius: 150
      };
      
      canvas.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
      });
      
      // Create particles
      const createParticles = () => {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            color: `hsl(${Math.random() * 60 + 210}, 100%, 70%)`,
            baseX: Math.random() * canvas.width,
            baseY: Math.random() * canvas.height,
            density: Math.random() * 30 + 1,
            speedX: Math.random() * 2 - 1,
            speedY: Math.random() * 2 - 1
          });
        }
      };
      
      createParticles();
      window.addEventListener('resize', createParticles);
      
      // Animation function
      let animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw gradient background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#0f2027');
        gradient.addColorStop(0.5, '#203a43');
        gradient.addColorStop(1, '#2c5364');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        particles.forEach(particle => {
          // Calculate distance to mouse
          const dx = mouse.x - particle.x;
          const dy = mouse.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < mouse.radius) {
            // Repel particles from mouse
            const forceX = dx / distance * 15;
            const forceY = dy / distance * 15;
            
            particle.x -= forceX;
            particle.y -= forceY;
          } else {
            // Return particles to original position and add random movement
            if (Math.abs(particle.x - particle.baseX) > 5 || Math.abs(particle.y - particle.baseY) > 5) {
              particle.x += (particle.baseX - particle.x) * 0.02;
              particle.y += (particle.baseY - particle.y) * 0.02;
            } else {
              // Random movement
              particle.x += particle.speedX;
              particle.y += particle.speedY;
              
              // Reverse direction if hitting boundaries
              if (particle.x > canvas.width || particle.x < 0) {
                particle.speedX *= -1;
              }
              if (particle.y > canvas.height || particle.y < 0) {
                particle.speedY *= -1;
              }
            }
          }
          
          // Draw particle
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = particle.color;
          ctx.fill();
        });
        
        // Draw connections
        ctx.lineWidth = 0.5;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < maxDistance) {
              // Draw line with gradient based on distance
              ctx.beginPath();
              ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / maxDistance})`;
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
        
        requestAnimationFrame(animate);
      };
      
      animate();
      
      // Create floating college name effect
      const drawCollegeName = () => {
        const time = Date.now() * 0.001;
        ctx.save();
        ctx.font = 'bold 64px Montserrat, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Create gradient text
        const textGradient = ctx.createLinearGradient(0, canvas.height/2 - 30, 0, canvas.height/2 + 30);
        textGradient.addColorStop(0, '#f5f7fa');
        textGradient.addColorStop(1, '#c3cfe2');
        ctx.fillStyle = textGradient;
        
        // Apply floating effect
        const x = canvas.width / 2;
        const y = canvas.height / 2 + Math.sin(time) * 10;
        
        // Draw text with shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;
        ctx.fillText('RVCE', x, y - 60);
        
        // Draw subtitle
        ctx.font = '28px Montserrat, sans-serif';
        ctx.fillText('Activity Points Portal', x, y);
        ctx.restore();
      };
      
      // Add college name drawing to animation
      const originalAnimate = animate;
      animate = () => {
        originalAnimate();
        drawCollegeName();
      };
      
      // Cleanup function
      return () => {
        window.removeEventListener('resize', resizeCanvas);
        window.removeEventListener('resize', createParticles);
        cancelAnimationFrame(0);
      };
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/land');
  };

  return (
    <div className="landing-container">
      <div className="animation-container">
        <canvas ref={canvasRef} className="animation-canvas"></canvas>
      </div>
      
      <div className="login-container">
        <div className="login-box">
          <div className="logo-wrapper">
            <div className="logo">RVCE</div>
          </div>
          <h1>Activity Points</h1>
          <h2>Login to Dashboard</h2>
          <p>Enter your credentials to access your activity points record</p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                placeholder="user@rvce.edu.in" 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                placeholder="••••••••" 
                required 
              />
            </div>
            
            <button type="submit" className="login-button">
              <span>Login</span>
            </button>
          </form>
          
          <div className="support-text">
            <p>
              Having trouble logging in? Contact <a href="#">RVCE Web Team</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Type for particles
interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  baseX: number;
  baseY: number;
  density: number;
  speedX: number;
  speedY: number;
}

export default Landing;