let reservations = [];

// Menandai hari ini
function getTodayDate() {
  const today = new Date();
  return `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
}

// Menampilkan kalender dengan tanggal
function generateCalendar() {
  const calendarContainer = document.getElementById('calendar');
  const currentDate = new Date();
  const month = currentDate.getMonth();  // Bulan saat ini
  const year = currentDate.getFullYear(); // Tahun saat ini
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  // Menghitung hari pertama dalam bulan
  let startDay = firstDayOfMonth.getDay();

  // Mendapatkan tanggal hari ini
  const todayDate = getTodayDate();

  // Membersihkan kalender
  calendarContainer.innerHTML = '';

  // Mengisi kalender dengan tanggal
  for (let i = 0; i < startDay; i++) {
    calendarContainer.innerHTML += '<div class="calendar-date"></div>'; // Kosongkan hari yang tidak ada
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    let reserved = reservations.filter(reservation => reservation.date === dateStr);
    let dateClass = 'calendar-date';
    let fieldInfo = '';

    // Tandai hari ini
    if (dateStr === todayDate) {
      dateClass += ' today';
    }

    // Jika ada pemesanan, tandai dan tampilkan bidang yang memesan
    if (reserved.length > 0) {
      dateClass += ' reserved';
      fieldInfo = reserved.map(res => `<div class="field-info">${res.field}</div>`).join('');
    }

    // Menambahkan tanggal ke kalender
    calendarContainer.innerHTML += `
      <div class="${dateClass}" data-date="${dateStr}">
        ${day}
        ${fieldInfo}
      </div>
    `;
  }
}

// Menangani form submit
document.getElementById('booking-form').addEventListener('submit', function(e) {
  e.preventDefault();

  // Mengambil data dari form
  const name = document.getElementById('name').value;
  const field = document.getElementById('field').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;

  // Mendapatkan tanggal hari ini
  const todayDate = getTodayDate();

  // Validasi: Memastikan pemesanan hanya bisa dilakukan pada hari ini atau sebelum hari ini
  if (date < todayDate) {
    alert("Anda tidak bisa memesan tempat untuk tanggal yang sudah lewat dan pada hari ini .");
    return;
  }

  // Menyimpan data pemesanan
  reservations.push({ name, field, date, time });

  // Menampilkan kalender dengan pembaruan
  generateCalendar();

  // Menyusun data untuk dikirim ke server
  const formData = new FormData();
  formData.append('name', name);
  formData.append('field', field);
  formData.append('date', date);
  formData.append('time', time);

  // Mengirim data ke saveReservation.php menggunakan fetch
  fetch('saveReservation.php', {
      method: 'POST',
      body: formData
  })
  .then(response => response.text())
  .then(data => {
      alert(data); // Tampilkan pesan dari server
      // Reset form setelah berhasil
      document.getElementById('booking-form').reset();
      // Update kalender
      generateCalendar();
  })
});

// Menginisialisasi kalender saat pertama kali dibuka
generateCalendar();
