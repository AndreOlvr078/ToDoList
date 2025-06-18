let modalDiv = null;
let taskDaModificare = null;

// GET funzionante
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
            onclick="modificaTask(${task.id})">
            <i class="bi bi-pencil" style="font-size: 2rem; font-weight: bold;"></i>
          </button>
          <button class="btn btn-light rounded-circle d-flex align-items-center justify-content-center"
            style="width: 48px; height: 48px; padding: 0;"
            onclick="eliminaTask(${task.id})">
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

// POST/PUT
function salvaTask(e) {
  if (e) e.preventDefault();

  const titolo = document.getElementById('titolo').value;
  const categoria = document.getElementById('categoria').value;
  const scadenza = document.getElementById('scadenza').value;
  const utente = document.getElementById('utente').value;

  let url = 'https://localhost:7000/api/Task';
  let method = 'POST';

  if (taskDaModificare) {
    url = `https://localhost:7000/api/Task/${taskDaModificare}`;
    method = 'PUT';
  }

  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ titolo, categoria, scadenza, utente })
  })
  .then(res => {
    if (!res.ok) throw new Error('Errore nel salvataggio');
    return res.json();
  })
  .then(() => {
    const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
    modal.hide();
    document.getElementById('taskForm').reset();
    taskDaModificare = null;
    document.getElementById('btnAggiungi').textContent = 'Aggiungi';
    caricaTasks();
  })
  .catch(err => alert(err.message));
}

// Collega la funzione al click del pulsante
document.getElementById('btnAggiungi').addEventListener('click', salvaTask);

// DELETE funzona
function eliminaTask(id) {
  if (confirm("Sei sicuro di voler eliminare questa task?")) {
    fetch(`https://localhost:7000/api/Task/${id}`, {
      method: 'DELETE'
    })
    .then(() => caricaTasks());
  }
}

// MODIFICA
function modificaTask(id) {
  fetch(`https://localhost:7000/api/Task/${id}`)
    .then(res => res.json())
    .then(task => {
      document.getElementById('titolo').value = task.titolo;
      document.getElementById('categoria').value = task.categoria;
      document.getElementById('scadenza').value = task.scadenza;
      document.getElementById('utente').value = task.utente;
      taskDaModificare = id;
      document.getElementById('btnAggiungi').textContent = 'Salva modifiche';
      const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
      modal.show();
    });
}

// EVENTI
document.getElementById('taskForm').addEventListener('submit', salvaTask);


