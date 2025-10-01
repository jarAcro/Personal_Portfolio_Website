// Get the current year element in the footer
const yearEl = document.getElementById("year"); // Select the span that will show the year
yearEl.textContent = new Date().getFullYear(); // Set the span to the current year

// Cache all section elements we want to reveal on scroll
const revealSections = document.querySelectorAll(".reveal"); // NodeList of sections with the 'reveal' class

// Create an IntersectionObserver to trigger fade-in when sections enter the viewport
const observer = new IntersectionObserver( // Construct a new observer instance
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
// Select all navigation links
const navLinks = document.querySelectorAll(".nav-link"); // NodeList of nav anchor elements

// Build a map of section IDs to elements for quick lookup
const sections = Array.from(document.querySelectorAll("main section")); // Array of all major sections in the main element

// Helper function to set the active state on the correct nav link
function setActiveLink(id) { // Accept the target section's id
  navLinks.forEach((link) => { // Loop through all nav links
    const isActive = link.getAttribute("href") === `#${id}`; // Determine if this link points to the current section
    link.classList.toggle("active", isActive); // Toggle the 'active' class based on match
    if (isActive) { // If the link is for the current section
      link.setAttribute("aria-current", "page"); // Mark it as the current page for screen readers
    } else { // Otherwise
      link.removeAttribute("aria-current"); // Ensure aria-current is removed on non-active links
    }
});
}

// Create another IntersectionObserver to update the active nav link as the user scrolls
const sectionObserver = new IntersectionObserver( // Construct the observer
  (entries) => { // Callback for visibility changes
    entries.forEach((entry) => { // Iterate over entries
      if (entry.isIntersecting) { // When a section becomes prominent in the viewport
        const id = entry.target.id; // Get the id of that section
        setActiveLink(id); // Update nav to reflect the current section
    }
    });
  },
  {
    root: null, // Use viewport
    threshold: 0.6, // Consider a section "active" when 60% is visible
  }
);

// Observe each section to track which one is currently in view
sections.forEach((sec) => sectionObserver.observe(sec)); // Attach observer to all sections

// ----- Accessible contact form handling -----
// Select the contact form and status output element
const form = document.getElementById("contact-form"); // Grab the form element by its ID
const statusEl = document.getElementById("form-status"); // Grab the paragraph that announces status

// Attach a submit handler to the form
form.addEventListener("submit", (e) => { // Listen for the submit event
  e.preventDefault(); // Prevent the default page reload submission

  // Collect field values
  const name = form.elements["name"].value.trim(); // Read and trim the 'name' input
  const email = form.elements["email"].value.trim(); // Read and trim the 'email' input
  const message = form.elements["message"].value.trim(); // Read and trim the 'message' textarea

  // Simple validation flags
  let valid = true; // Start with a valid state

  // Validate name
  if (!name) { // If name is empty
    valid = false; // Mark invalid
  }

  // Validate email with a minimal pattern
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic regex to check email structure
  if (!emailPattern.test(email)) { // If email doesn't match the pattern
    valid = false; // Mark invalid
  }

  // Validate message length
  if (!message || message.length < 5) { // Enforce a minimal message length
    valid = false; // Mark invalid
  }

  // If validation fails, inform the user accessibly
  if (!valid) { // If inputs are invalid
    statusEl.textContent = "Please complete all fields with valid information."; // Set the status message
    statusEl.style.color = "#ffb199"; // Give a subtle warm hint color for errors
    return; // Exit the handler early
  }

  // Simulate a successful submission (replace with real endpoint if needed)
  statusEl.textContent = "Thanks! Your message has been sent."; // Show a success message
  statusEl.style.color = "#9be29b"; // Set a greenish color indicating success

  // Reset the form for a better UX
  form.reset(); // Clear all inputs
});