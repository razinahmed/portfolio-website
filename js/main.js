/* ============================================
   PORTFOLIO WEBSITE - MAIN JAVASCRIPT
   ============================================ */

// ============================================
// 1. THREE.JS 3D BACKGROUND
// ============================================

class ThreeJSBackground {
    constructor() {
        this.canvas = document.getElementById('bg-canvas');
        if (!this.canvas) return;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = [];
        this.geometries = [];

        this.init();
        this.createParticles();
        this.createGeometries();
        this.animate();

        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('resize', () => this.onWindowResize());
    }

    init() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x0f172a, 1000, 3000);

        this.camera = new THREE.PerspectiveCamera(
            75,
            this.canvas.clientWidth / this.canvas.clientHeight,
            0.1,
            1000
        );
        this.camera.position.z = 50;

        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true });
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(0x000000, 0);
    }

    createParticles() {
        const geometry = new THREE.BufferGeometry();
        const count = 300;
        const posArray = new Float32Array(count * 3);

        for (let i = 0; i < count * 3; i += 3) {
            posArray[i] = (Math.random() - 0.5) * 200;
            posArray[i + 1] = (Math.random() - 0.5) * 200;
            posArray[i + 2] = (Math.random() - 0.5) * 200;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const material = new THREE.PointsMaterial({
            size: 0.5,
            color: 0x6366f1,
            sizeAttenuation: true,
            transparent: true,
            opacity: 0.6
        });

        const particlesMesh = new THREE.Points(geometry, material);
        this.scene.add(particlesMesh);
        this.particles.push({
            mesh: particlesMesh,
            rotation: { x: 0, y: 0 }
        });
    }

    createGeometries() {
        // Icosahedron 1
        const geo1 = new THREE.IcosahedronGeometry(5, 4);
        const mat1 = new THREE.MeshPhongMaterial({
            color: 0x6366f1,
            emissive: 0x3b3ec7,
            wireframe: false,
            transparent: true,
            opacity: 0.1
        });
        const mesh1 = new THREE.Mesh(geo1, mat1);
        mesh1.position.set(-30, -20, 0);
        this.scene.add(mesh1);
        this.geometries.push({
            mesh: mesh1,
            rotationSpeed: { x: 0.002, y: 0.003, z: 0.001 }
        });

        // Torus 1
        const geo2 = new THREE.TorusGeometry(15, 5, 16, 100);
        const mat2 = new THREE.MeshPhongMaterial({
            color: 0xa855f7,
            emissive: 0x7c3aed,
            wireframe: false,
            transparent: true,
            opacity: 0.1
        });
        const mesh2 = new THREE.Mesh(geo2, mat2);
        mesh2.position.set(40, 30, -20);
        mesh2.rotation.set(0.5, 0.5, 0.5);
        this.scene.add(mesh2);
        this.geometries.push({
            mesh: mesh2,
            rotationSpeed: { x: 0.001, y: 0.002, z: 0.0015 }
        });

        // Icosahedron 2
        const geo3 = new THREE.IcosahedronGeometry(8, 3);
        const mat3 = new THREE.MeshPhongMaterial({
            color: 0xec4899,
            emissive: 0xdb2777,
            wireframe: false,
            transparent: true,
            opacity: 0.08
        });
        const mesh3 = new THREE.Mesh(geo3, mat3);
        mesh3.position.set(20, -40, 10);
        this.scene.add(mesh3);
        this.geometries.push({
            mesh: mesh3,
            rotationSpeed: { x: 0.0015, y: 0.002, z: 0.0025 }
        });

        // Add lighting
        const light1 = new THREE.PointLight(0x6366f1, 0.5);
        light1.position.set(-50, -50, 50);
        this.scene.add(light1);

        const light2 = new THREE.PointLight(0xa855f7, 0.5);
        light2.position.set(50, 50, -50);
        this.scene.add(light2);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        this.scene.add(ambientLight);
    }

    onMouseMove(event) {
        const x = (event.clientX / window.innerWidth) * 2 - 1;
        const y = -(event.clientY / window.innerHeight) * 2 + 1;

        if (this.geometries.length > 0) {
            this.geometries[0].mesh.rotation.x += y * 0.0005;
            this.geometries[0].mesh.rotation.y += x * 0.0005;
        }
    }

    onWindowResize() {
        if (!this.camera || !this.renderer) return;

        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Rotate particles
        this.particles.forEach(particle => {
            particle.mesh.rotation.x += 0.0001;
            particle.mesh.rotation.y += 0.0002;
        });

        // Rotate geometries
        this.geometries.forEach(geo => {
            geo.mesh.rotation.x += geo.rotationSpeed.x;
            geo.mesh.rotation.y += geo.rotationSpeed.y;
            geo.mesh.rotation.z += geo.rotationSpeed.z;
        });

        this.renderer.render(this.scene, this.camera);
    }
}

