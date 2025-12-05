  document.addEventListener("DOMContentLoaded", (event) => {
            gsap.registerPlugin(ScrollTrigger);

            // Set initial state for robustness (ensures all but section1 are hidden and low z-index)
            gsap.set("#section2, #section3", { autoAlpha: 0, zIndex: 0 });
            gsap.set("#section1", { autoAlpha: 1, zIndex: 10 }); // Section 1 visible and on top

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: "#pinContainer",
                    start: "top top",
                    end: "+=4000", // Makes the scroll area 4000px long, determining speed
                    scrub: 1,      // Smooth scrubbing effect (1 second catchup)
                    pin: true,     // Pins the container so it doesn't move vertically
                    anticipatePin: 1
                }
            });

            // --- ANIMATION SEQUENCE ---

            // ================= PART 1: BUILD (Starts visible due to initial gsap.set) =================
            tl
              // S1 is already visible and on top, start building elements
              .from(".s1-bg", { 
                  scale: 0, 
                  opacity: 0, 
                  duration: 2, 
                  stagger: 0.2, 
                  ease: "elastic.out(1, 0.5)" 
              })
              .from(".s1-line", { 
                  height: 0, 
                  duration: 1.5, 
                  ease: "power3.inOut" 
              }, "<") // Start at same time as previous
              .from(".s1-el", { 
                  y: 100, 
                  opacity: 0, 
                  duration: 1, 
                  stagger: 0.2, 
                  ease: "power2.out" 
              }, "-=1"); // Overlap slightly

            // --- HOLD PART 1 ---
            tl.to({}, { duration: 1 }); // Empty tween to pause for reading

            // ================= PART 1: UNBUILD =================
            // Elements fly OUT (Unbuild)
            tl.to(".s1-el", { 
                y: -100, 
                opacity: 0, 
                stagger: 0.1, 
                duration: 0.5 
            })
            .to(".s1-line", { height: 0, duration: 0.5 }, "<")
            .to(".s1-bg", { scale: 0, opacity: 0, duration: 0.5 }, "<")
            .set("#section1", { autoAlpha: 0, zIndex: 0 }); // SECTION 1: HIDDEN & BACK

            // ================= PART 2: BUILD =================
            tl.set("#section2", { autoAlpha: 1, zIndex: 10 }) // SECTION 2: VISIBLE & TOP
              .from(".s2-card", {
                  // Cards fly in from different directions
                  x: (i) => i % 2 === 0 ? -1000 : 1000, // Even left, Odd right
                  y: (i) => i === 1 ? 1000 : 0,         // Middle card from bottom
                  rotation: (i) => i % 2 === 0 ? -45 : 45,
                  opacity: 0,
                  duration: 2,
                  stagger: 0.2,
                  ease: "power4.out"
              });

            // --- HOLD PART 2 ---
            tl.to({}, { duration: 1 });

            // ================= PART 2: UNBUILD =================
            tl.to(".s2-card", {
                scale: 0,
                rotation: 0,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "back.in(1.7)"
            })
            .set("#section2", { autoAlpha: 0, zIndex: 0 }); // SECTION 2: HIDDEN & BACK

            // ================= PART 3: BUILD =================
            tl.set("#section3", { autoAlpha: 1, zIndex: 10 }) // SECTION 3: VISIBLE & TOP
              .from(".s3-bg", { opacity: 0, duration: 1 })
              .from(".s3-char", {
                  y: -200,
                  opacity: 0,
                  rotateX: 180,
                  stagger: 0.1,
                  duration: 1.5,
                  ease: "bounce.out"
              })
              .from(".s3-word-btm", {
                  scale: 5,
                  opacity: 0,
                  duration: 0.5,
                  ease: "power2.in"
              }, "-=0.5")
              .from(".s3-btn-wrapper", {
                  y: 100,
                  opacity: 0,
                  duration: 0.5
              })
              .from(".s3-icon", {
                  y: 20,
                  opacity: 0,
                  stagger: 0.1
              });
              
            // Progress Bar Logic (External to main timeline to track total progress)
            gsap.to("#progressBar", {
                width: "100%",
                ease: "none",
                scrollTrigger: {
                    trigger: "#pinContainer",
                    start: "top top",
                    end: "+=4000",
                    scrub: 0
                }
            });
            
            // Button restart logic
            document.querySelector("button").addEventListener("click", () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });