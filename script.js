// Variabile per gestire la modifica
let taskDaModificare = null;

// Carica tutte le task dal backend e visualizzale
function caricaTasks() {
  fetch('http://localhost:3000/api/tasks')
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
              <div class="ms-auto">
                <button class="btn btn-primary btn-sm me-2" onclick="modificaTask(${task.id})">Modifica</button>
                <button class="btn btn-primary btn-sm" onclick="eliminaTask(${task.id})">Elimina</button>
              </div>
            </div>
          </div>
        `;
        lista.appendChild(box);
      });
    });
}

// Gestione submit form per aggiunta o modifica
document.querySelector('#exampleModal form').addEventListener('submit', function(e) {
  e.preventDefault();

  const titolo = document.getElementById('titolo').value;
  const categoria = document.getElementById('categoria').value;
  const scadenza = document.getElementById('scadenza').value;
  const utente = document.getElementById('utente').value;

  const url = taskDaModificare
    ? `http://localhost:3000/api/tasks/${taskDaModificare}`
    : 'http://localhost:3000/api/tasks';
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
    e.target.reset();
    taskDaModificare = null;
    caricaTasks();
  });
});

// Elimina una task
function eliminaTask(id) {
  fetch(`http://localhost:3000/api/tasks/${id}`, {
    method: 'DELETE'
  })
  .then(() => caricaTasks());
}

// Modifica una task (precompila il modal)
function modificaTask(id) {
  fetch(`http://localhost:3000/api/tasks/${id}`)
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