// ===== Init AOS Animations =====
AOS.init();

// ===== Particles.js Background =====
particlesJS("particles-js", {
  particles: {
    number: { value: 80, density: { enable: true, value_area: 800 } },
    color: { value: "#0066ff" },
    shape: { type: "circle" },
    opacity: { value: 0.5, random: true },
    size: { value: 3, random: true },
    line_linked: { enable: true, distance: 150, color: "#0066ff", opacity: 0.4, width: 1 },
    move: { enable: true, speed: 2 }
  },
  interactivity: {
    events: {
      onhover: { enable: true, mode: "grab" },
      onclick: { enable: true, mode: "push" },
      resize: true
    },
    modes: {
      grab: { distance: 140, line_linked: { opacity: 0.8 } },
      push: { particles_nb: 4 }
    }
  },
  retina_detect: true
});

// ===== Project Preview & Slider =====
const projectCards = document.querySelectorAll('.project-card');
const preview = document.getElementById('projectPreview');
const closeBtn = document.getElementById('closePreview');
const previewTitle = document.getElementById('previewTitle');
const previewDesc = document.getElementById('previewDesc');
const previewContent = document.querySelector('.preview-content');
const slider = document.querySelector('.slider');
const sliderWrapper = document.getElementById('sliderWrapper');
const prevBtn = document.getElementById('prevSlide');
const nextBtn = document.getElementById('nextSlide');

let currentSlide = 0;

function slideCount() {
  return sliderWrapper.querySelectorAll('img').length;
}

function updateTransform() {
  const slideWidth = slider.clientWidth;
  sliderWrapper.style.transform = `translateX(${-currentSlide * slideWidth}px)`;
}

function showSlide(i) {
  const n = slideCount();
  if (n === 0) return;
  currentSlide = (i + n) % n;
  updateTransform();
}

function toggleArrows() {
  const n = slideCount();
  if (n > 1) {
    prevBtn.style.display = "block";
    nextBtn.style.display = "block";
  } else {
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
  }
}

function openPreview(img, title, desc, gallery = null) {
  previewTitle.textContent = title;
  previewDesc.textContent = desc;
  sliderWrapper.innerHTML = "";

  if (gallery) {
    gallery.forEach(src => {
      const im = document.createElement('img');
      im.src = src;
      im.alt = title;
      sliderWrapper.appendChild(im);
    });
  } else {
    const im = document.createElement('img');
    im.src = img;
    im.alt = title;
    sliderWrapper.appendChild(im);
  }

  currentSlide = 0;
  preview.classList.add('active');
  preview.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    updateTransform();
    toggleArrows();
  }, 50);
}

function closePreview() {
  preview.classList.remove('active');
  preview.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// Card click
projectCards.forEach(card => {
  card.addEventListener("click", () => {
    const gallery = card.getAttribute("data-gallery");
    if (gallery) {
      openPreview(null, card.getAttribute("data-title"), card.getAttribute("data-desc"), JSON.parse(gallery));
    } else {
      openPreview(card.getAttribute("data-img"), card.getAttribute("data-title"), card.getAttribute("data-desc"));
    }
  });
});

// Close logic
closeBtn.addEventListener("click", closePreview);
preview.addEventListener("click", (e) => {
  if (!previewContent.contains(e.target)) closePreview();
});
document.addEventListener("keydown", (e) => {
  if (!preview.classList.contains("active")) return;
  if (e.key === "Escape") closePreview();
  if (e.key === "ArrowRight") showSlide(currentSlide + 1);
  if (e.key === "ArrowLeft") showSlide(currentSlide - 1);
});

// Slider controls
prevBtn.addEventListener("click", () => showSlide(currentSlide - 1));
nextBtn.addEventListener("click", () => showSlide(currentSlide + 1));

// Mouse wheel scroll
let wheelLock = false;
slider.addEventListener('wheel', (e) => {
  if (wheelLock || !preview.classList.contains('active')) return;
  wheelLock = true;
  if ((e.deltaX || e.deltaY) > 0) showSlide(currentSlide + 1);
  else showSlide(currentSlide - 1);
  setTimeout(() => wheelLock = false, 400);
}, { passive: true });

// Touch swipe
let touchStartX = 0;
slider.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
}, { passive: true });
slider.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) {
    if (dx < 0) showSlide(currentSlide + 1);
    else showSlide(currentSlide - 1);
  }
}, { passive: true });

// Resize adjust
window.addEventListener('resize', updateTransform);

// ===== Navbar Smooth Scroll & Active Highlight =====
const navLinks = document.querySelectorAll(".nav-links li a");
const sections = document.querySelectorAll("section");

navLinks.forEach(link => {
  link.addEventListener("click", function(e) {
    if (this.getAttribute("href").startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  });
});

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 150;
    if (window.scrollY >= sectionTop) current = section.getAttribute("id");
  });
  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
});
