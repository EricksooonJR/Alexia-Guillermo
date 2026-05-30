const intro = document.getElementById("intro");
const site = document.getElementById("site");

const musicBtn = document.getElementById("musicBtn");
const bgMusic = document.getElementById("bgMusic");

const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

const weddingDate = new Date("2026-08-15T17:00:00").getTime();

let isPlaying = false;
let opened = false;
let touchStartY = 0;
let wheelAccumulated = 0;
const startButton = document.getElementById("intro");

function lockIntroScroll() {
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";
  window.scrollTo(0, 0);
}

function unlockIntroScroll() {
  document.body.style.overflow = "";
  document.documentElement.style.overflow = "";
}

function openInvitation() {

  if (opened) return;

  opened = true;

  window.scrollTo(0, 0);

  intro.classList.add("hide");
  site.classList.add("show");

  setTimeout(() => {

    intro.style.display = "none";
    unlockIntroScroll();
    window.scrollTo(0, 0);

  }, 1200);
}

function handleOpenGesture() {
  if (opened) return;
  openInvitation();
}
window.addEventListener(
  "touchstart",
  async (event) => {

    if (opened) return;

    touchStartY = event.touches[0].clientY;

    // Safari/iPhone necesita reproducir
    // EXACTAMENTE durante touchstart

    if (!isPlaying) {

      try {

        bgMusic.muted = true;
        bgMusic.volume = 0;

        const playPromise = bgMusic.play();

        if (playPromise !== undefined) {
          await playPromise;
        }

        // Esperar un frame para que Safari confirme reproducción
        requestAnimationFrame(() => {

          bgMusic.muted = false;
          bgMusic.volume = 1;

          isPlaying = true;

          musicBtn.textContent = "❚❚";

          console.log("Audio iniciado en Safari");

        });

      } catch (error) {

        console.log("Safari bloqueó:", error);

      }
    }
  },
  { passive: true }
);
window.addEventListener(
  "mousemove",
  async () => {

    // Solo desktop
    if (
      !isPlaying &&
      !("ontouchstart" in window)
    ) {

      try {

        await bgMusic.play();

        isPlaying = true;

        musicBtn.textContent = "❚❚";

        console.log("Audio iniciado desktop");

      } catch (error) {

        console.log("Desktop bloqueó:", error);

      }
    }
  },
  { once: true }
);

window.addEventListener(
  "touchmove",
  (event) => {

    if (opened) return;

    const currentY = event.touches[0].clientY;

    const diffY = touchStartY - currentY;

    // Mucho más sensible
    if (diffY > 5) {

      openInvitation();
    }
  },
  { passive: true }
);

window.addEventListener(
  "wheel",
  (event) => {

    if (opened) return;

    // Solo abrir invitación
    if (Math.abs(event.deltaY) > 2) {

      openInvitation();
    }
  },
  { passive: true }
);





if (musicBtn && bgMusic) {
  musicBtn.addEventListener("click", async () => {
    try {
      if (isPlaying) {
        bgMusic.pause();
        musicBtn.textContent = "♪";
      } else {
        await bgMusic.play();
        musicBtn.textContent = "❚❚";
      }
      isPlaying = !isPlaying;
    } catch (error) {
      console.log("No se pudo reproducir el audio:", error);
    }
  });
}

