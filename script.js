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
const filterButtons = document.querySelectorAll('.filter-btn');
const serviceRows = document.querySelectorAll('#services-table tbody tr');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Scoate clasa activă de la toate butoanele
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.dataset.category;

        // Afișează/ascunde rândurile
        serviceRows.forEach(row => {
            if (category === 'toate' || row.dataset.category === category) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
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

// Actualizează statusul imediat și apoi la fiecare minut
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