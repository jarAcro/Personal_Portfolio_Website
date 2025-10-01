// Get the current year element in the footer
const yearEl = document.getElementById("year"); // Select the span that will show the year
if (yearEl) {
  yearEl.textContent = new Date().getFullYear(); // Set the span to the current year
}

// Cache all section elements we want to reveal on scroll
const revealSections = document.querySelectorAll(".reveal"); // NodeList of sections with the 'reveal' class

// Create an IntersectionObserver to trigger fade-in when sections enter the viewport
const observer = new IntersectionObserver(
  (entries) => { // Callback runs whenever observed elements intersect with the viewport
    entries.forEach((entry) => { // Iterate over each intersection entry
      if (entry.isIntersecting) { // Check if the section is visible enough based on the threshold
        entry.target.classList.add("in-view"); // Add 'in-view' to start the CSS transition
        observer.unobserve(entry.target); // Unobserve this section since we only need to animate once
      }
    });
  },
  {
    root: null, // Use the viewport as the root
    rootMargin: "0px", // No extra margin around the root
    threshold: 0.15, // Trigger when 15% of the section is visible
  }
);

// Observe each section for the reveal-on-scroll effect
revealSections.forEach((section) => observer.observe(section)); // Attach the observer to each section

// ----- Active nav link syncing -----
const navLinks = document.querySelectorAll(".nav-link"); // NodeList of nav anchor elements
const sections = Array.from(document.querySelectorAll("main section")); // All major sections in main

function setActiveLink(id) {
  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${id}`;
    link.classList.toggle("active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        setActiveLink(id);
      }
    });
  },
  {
    root: null,
    threshold: 0.6, // Consider a section "active" when 60% is visible
  }
);

sections.forEach((sec) => sectionObserver.observe(sec));

// ----- Resume download handling -----
const downloadBtn = document.getElementById("download-resume");
const resumeStatus = document.getElementById("resume-status");

if (downloadBtn) {
  downloadBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const filePath = downloadBtn.getAttribute("data-file"); 
    if (!filePath) {
      if (resumeStatus) {
        resumeStatus.textContent = "Resume file path is not configured.";
        resumeStatus.style.color = "#ffb199";
      }
      return;
    }

    const a = document.createElement("a");
    a.href = filePath;
    a.download = "Chase-Jarvis-Resume.pdf"; // nice clean filename
    document.body.appendChild(a);
    a.click();
    a.remove();

    if (resumeStatus) {
      resumeStatus.textContent = "Downloading resume…";
      resumeStatus.style.color = "#9be29b";
    }
  });
}