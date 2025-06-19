let modalDiv = null;
let taskDaModificare = null;
let taskIdDaEliminare = null;


// GET funzionante
function caricaTasks() {
  fetch('https://localhost:7000/api/Task')
    .then(res => res.json())
    .then(tasks => {
      console.log(tasks)
      const lista = document.getElementById('lista-box');
      lista.innerHTML = '';
      tasks.forEach(task => {
        const box = document.createElement('div');
        box.className = 'card mb-2 w-100';
        box.innerHTML = `
          <div class="card-body p-2">
            <div class="row align-items-center flex-wrap">
              <div class="col-auto mx-2"><span><strong>ID:</strong> ${task.id}</span></div>
              <div class="col-auto mx-2"><span><strong>Titolo:</strong> ${task.titolo}</span></div>
              <div class="col-auto mx-2"><span><strong>Descrizione:</strong> ${task.descrizione}</span></div>
              <div class="col-auto mx-2"><span><strong>Categoria:</strong> ${task.categoria}</span></div>
              <div class="col-auto mx-2"><span><strong>Utente:</strong> ${task.utente}</span></div>
              <div class="col-auto mx-2"><span><strong>Stato:</strong> ${task.stato}</span></div>
              <div class="col-auto mx-2"><span><strong>Scadenza:</strong> ${task.scadenza}</span></div>
              <div class="col-auto ms-auto d-flex gap-2">
                  <button class="btn btn-light rounded-circle d-flex align-items-center justify-content-center"
                          style="width: 48px; height: 48px; padding: 0;"
                          onclick="notaTask(${task.id})">
                          <i class="bi bi-sticky" style="font-size: 2rem; font-weight: bold;"></i>
                  </button>
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
  const descrizione = document.getElementById('descrizione').value;  // Assicurati che esista questo input
  const scadenza = document.getElementById('scadenza').value;
  const stato = document.getElementById('stato').value;              // Anche questo input deve esistere
  const categoriaID = parseInt(document.getElementById('categoria').value);
  const utenteID = parseInt(document.getElementById('utente').value);

  let url = 'https://localhost:7000/api/Task';
  let method = 'POST';

  if (taskDaModificare) {
    url = `https://localhost:7000/api/Task/${taskDaModificare}`;
    method = 'PUT';
  }

  fetch(url =`https://localhost:7000/api/Task/${taskDaModificare}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      titolo,
      descrizione,
      stato,
      scadenza,
      categoriaID,
      utenteID
    })
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
  taskIdDaEliminare = id;
  var modal = new bootstrap.Modal(document.getElementById('confermaEliminaModal'));
  modal.show();
}

// Conferma eliminazione
document.getElementById('btnConfermaElimina').addEventListener('click', function () {
  if (taskIdDaEliminare !== null) {
    fetch(`https://localhost:7000/api/Task/${taskIdDaEliminare}`, {
      method: 'DELETE'
    })
      .then(() => {
        taskIdDaEliminare = null;
        var modal = bootstrap.Modal.getInstance(document.getElementById('confermaEliminaModal'));
        modal.hide();
        caricaTasks();
      });
  }
});

// MODIFICA - Carica i dati del task e apre il form per modificarlo
function modificaTask(id) {
  fetch(`https://localhost:7000/api/Task/${id}`, {
    method: 'GET'  //  Metodo corretto per ottenere i dati
  })
    .then(res => {
      if (!res.ok) throw new Error("Errore nel recupero del task");
      return res.json();
    })
    .then(task => {
      document.getElementById('titolo').value = task.titolo;
      document.getElementById('categoria').value = task.categoriaID; //  assicurati che sia categoriaID e non descrizione
      if(task.scadenza !== null) 
        document.getElementById('scadenza').value = task.scadenza.split('T')[0]; // elimina orario se presente
      document.getElementById('utente').value = task.utenteID;

      taskDaModificare = id;
      document.getElementById('btnAggiungi').textContent = 'Salva modifiche';

      const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
      modal.show();
    })
    .catch(err => {
      console.error("Errore:", err);
      alert("Impossibile caricare il task.");
    });
}

function notaTask(id) {
  fetch(`https://localhost:7000/api/Task/${id}`)
    .then(res => res.json())
    .then(task => {
      document.getElementById('modalDescrizioneTesto').textContent = task.descrizione;
      var modal = new bootstrap.Modal(document.getElementById('descrizioneModal'));
      modal.show();
    })
    .catch(() => {
      document.getElementById('modalDescrizioneTesto').textContent = "Descrizione non trovata.";
      var modal = new bootstrap.Modal(document.getElementById('descrizioneModal'));
      modal.show();
    });
}

function caricaCategorie() {
  fetch('https://localhost:7000/api/Categorie')
    .then(res => res.json())
    .then(categorie => {
      const select = document.getElementById('categoria');
      select.innerHTML = '<option value="">Seleziona categoria...</option>';
      categorie.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id; // o cat.categoriaID, dipende dal tuo modello
        option.textContent = cat.nome; // o cat.descrizione
        select.appendChild(option);
      });
    });
}


// Quando la pagina è pronta, carica tasks e categorie
document.addEventListener('DOMContentLoaded', () => {
  caricaTasks();
  caricaCategorie();
});

// EVENTI
document.getElementById('taskForm').addEventListener('submit', salvaTask);