// ============================================
// 2. TYPING ANIMATION
// ============================================

class TypingEffect {
    constructor() {
        this.roles = [
            'Full Stack Developer',
            'UI/UX Designer',
            'IT Administrator'
        ];
        this.currentIndex = 0;
        this.currentText = '';
        this.isDeleting = false;
        this.typedElement = document.querySelector('.typed-text');
        this.speed = 100;
        this.deleteSpeed = 50;
        this.pauseTime = 2000;
        this.init();
    }

    init() {
        if (this.typedElement) {
            this.type();
        }
    }

    type() {
        const currentRole = this.roles[this.currentIndex];

        if (!this.isDeleting) {
            this.currentText = currentRole.substring(0, this.currentText.length + 1);

            if (this.currentText === currentRole) {
                this.isDeleting = true;
                setTimeout(() => this.type(), this.pauseTime);
                return;
            }
        } else {
            this.currentText = currentRole.substring(0, this.currentText.length - 1);

            if (this.currentText === '') {
                this.isDeleting = false;
                this.currentIndex = (this.currentIndex + 1) % this.roles.length;
                setTimeout(() => this.type(), 500);
                return;
            }
        }

        this.typedElement.textContent = this.currentText;
        const speed = this.isDeleting ? this.deleteSpeed : this.speed;
        setTimeout(() => this.type(), speed);
    }
}

// ============================================
// 3. ANIMATED COUNTERS
// ============================================

class AnimatedCounter {
    constructor() {
        this.counters = document.querySelectorAll('.counter');
        this.init();
    }

    init() {
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        this.counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        updateCounter();
    }
}

// ============================================
// 4. DARK/LIGHT MODE TOGGLE
// ============================================

class ThemeToggle {
    constructor() {
        this.themeToggle = document.querySelector('.theme-toggle');
        this.htmlElement = document.documentElement;
        this.init();
    }

    init() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        this.setTheme(savedTheme);

        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    setTheme(theme) {
        if (theme === 'light') {
            this.htmlElement.classList.add('light-theme');
        } else {
            this.htmlElement.classList.remove('light-theme');
        }
        localStorage.setItem('theme', theme);
    }

    toggleTheme() {
        const currentTheme = this.htmlElement.classList.contains('light-theme') ? 'light' : 'dark';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
}

// ============================================
// 5. SCROLL ANIMATIONS
// ============================================

class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);

        document.querySelectorAll('.fade-in-element').forEach(element => {
            observer.observe(element);
        });

        const progressBars = document.querySelectorAll('.progress-fill');
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const width = entry.target.style.width;
                    entry.target.style.width = '0';
                    setTimeout(() => {
                        entry.target.style.width = width;
                    }, 100);
                    progressObserver.unobserve(entry.target);
                }
            });
        }, this.observerOptions);

        progressBars.forEach(bar => progressObserver.observe(bar));
    }

    animateElement(element) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }
}

// ============================================
// 6. PARALLAX SCROLLING EFFECT
// ============================================

class ParallaxScroll {
    constructor() {
        this.elements = document.querySelectorAll('[data-parallax]');
        this.init();
    }

    init() {
        if (this.elements.length === 0) return;

        window.addEventListener('scroll', () => this.updateParallax());
    }

    updateParallax() {
        const scrollY = window.pageYOffset;

        this.elements.forEach(element => {
            const speed = element.getAttribute('data-parallax') || 0.5;
            element.style.transform = `translateY(${scrollY * speed}px)`;
        });
    }
}

// ============================================
// 7. MOUSE CURSOR TRAIL/GLOW
// ============================================

class MouseTrail {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'cursor-trail-canvas';
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '99';
        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;

        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.createParticle(e.clientX, e.clientY);
        });

        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });

        this.animate();
    }

    createParticle(x, y) {
        this.particles.push({
            x: x,
            y: y,
            size: Math.random() * 3 + 1,
            opacity: 1,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles = this.particles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.opacity -= 0.02;

            this.ctx.fillStyle = `rgba(99, 102, 241, ${p.opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();

            return p.opacity > 0;
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// 8. SMOOTH SCROLL NAVIGATION
// ============================================

class SmoothScroll {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-link');
        this.navMenu = document.querySelector('.nav-menu');
        this.hamburgerMenu = document.querySelector('.hamburger-menu');
        this.init();
    }

    init() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });

        if (this.hamburgerMenu) {
            this.hamburgerMenu.addEventListener('click', () => this.toggleMenu());
        }

        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        window.addEventListener('scroll', () => this.updateActiveLink());
    }

    handleNavClick(e) {
        e.preventDefault();
        const href = e.target.getAttribute('href');
        const element = document.querySelector(href);

        if (element) {
            const offsetTop = element.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    toggleMenu() {
        this.navMenu.classList.toggle('active');
        this.hamburgerMenu.classList.toggle('active');
    }

    closeMenu() {
        this.navMenu.classList.remove('active');
        this.hamburgerMenu.classList.remove('active');
    }

    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
}

// ============================================
// 9. BACK TO TOP BUTTON
// ============================================

class BackToTop {
    constructor() {
        this.backToTopBtn = document.querySelector('.back-to-top');
        this.init();
    }

    init() {
        if (this.backToTopBtn) {
            window.addEventListener('scroll', () => this.toggleButton());
            this.backToTopBtn.addEventListener('click', () => this.scrollToTop());
        }
    }

    toggleButton() {
        if (window.pageYOffset > 300) {
            this.backToTopBtn.classList.add('show');
        } else {
            this.backToTopBtn.classList.remove('show');
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// ============================================
// 10. PRELOADER
// ============================================

class Preloader {
    constructor() {
        this.preloader = document.getElementById('preloader');
        this.init();
    }

    init() {
        if (this.preloader) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    this.preloader.style.animation = 'fadeOutPreloader 0.6s ease-out forwards';
                }, 1800);
            });
        }
    }
}

// ============================================
// 11. VANILLA TILT INITIALIZATION
// ============================================

class VanillaTiltInit {
    constructor() {
        this.init();
    }

    init() {
        const tiltElements = document.querySelectorAll('[data-tilt]');
        tiltElements.forEach(element => {
            VanillaTilt.init(element, {
                max: 25,
                speed: 400,
                scale: 1.05,
                transition: true
            });
        });
    }
}

// ============================================
// 12. INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new Preloader();
    setTimeout(() => {
        new ThreeJSBackground();
        new TypingEffect();
        new AnimatedCounter();
        new ThemeToggle();
        new ScrollAnimations();
        new SmoothScroll();
        new BackToTop();
        new MouseTrail();
        new ParallaxScroll();
        new VanillaTiltInit();

        // Add initial animation to hero content
        const heroText = document.querySelector('.hero-text');
        if (heroText) {
            heroText.style.opacity = '1';
            heroText.style.transform = 'translateY(0)';
        }
    }, 100);
});

// ============================================
// 13. UTILITY FUNCTIONS
// ============================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============================================
// 14. KEYBOARD NAVIGATION SUPPORT
// ============================================

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const navMenu = document.querySelector('.nav-menu');
        const hamburgerMenu = document.querySelector('.hamburger-menu');
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburgerMenu.classList.remove('active');
        }
    }
});
