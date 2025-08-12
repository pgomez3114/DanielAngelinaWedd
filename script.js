const APP_URL = "https://script.google.com/macros/s/AKfycbz46g7RzG1n3oish1-imvCE--cYOM01lcGhzo6gCEJFbbo4nJjNpGn55mx4--UOSO5oZQ/exec";

let guests = [];

async function loadGuestList() {
  const res = await fetch(APP_URL);
  guests = await res.json();
}

document.getElementById('searchBtn').addEventListener('click', () => {
  const searchValue = document.getElementById('searchName').value.trim().toLowerCase();
  const match = guests.find(g => g.name.toLowerCase().includes(searchValue));

  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  if (match) {
    const familyGroup = guests.filter(g => g.familyId === match.familyId);
    resultsDiv.innerHTML = `<p>We found your family: ${familyGroup.map(g => g.name).join(', ')}</p>`;
    const guestListDiv = document.getElementById('guestList');
    guestListDiv.innerHTML = '';
    familyGroup.forEach(member => {
      guestListDiv.innerHTML += `
        <label>
          <input type="checkbox" name="attendees" value="${member.name}">
          ${member.name}
        </label><br>`;
    });
    document.getElementById('rsvpForm').style.display = 'block';
  } else {
    resultsDiv.innerHTML = '<p style="color:red;">No match found. Please check your spelling.</p>';
    document.getElementById('rsvpForm').style.display = 'none';
  }
});

document.getElementById('attendanceForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const selectedGuests = Array.from(document.querySelectorAll('input[name="attendees"]:checked'))
                              .map(cb => cb.value);
  if (selectedGuests.length === 0) {
    alert("Please select at least one guest.");
    return;
  }
  await fetch(APP_URL, {
    method: 'POST',
    body: JSON.stringify({ attendees: selectedGuests }),
    headers: { 'Content-Type': 'application/json' }
  });
  alert('RSVP submitted! Thank you.');
});
 
loadGuestList();