function updateCountdown() {
  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  const now = new Date().getTime();
  const distance = weddingDate - now;

  if (distance <= 0) {
    daysEl.textContent = "00";
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  daysEl.textContent = String(days).padStart(2, "0");
  hoursEl.textContent = String(hours).padStart(2, "0");
  minutesEl.textContent = String(minutes).padStart(2, "0");
  secondsEl.textContent = String(seconds).padStart(2, "0");
}

/* =========================
   GALERIA CINTA VERTICAL
========================= */

const slides = document.querySelectorAll('.film-slide');
const galleryPrev = document.getElementById('galleryPrev');
const galleryNext = document.getElementById('galleryNext');
const openGalleryModal = document.getElementById('openGalleryModal');

const galleryModal = document.getElementById('galleryModal');
const closeGalleryModal = document.getElementById('closeGalleryModal');
const modalImage = document.getElementById('modalImage');
const modalCaption = document.getElementById('modalCaption');
const modalPrev = document.getElementById('modalPrev');
const modalNext = document.getElementById('modalNext');
const galleryThumbs = document.getElementById('galleryThumbs');

let currentSlide = 0;
let currentModalIndex = 0;

const galleryData = Array.from(slides).map((slide) => {
  const img = slide.querySelector('img');
  return {
    src: img.src,
    alt: img.alt,
    caption: img.alt
  };
});

function updateFilmGallery() {
  slides.forEach((slide, index) => {
    slide.classList.remove('active', 'prev', 'next', 'hidden');

    if (index === currentSlide) {
      slide.classList.add('active');
    } else if (index === currentSlide - 1) {
      slide.classList.add('prev');
    } else if (index === currentSlide + 1) {
      slide.classList.add('next');
    } else {
      slide.classList.add('hidden');
    }
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  updateFilmGallery();
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  updateFilmGallery();
}

function renderThumbs() {
  if (!galleryThumbs) return;

  galleryThumbs.innerHTML = '';

  galleryData.forEach((item, index) => {
    const thumb = document.createElement('img');
    thumb.src = item.src;
    thumb.alt = item.alt;

    if (index === currentModalIndex) {
      thumb.classList.add('active-thumb');
    }

    thumb.addEventListener('click', () => openModal(index));
    galleryThumbs.appendChild(thumb);
  });
}

function openModal(index) {
  currentModalIndex = index;

  modalImage.src = galleryData[index].src;
  modalImage.alt = galleryData[index].alt;
  modalCaption.textContent = galleryData[index].caption;

  galleryModal.classList.add('show');
  document.body.style.overflow = 'hidden';

  renderThumbs();
}

function closeModal() {
  galleryModal.classList.remove('show');
  document.body.style.overflow = '';
}

function nextModalImage() {
  currentModalIndex = (currentModalIndex + 1) % galleryData.length;
  openModal(currentModalIndex);
}

function prevModalImage() {
  currentModalIndex = (currentModalIndex - 1 + galleryData.length) % galleryData.length;
  openModal(currentModalIndex);
}

galleryNext?.addEventListener('click', nextSlide);
galleryPrev?.addEventListener('click', prevSlide);

slides.forEach((slide, index) => {
  slide.addEventListener('click', () => openModal(index));
});

openGalleryModal?.addEventListener('click', () => openModal(currentSlide));
closeGalleryModal?.addEventListener('click', closeModal);
modalNext?.addEventListener('click', nextModalImage);
modalPrev?.addEventListener('click', prevModalImage);

galleryModal?.addEventListener('click', (e) => {
  if (e.target === galleryModal) closeModal();
});

window.addEventListener('keydown', (e) => {
  if (!galleryModal || !galleryModal.classList.contains('show')) return;

  if (e.key === 'Escape') closeModal();
  if (e.key === 'ArrowRight') nextModalImage();
  if (e.key === 'ArrowLeft') prevModalImage();
});

updateFilmGallery();

lockIntroScroll();
updateCountdown();
setInterval(updateCountdown, 1000);

window.addEventListener("DOMContentLoaded", () => {

  const intro = document.querySelector(".intro");
  if (!intro) return;

  const images = [
    "img/1.jpeg",
    "img/2.jpeg",
    "img/3.jpeg",
    "img/4.jpeg"
  ];

  // Contenedor tipo cinta vertical
  const strip = document.createElement("div");

  strip.style.position = "absolute";
  strip.style.inset = "0";
  strip.style.display = "flex";
  strip.style.flexDirection = "column";
  strip.style.willChange = "transform";
  strip.style.zIndex = "-1";

  const loopImages = [...images, ...images];

  loopImages.forEach((src) => {
    const slide = document.createElement("div");

    slide.style.flex = "0 0 100%";
    slide.style.height = "100vh";
    slide.style.backgroundImage = `
      linear-gradient(rgba(39,27,19,0.4), rgba(39,27,19,0.5)),
      url('${src}')
    `;
    slide.style.backgroundSize = "cover";
    slide.style.backgroundPosition = "center";
    slide.style.backgroundRepeat = "no-repeat";

    strip.appendChild(slide);
  });

  intro.prepend(strip);

  let pos = 0;
  const speed = 2;

  function animate() {
    pos += speed;

    const maxScroll = window.innerHeight * images.length;

    if (pos >= maxScroll) {
      pos = 0;
    }

    strip.style.transform = `translateY(-${pos}px)`;

    requestAnimationFrame(animate);
  }

  animate();

});

window.addEventListener("DOMContentLoaded", () => {

  const hero = document.querySelector(".hero");

  const heroImages = [
    "img/6.jpeg",
    "img/9.jpeg",
    "img/10.jpeg",
    "img/17.jpeg",
    "img/18.jpeg",
    "img/19.jpeg",
    "img/20.jpeg",
    "img/21.jpeg"
  ];

  let currentHero = 0;
  let visibleHeroLayer = 0;

  // Crear capas dinámicamente
  const heroBg1 = document.createElement("div");
  const heroBg2 = document.createElement("div");

  heroBg1.classList.add("hero-bg");
  heroBg2.classList.add("hero-bg");

  heroBg1.style.opacity = "1";
  heroBg2.style.opacity = "0";

  heroBg1.style.transform = "scale(1)";
  heroBg2.style.transform = "scale(1.08)";

  // Primera imagen
  heroBg1.style.backgroundImage = `
    linear-gradient(rgba(248, 244, 239, 0.35), rgba(248, 244, 239, 0.65)),
    url('${heroImages[0]}')
  `;

  hero.prepend(heroBg1, heroBg2);

  setInterval(() => {

    currentHero++;

    if (currentHero >= heroImages.length) {
      currentHero = 0;
    }

    const nextLayer =
      visibleHeroLayer === 0 ? heroBg2 : heroBg1;

    const currentLayer =
      visibleHeroLayer === 0 ? heroBg1 : heroBg2;

    nextLayer.style.backgroundImage = `
      linear-gradient(rgba(248, 244, 239, 0.35), rgba(248, 244, 239, 0.65)),
      url('${heroImages[currentHero]}')
    `;

    nextLayer.style.opacity = "1";
    currentLayer.style.opacity = "0";

    nextLayer.style.transform = "scale(1)";
    currentLayer.style.transform = "scale(1.08)";

    visibleHeroLayer =
      visibleHeroLayer === 0 ? 1 : 0;

  }, 3000);

});

/* =========================
   SWIPE GALERIA VERTICAL
========================= */

let touchStartYGallery = 0;
let touchEndYGallery = 0;

const filmFrame = document.querySelector('.film-frame');

filmFrame?.addEventListener('touchstart', (e) => {
  touchStartYGallery = e.changedTouches[0].screenY;
});

filmFrame?.addEventListener('touchend', (e) => {
  touchEndYGallery = e.changedTouches[0].screenY;

  const swipeDistance = touchEndYGallery - touchStartYGallery;

  if (swipeDistance < -50) nextSlide();
  if (swipeDistance > 50) prevSlide();
});

/* ===== ANIMACIONES SCROLL ===== */

const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  },
  {
    threshold: 0.15,
  }
);

reveals.forEach((el, index) => {
  // alterna dirección automáticamente
  if (index % 2 === 0) {
    el.classList.add("reveal-left");
  } else {
    el.classList.add("reveal-right");
  }

  observer.observe(el);
});
