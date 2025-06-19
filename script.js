let modalDiv = null;
let taskDaModificare = null;
let taskIdDaEliminare = null;
let taskIdDaCompletare = null;
let checkboxDaRipristinare = null;
let utenteSelezionato = null;

// Selezione utente
function caricaUtentiDropdown() {
  fetch('https://localhost:7000/api/Utente')
    .then(res => res.json())
    .then(utenti => {
      const select = document.getElementById('utenteDropdown');
      select.innerHTML = '<option value="">Seleziona utente...</option>';
      utenti.forEach(u => {
        const option = document.createElement('option');
        option.value = u.id;
        option.textContent = u.nome; // o altro campo che vuoi mostrare
        select.appendChild(option);
      });
    });
}

function apriModalUtente() {
  caricaUtentiDropdown();
  const modal = new bootstrap.Modal(document.getElementById('scegliUtenteModal'));
  modal.show();
}

document.getElementById('confermaUtenteBtn').addEventListener('click', function () {
  const UtenteId = document.getElementById('utenteDropdown').value;
  if (UtenteId) {
    utenteSelezionato = UtenteId;
    caricaTasksPerUtente(UtenteId);
    const modal = bootstrap.Modal.getInstance(document.getElementById('scegliUtenteModal'));
    modal.hide();
  } else {
    alert('Seleziona un utente!');
  }
});

