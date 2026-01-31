document.addEventListener('DOMContentLoaded', () => {

    // --- GSAP ANIMATIONS ---
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Hero Section Stagger
        const tl = gsap.timeline();
        tl.from('.gsap-hero-title', {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        })
            .from('.gsap-hero-text', {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out"
            }, "-=0.6")
            .from('.gsap-hero-btns .btn', {
                y: 20,
                opacity: 0,
                duration: 0.6,
                stagger: 0.2,
                ease: "power3.out"
            }, "-=0.4");

        // Scroll Animations for Sections
        gsap.utils.toArray('.animate-on-scroll').forEach(element => {
            gsap.from(element, {
                scrollTrigger: {
                    trigger: element,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out"
            });
        });

    } else {
        console.warn("GSAP not loaded");
    }

    // Navbar Glass Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.background = 'rgba(255, 255, 255, 0.85)';
        }
    });

});
