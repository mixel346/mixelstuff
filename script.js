// Remove the parallax effect since we're using a static blurred background
document.addEventListener('mousemove', (e) => {
  // Disabled parallax
});

// Animate feature cards on scroll
const observerOptions = {
  threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.feature-card').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(50px)';
  card.style.transition = 'all 0.6s ease-out';
  observer.observe(card);
});

// Add smooth scrolling for navigation
document.querySelectorAll('a[href^="https://"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    window.open(this.getAttribute('href'), '_blank');
  });
});

// Update CTA button link
const ctaButton = document.querySelector('.cta-button');
ctaButton.addEventListener('click', () => {
  ctaButton.style.transform = 'scale(0.95)';
  setTimeout(() => {
    ctaButton.style.transform = 'scale(1)';
    // Removed redirect since it's now "Coming Soon"
  }, 200);
});

// Add floating castle particles in hero section
function createParticle() {
  const hero = document.querySelector('.hero');
  const particle = document.createElement('div');
  particle.className = 'castle-particle';
  
  // Randomize particle properties
  const size = Math.random() * 6 + 4; // 4-10px
  const opacity = Math.random() * 0.3 + 0.1; // 0.1-0.4
  const duration = Math.random() * 8000 + 7000; // 7-15s
  const startX = Math.random() * window.innerWidth;
  
  particle.style.cssText = `
    left: ${startX}px;
    bottom: -20px;
    width: ${size}px;
    height: ${size}px;
    background: rgba(255, 215, 0, ${opacity});
    box-shadow: 0 0 ${size}px rgba(255, 215, 0, ${opacity * 0.5});
  `;
  
  hero.appendChild(particle);
  
  const animation = particle.animate([
    { transform: 'translateY(0) rotate(0deg)', opacity: 0 },
    { transform: 'translateY(-20vh) rotate(120deg)', opacity: opacity * 2 },
    { transform: 'translateY(-100vh) rotate(360deg)', opacity: 0 }
  ], {
    duration: duration,
    easing: 'ease-out'
  });
  
  animation.onfinish = () => {
    particle.remove();
  };
}

// Create particles more frequently for a subtle effect
setInterval(createParticle, 300);

// Create initial batch of particles
for (let i = 0; i < 10; i++) {
  setTimeout(createParticle, Math.random() * 2000);
}

// Add dynamic color shifting to gradients
let hue = 0;
function shiftColors() {
  hue = (hue + 1) % 360;
  document.documentElement.style.setProperty(
    '--primary-gradient',
    `linear-gradient(135deg, 
      hsl(${hue}, 100%, 50%), 
      hsl(${(hue + 60) % 360}, 100%, 50%))`
  );
  requestAnimationFrame(shiftColors);
}
// Uncomment the line below to enable color shifting effect
// requestAnimationFrame(shiftColors);