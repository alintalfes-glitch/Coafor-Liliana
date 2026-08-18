// ===== MENIU MOBIL =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Închide meniul la click pe un link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// ===== FILTRARE SERVICII =====
const serviceFilterButtons = document.querySelectorAll('#service-filters .filter-btn');
const serviceRows = document.querySelectorAll('#services-table tbody tr');

function filterItems(buttons, items, category) {
    items.forEach(item => {
        if (category === 'toate' || item.dataset.category === category) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

serviceFilterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        serviceFilterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterItems(serviceFilterButtons, serviceRows, btn.dataset.category);
    });
});

// ===== FILTRARE GALERIE =====
const galleryFilterButtons = document.querySelectorAll('#gallery-filters .filter-btn');
const galleryItems = document.querySelectorAll('#gallery-grid .gallery-item');

galleryFilterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        galleryFilterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterItems(galleryFilterButtons, galleryItems, btn.dataset.category);
    });
});

// ===== LIGHTBOX =====
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');

function openLightbox(imageSrc, caption) {
    lightboxImg.src = imageSrc;
    lightboxCaption.textContent = caption || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // blochează scroll-ul
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const fullImage = item.dataset.full;
        const imgAlt = item.querySelector('img') ? item.querySelector('img').alt : '';
        openLightbox(fullImage, imgAlt);
    });
});

lightboxClose.addEventListener('click', closeLightbox);

// Închide lightbox la click în afara imaginii
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Navigare cu tastele săgeți
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    const visibleItems = Array.from(galleryItems).filter(item => item.style.display !== 'none');
    const currentSrc = lightboxImg.src;
    const currentIndex = visibleItems.findIndex(item => item.dataset.full === currentSrc);

    if (e.key === 'Escape') {
        closeLightbox();
    } else if (e.key === 'ArrowRight' && currentIndex < visibleItems.length - 1) {
        const nextItem = visibleItems[currentIndex + 1];
        openLightbox(nextItem.dataset.full, nextItem.querySelector('img').alt);
    } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        const prevItem = visibleItems[currentIndex - 1];
        openLightbox(prevItem.dataset.full, prevItem.querySelector('img').alt);
    }
});

// ===== FORMULAR DE PROGRAMARE (trimite pe WhatsApp) =====
const bookingForm = document.getElementById('booking-form');
const formStatus = document.getElementById('form-status');

bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nume = document.getElementById('nume').value.trim();
    const telefon = document.getElementById('telefon').value.trim();
    const serviciu = document.getElementById('serviciu').value;
    const mesaj = document.getElementById('mesaj').value.trim();

    if (!nume || !telefon) {
        formStatus.textContent = 'Te rugăm să completezi câmpurile obligatorii (nume și telefon).';
        formStatus.className = 'form-status error';
        return;
    }

    // Construim mesajul pentru WhatsApp
    let text = `Bună ziua! Aș dori să fac o programare.\n\n`;
    text += `Nume: ${nume}\n`;
    text += `Telefon: ${telefon}\n`;
    if (serviciu) text += `Serviciu dorit: ${serviciu}\n`;
    if (mesaj) text += `Mesaj: ${mesaj}\n`;

    // Numărul de WhatsApp (în format internațional, fără + sau spații)
    const phoneNumber = '40766779336';
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;

    // Deschide WhatsApp într-o fereastră nouă
    window.open(whatsappUrl, '_blank');

    // Afișăm confirmarea
    formStatus.textContent = 'Se deschide WhatsApp cu cererea ta...';
    formStatus.className = 'form-status success';
    bookingForm.reset();

    setTimeout(() => {
        formStatus.style.display = 'none';
    }, 5000);
});

// ===== STATUS DESCHIS/ÎNCHIS =====
const schedule = {
    0: null, // Duminică
    1: null, // Luni
    2: { start: '14:00', end: '22:00' }, // Marți
    3: { start: '08:00', end: '16:00' }, // Miercuri
    4: { start: '14:00', end: '22:00' }, // Joi
    5: { start: '08:00', end: '16:00' }, // Vineri
    6: { start: '08:00', end: '16:00' }  // Sâmbătă
};

function updateOpenStatus() {
    const now = new Date();
    const day = now.getDay();
    const minutes = now.getHours() * 60 + now.getMinutes();
    const todaySchedule = schedule[day];
    let isOpen = false;

    if (todaySchedule) {
        const [startH, startM] = todaySchedule.start.split(':').map(Number);
        const [endH, endM] = todaySchedule.end.split(':').map(Number);
        const startMinutes = startH * 60 + startM;
        const endMinutes = endH * 60 + endM;
        isOpen = minutes >= startMinutes && minutes < endMinutes;
    }

    const badge = document.getElementById('open-status');
    badge.textContent = isOpen ? 'Deschis acum' : 'Închis acum';
    badge.classList.toggle('open', isOpen);
    badge.classList.toggle('closed', !isOpen);
}

updateOpenStatus();
setInterval(updateOpenStatus, 60000);

// ===== EVIDENȚIAZĂ ZIUA CURENTĂ ÎN PROGRAM =====
const todayIndex = new Date().getDay();
const todayRow = document.getElementById(`day-${todayIndex}`);
if (todayRow) {
    todayRow.classList.add('today');
}

// ===== ANUL CURENT ÎN FOOTER =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== BUTON BACK TO TOP =====
const backToTopBtn = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});