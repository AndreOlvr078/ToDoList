document.querySelector('#exampleModal form').addEventListener('submit', function(e) {
  e.preventDefault();

  // Prendi i valori dai campi
  const titolo = document.getElementById('titolo').value;
  const categoria = document.getElementById('categoria').value;
  const scadenza = document.getElementById('scadenza').value;
  const utente = document.getElementById('utente').value;

  // Crea la box su un'unica riga e larga tutta la pagina, con testi spaziati e due pulsanti in fondo
  const box = document.createElement('div');
  box.className = 'card mb-2 w-100';
  box.innerHTML = `
    <div class="card-body p-2">
      <div class="d-flex flex-row align-items-center justify-content-between flex-wrap">
        <span class="mx-3"><strong>Titolo:</strong> ${titolo}</span>
        <span class="mx-3"><strong>Categoria:</strong> ${categoria}</span>
        <span class="mx-3"><strong>Scadenza:</strong> ${scadenza}</span>
        <span class="mx-3"><strong>Utente:</strong> ${utente}</span>
        <div class="ms-auto d-flex gap-2">
          <button class="btn btn-light rounded-circle d-flex align-items-center justify-content-center"
                  style="width: 48px; height: 48px; padding: 0;" 
                  data-bs-toggle="modal" data-bs-target="#modificaModal">
            <i class="bi bi-pencil" style="font-size: 2rem; font-weight: bold;"></i>
          </button>
          <button class="btn btn-light rounded-circle d-flex align-items-center justify-content-center"
                  style="width: 48px; height: 48px; padding: 0;"
                  data-bs-toggle="modal" data-bs-target="#eliminaModal">
            <i class="bi bi-trash" style="font-size: 2rem; font-weight: bold;"></i>
          </button>
        </div>
      </div>
    </div>
  `;

  // Aggiungi la box alla lista
  document.getElementById('lista-box').appendChild(box);

  // Chiudi il modal
  const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
  modal.hide();

  // Resetta il form
  e.target.reset();
});
// Variabile per gestire la modifica
let taskDaModificare = null;

// GET
function caricaTasks() {
  fetch('https://localhost:7000/api/Task')
    .then(res => res.json())
    .then(tasks => {
      const lista = document.getElementById('lista-box');
      lista.innerHTML = '';
      tasks.forEach(task => {
        const box = document.createElement('div');
        box.className = 'card mb-2 w-100';
        box.innerHTML = `
          <div class="card-body p-2">
            <div class="d-flex flex-row align-items-center justify-content-between flex-wrap">
              <span class="mx-3"><strong>Titolo:</strong> ${task.titolo}</span>
              <span class="mx-3"><strong>Categoria:</strong> ${task.categoria}</span>
              <span class="mx-3"><strong>Scadenza:</strong> ${task.scadenza}</span>
              <span class="mx-3"><strong>Utente:</strong> ${task.utente}</span>
              <div class="ms-auto d-flex gap-2">
                <button class="btn btn-light rounded-circle d-flex align-items-center justify-content-center"
                  style="width: 48px; height: 48px; padding: 0;"
                  data-bs-toggle="modal" data-bs-target="#modificaModal" onclick="modificaTask(${task.id})">
                  <i class="bi bi-pencil" style="font-size: 2rem; font-weight: bold;"></i></button>

                <button class="btn btn-light rounded-circle d-flex align-items-center justify-content-center"
                  style="width: 48px; height: 48px; padding: 0;"
                  data-bs-toggle="modal" data-bs-target="#eliminaModal" onclick="eliminaTask(${task.id})">
                  <i class="bi bi-trash" style="font-size: 2rem; font-weight: bold;"></i>
                </button>
              </div>
            </div>
          </div>
        `;
        lista.appendChild(box);
      });
    });
}

// POST
function salvaTask(e) {
  // Se chiamata da un event, previeni il submit
  if (e) e.preventDefault();

  const titolo = document.getElementById('titolo').value;
  const categoria = document.getElementById('categoria').value;
  const scadenza = document.getElementById('scadenza').value;
  const utente = document.getElementById('utente').value;

  const url = taskDaModificare
    ? `'https://localhost:7000/api/Task/${taskDaModificare}`
    :  'https://localhost:7000/api/Task';
  const method = taskDaModificare ? 'PUT' : 'POST';

  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ titolo, categoria, scadenza, utente })
  })
  .then(res => res.json())
  .then(() => {
    const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
    modal.hide();
    document.querySelector('#exampleModal form').reset();
    taskDaModificare = null;
    caricaTasks();
  });
}

// Collega la funzione al click del pulsante
document.getElementById('btnAggiungi').addEventListener('click', salvaTask);

// DELETE
function eliminaTask(id) {
  fetch(`https://localhost:7000/api/Task/${id}`, {
    method: 'DELETE'
  })
  .then(() => caricaTasks());
}

// PUT
function modificaTask(id) {
  fetch(`https://localhost:7000/api/Task/${id}`)
    .then(res => res.json())
    .then(task => {
      document.getElementById('titolo').value = task.titolo;
      document.getElementById('categoria').value = task.categoria;
      document.getElementById('scadenza').value = task.scadenza;
      document.getElementById('utente').value = task.utente;
      taskDaModificare = id;
      const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
      modal.show();
    });
}

// Carica le task all'avvio
document.addEventListener('DOMContentLoaded', caricaTasks);