function caricaTasksPerUtente(UtenteId) {
  fetch(`https://localhost:7000/api/Task/Utente/${UtenteId}`)
    .then(res => res.json())
    .then(tasks => {          // <-- qui devi mettere "tasks"
      const lista = document.getElementById('lista-box');
      lista.innerHTML = '';
      tasks.forEach(task => {
        // crea e aggiungi i box come in caricaTasks
        const box = document.createElement('div');
        box.className = 'card mb-2 w-100';
        box.innerHTML = `
          <div class="card-body p-2">
            <div class="row align-items-center flex-wrap">
              <div class="col-auto mx-2">
                <input type="checkbox" class="form-check-input" style="transform: scale(1.5);"
                ${task.stato ? 'checked' : ''} onchange="toggleStato(${task.id}, this.checked, this)">
              </div>
              <div class="col-auto mx-2"><span><strong>Titolo:</strong> ${task.titolo}</span></div>
              <div class="col-auto mx-2"><span><strong>Categoria:</strong> ${task.categoria}</span></div>
              <div class="col-auto mx-2"><span><strong>Utente:</strong> ${task.utente}</span></div>
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
    })
    .catch(err => {
      alert("Errore nel caricamento tasks per utente: " + err.message);
    });
}

function aggiungiUtente(e) {
  e.preventDefault();
  const nome = document.getElementById('nomeUtente').value;

  fetch('https://localhost:7000/api/Utente', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome })
  })
  .then(res => {
    if (!res.ok) throw new Error('Errore nell\'aggiunta utente');
    return res.json();
  })
  .then(() => {
    document.getElementById('formAggiungiUtente').reset();
    caricaUtentiForm && caricaUtentiForm();
    caricaUtentiDropdown && caricaUtentiDropdown();
    const modal = bootstrap.Modal.getInstance(document.getElementById('aggiungiUtenteModal'));
    modal.hide();
    alert('Utente aggiunto!');
  })
  .catch(err => alert(err.message));
}

document.getElementById('formAggiungiUtente').addEventListener('submit', aggiungiUtente);

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
              <div class="col-auto mx-2">
                <input type="checkbox" class="form-check-input" style="transform: scale(1.5);"
${task.stato ? 'checked' : ''} onchange="toggleStato(${task.id}, this.checked, this)">
            </div>
              <div class="col-auto mx-2"><span><strong>Titolo:</strong> ${task.titolo}</span></div>
              <div class="col-auto mx-2"><span><strong>Categoria:</strong> ${task.categoria}</span></div>
              <div class="col-auto mx-2"><span><strong>Utente:</strong> ${task.utente}</span></div>
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
  // Anche questo input deve esistere
  const categoriaID = parseInt(document.getElementById('categoria').value);
  const utenteID = parseInt(document.getElementById('utente').value);

  let url = 'https://localhost:7000/api/Task';
  let method = 'POST';

  if (taskDaModificare) {
    url = `https://localhost:7000/api/Task/${taskDaModificare}`;
    method = 'PUT';
  }

  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      titolo,
      descrizione,
      stato: false,  // Imposta lo stato inizialmente a false
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
document.getElementById('taskForm').addEventListener('submit', salvaTask);

// DELETE funzona
function eliminaTask(id) {
  taskIdDaEliminare = id;
  var modal = new bootstrap.Modal(document.getElementById('confermaEliminaModal'));
  modal.show();
}

// Funzione per aggiornare lo stato del task
function toggleStato(id, nuovoStato, checkbox) {
  if (nuovoStato) {
    // Se si spunta la checkbox, chiedi conferma
    taskIdDaCompletare = id;
    checkboxDaRipristinare = checkbox;
    var modal = new bootstrap.Modal(document.getElementById('confermaCompletaModal'));
    modal.show();
  } else {
    // Se si deseleziona, aggiorna subito
    aggiornaStatoTask(id, false);
  }
}

function aggiornaStatoTask(id, nuovoStato) {
  fetch(`https://localhost:7000/api/Task/${id}`)
    .then(res => res.json())
    .then(task => {
      return fetch(`https://localhost:7000/api/Task/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titolo: task.titolo,
          descrizione: task.descrizione,
          stato: nuovoStato,
          scadenza: task.scadenza,
          categoriaID: task.categoriaID,
          utenteID: task.utenteID
        })
      });
    })
    .then(res => {
      if (!res.ok) throw new Error("Errore nel salvataggio");
      return res.json();
    })
    .then(() => {
      if (utenteSelezionato) {
        caricaTasksPerUtente(utenteSelezionato);
      } else {
        caricaTasks();
      }
    })
    .catch(err => alert(err.message));
}
document.getElementById('btnConfermaCompleta').addEventListener('click', function () {
  if (taskIdDaCompletare !== null) {
    aggiornaStatoTask(taskIdDaCompletare, true);
    taskIdDaCompletare = null;
    checkboxDaRipristinare = null;
    var modal = bootstrap.Modal.getInstance(document.getElementById('confermaCompletaModal'));
    modal.hide();
    // Dopo aver completato, puoi anche reindirizzare a completate.html se vuoi:
    // window.location.href = 'completate.html';
  }
});
document.getElementById('confermaCompletaModal').addEventListener('hidden.bs.modal', function () {
  if (checkboxDaRipristinare) {
    checkboxDaRipristinare.checked = false;
    checkboxDaRipristinare = null;
  }
  taskIdDaCompletare = null;
});


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
      if (task.scadenza !== null)
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
        option.textContent = cat.descrizione; // o cat.descrizione
        select.appendChild(option);
      });
    });
}

function caricaUtentiForm() {
  fetch('https://localhost:7000/api/Utente') // assicurati che questo endpoint esista
    .then(res => res.json())
    .then(utenti => {
      const select = document.getElementById('utente');
      select.innerHTML = '<option value="">Seleziona utente...</option>';
      utenti.forEach(u => {
        const option = document.createElement('option');
        option.value = u.id; // o u.utenteID, dipende dal tuo modello
        option.textContent = u.nome; // o u.username, dipende dal tuo campo
        select.appendChild(option);
      });
    })
    .catch(() => {
      alert("Errore nel caricamento degli utenti.");
    });
}



// Quando la pagina è pronta, carica tasks e categorie
document.addEventListener('DOMContentLoaded', () => {
  caricaTasks();
  caricaCategorie();
  caricaUtentiForm();
});

// EVENTI
document.getElementById('taskForm').addEventListener('submit', salvaTask);


