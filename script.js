let modalDiv = null;
let taskDaModificare = null;
let taskIdDaEliminare = null;
let taskIdDaCompletare = null;
let checkboxDaRipristinare = null;
let utenteSelezionato = null;


function mostraSpinner() {
  document.getElementById('loader').style.display = 'flex';
}

function nascondiSpinner() {
  document.getElementById('loader').style.display = 'none';
}



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
        option.textContent = u.nome;
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
    mostraSpinner();
  fetch(`https://localhost:7000/api/Task/Utente/${UtenteId}`)
    .then(res => res.json())
    .then(tasks => {
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
    .catch(err => alert("Errore nel caricamento tasks per utente: " + err.message))
        .finally(() => {
      nascondiSpinner();
    });;
}

function aggiungiCategoria(e) {
  e.preventDefault();
  const descrizione = document.getElementById('nomeCategoria').value;

  fetch('https://localhost:7000/api/Categorie', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ descrizione })
  })
    .then(res => {
      if (!res.ok) throw new Error('Errore nell\'aggiunta categoria');
      return res.json();
    })
    .then(() => {
      document.getElementById('formAggiungiCategoria').reset();
      caricaCategorie && caricaCategorie();
      const modal = bootstrap.Modal.getInstance(document.getElementById('aggiungiCategoriaModal'));
      modal.hide();
      alert('Categoria aggiunta!');
    })
    .catch(err => alert(err.message));
}

function eliminaCategoria(id) {
  if (confirm("Sei sicuro di voler eliminare questa categoria?")) {
    fetch(`https://localhost:7000/api/Categorie/${id}`, {
      method: 'DELETE'
    })
    .then(res => {
      if (!res.ok) throw new Error('Errore nell\'eliminazione categoria');
      // Aggiorna la lista delle categorie dopo l'eliminazione
      caricaCategorie && caricaCategorie();
      alert('Categoria eliminata!');
    })
    .catch(err => alert(err.message));
  }
}

document.getElementById('formAggiungiCategoria').addEventListener('submit', aggiungiCategoria);

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

function apriModalEliminaUtente() {
  fetch('https://localhost:7000/api/Utente')
    .then(res => res.json())
    .then(utenti => {
      const select = document.getElementById('eliminaUtenteDropdown');
      select.innerHTML = '<option value="">Seleziona utente da eliminare...</option>';
      utenti.forEach(u => {
        const option = document.createElement('option');
        option.value = u.id;
        option.textContent = u.nome;
        select.appendChild(option);
      });

      const modal = new bootstrap.Modal(document.getElementById('eliminaUtenteModal'));
      modal.show();
    })
    .catch(err => alert("Errore nel caricamento utenti: " + err.message));
}

document.getElementById('confermaEliminaUtenteBtn').addEventListener('click', () => {
  const utenteId = document.getElementById('eliminaUtenteDropdown').value;
  if (!utenteId) {
    alert("Seleziona un utente da eliminare.");
    return;
  }

  if (confirm("Sei sicuro di voler eliminare questo utente?")) {
    fetch(`https://localhost:7000/api/Utente/${utenteId}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (!res.ok) throw new Error('Errore nell\'eliminazione utente');
        alert("Utente eliminato!");
        caricaUtentiForm && caricaUtentiForm();
        caricaUtentiDropdown && caricaUtentiDropdown();
        const modal = bootstrap.Modal.getInstance(document.getElementById('eliminaUtenteModal'));
        modal.hide();
      })
      .catch(err => alert(err.message));
  }
});


document.getElementById('formAggiungiUtente').addEventListener('submit', aggiungiUtente);

function caricaTasks() {
  return fetch('https://localhost:7000/api/Task/StatoNo')
    .then(res => res.json())
    .then(tasks => {
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
              <div class="col-auto mx-2"><span><strong>Scadenza:</strong> ${task.scadenza.split('T')[0]}</span></div>
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
    .catch(err => console.error("Errore nel caricamento delle task:", err));
}

function salvaTask(e) {
  if (e) e.preventDefault();

  const titolo = document.getElementById('titolo').value;
  const descrizione = document.getElementById('descrizione').value;
  const scadenza = document.getElementById('scadenza').value;
  const categoriaID = parseInt(document.getElementById('categoria').value);
  const utenteID = parseInt(document.getElementById('utente').value);

  // Validazione data futura
  const oggi = new Date();
  oggi.setHours(0,0,0,0);
  const dataScadenza = new Date(scadenza);
  if (dataScadenza < oggi) {
    alert('La data di scadenza deve essere oggi o una data futura.');
    return;
  }

  let url = 'https://localhost:7000/api/Task';
  let method = 'POST';

  if (taskDaModificare) {
    url = `https://localhost:7000/api/Task/${taskDaModificare}`;
    method = 'PUT';
  }

  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ titolo, descrizione, stato: false, scadenza, categoriaID, utenteID })
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

document.getElementById('taskForm').addEventListener('submit', salvaTask);

function eliminaTask(id) {
  taskIdDaEliminare = id;
  var modal = new bootstrap.Modal(document.getElementById('confermaEliminaModal'));
  modal.show();
}

function toggleStato(id, nuovoStato, checkbox) {
  if (nuovoStato) {
    taskIdDaCompletare = id;
    checkboxDaRipristinare = checkbox;
    var modal = new bootstrap.Modal(document.getElementById('confermaCompletaModal'));
    modal.show();
  } else {
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
        body: JSON.stringify({ ...task, stato: nuovoStato })
      });
    })
    .then(res => res.json())
    .then(() => {
      if (utenteSelezionato) caricaTasksPerUtente(utenteSelezionato);
      else caricaTasks();
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
  }
});

document.getElementById('confermaCompletaModal').addEventListener('hidden.bs.modal', function () {
  if (checkboxDaRipristinare) {
    checkboxDaRipristinare.checked = false;
    checkboxDaRipristinare = null;
  }
  taskIdDaCompletare = null;
});

document.getElementById('btnConfermaElimina').addEventListener('click', function () {
  if (taskIdDaEliminare !== null) {
    fetch(`https://localhost:7000/api/Task/${taskIdDaEliminare}`, {
      method: 'DELETE'
    })
      .then(() => {
        taskIdDaEliminare = null;
        var modal = bootstrap.Modal.getInstance(document.getElementById('confermaEliminaModal'));
        modal.hide();
        // Ricarica la lista giusta in base alla pagina
        if (window.location.pathname.endsWith('completate.html')) {
          caricaTasksCompletate();
        } else {
          caricaTasks();
        }
      });
  }
});

function modificaTask(id) {   
  fetch(`https://localhost:7000/api/Task/${id}`)
    .then(res => res.json())
    .then(task => {
      document.getElementById('titolo').value = task.titolo;
      document.getElementById('categoria').value = task.categoriaID;
      document.getElementById('scadenza').value = task.scadenza?.split('T')[0] ?? '';
      document.getElementById('utente').value = task.utenteID;

      taskDaModificare = id;
      document.getElementById('btnAggiungi').textContent = 'Salva modifiche';

      const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
      modal.show();
    })
    .catch(err => {
      alert("Impossibile caricare il task.");
      console.error("Errore:", err);
    });
}

function notaTask(id) {
  fetch(`https://localhost:7000/api/Task/${id}`)
    .then(res => res.json())
    .then(task => {
      Promise.all([
        fetch(`https://localhost:7000/api/Utente/${task.utenteID}`).then(r => r.json()),
        fetch(`https://localhost:7000/api/Categorie/${task.categoriaID}`).then(r => r.json())
      ])
        .then(([utente, categoria]) => {
          document.getElementById('modalDescrizioneTesto').innerHTML = `
            <div><strong>Titolo:</strong> ${task.titolo}</div>
            <div><strong>Descrizione:</strong> ${task.descrizione}</div>
            <div><strong>Utente:</strong> ${utente.nome}</div>
            <div><strong>Categoria:</strong> ${categoria.descrizione}</div>
          `;
          var modal = new bootstrap.Modal(document.getElementById('descrizioneModal'));
          modal.show();
        })
        .catch(() => {
          document.getElementById('modalDescrizioneTesto').textContent = "Errore nel caricamento di utente o categoria.";
          var modal = new bootstrap.Modal(document.getElementById('descrizioneModal'));
          modal.show();
        });
    })
    .catch(() => {
      document.getElementById('modalDescrizioneTesto').textContent = "Descrizione non trovata.";
      var modal = new bootstrap.Modal(document.getElementById('descrizioneModal'));
      modal.show();
    });
}

function caricaCategorie() {
  return fetch('https://localhost:7000/api/Categorie')
    .then(res => res.json())
    .then(categorie => {
      const select = document.getElementById('categoria');
      select.innerHTML = '<option value="">Seleziona categoria...</option>';
      categorie.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.descrizione;
        select.appendChild(option);
      });
    })
    .catch(err => console.error("Errore nel caricamento categorie:", err));
}

function caricaUtentiForm() {
  return fetch('https://localhost:7000/api/Utente')
    .then(res => res.json())
    .then(utenti => {
      const select = document.getElementById('utente');
      select.innerHTML = '<option value="">Seleziona utente...</option>';
      utenti.forEach(u => {
        const option = document.createElement('option');
        option.value = u.id;
        option.textContent = u.nome;
        select.appendChild(option);
      });
    })
    .catch(err => console.error("Errore nel caricamento utenti:", err));
}

document.addEventListener('DOMContentLoaded', () => {
  // Imposta il min della data di scadenza a oggi
  const scadenzaInput = document.getElementById('scadenza');
  if (scadenzaInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const minDate = `${yyyy}-${mm}-${dd}`;
    scadenzaInput.setAttribute('min', minDate);
  }

  Promise.all([
    caricaTasks(),
    caricaCategorie(),
    caricaUtentiForm()
  ]);
});

function caricaTasksCompletate() {
  fetch('https://localhost:7000/api/Task')
    .then(res => res.json())
    .then(tasks => {
      const lista = document.getElementById('lista-box');
      lista.innerHTML = '';
      tasks.filter(task => task.stato).forEach(task => {
        const box = document.createElement('div');
        box.className = 'card mb-2 w-100';
        box.innerHTML = `
          <div class="card-body p-2">
            <div class="row align-items-center flex-wrap">
              <div class="col-auto mx-2">
                <input type="checkbox" class="form-check-input" style="transform: scale(1.5);">
              </div>
              <div class="col-auto mx-2"><span><strong>Titolo:</strong> ${task.titolo}</span></div>
              <div class="col-auto mx-2"><span><strong>Scadenza:</strong> ${task.scadenza}</span></div>
              <div class="col-auto ms-auto d-flex gap-2">
                  <button class="btn btn-light rounded-circle d-flex align-items-center justify-content-center"
                          style="width: 48px; height: 48px; padding: 0;"
                          onclick="notaTask(${task.id})">
                          <i class="bi bi-sticky" style="font-size: 2rem; font-weight: bold;"></i>
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
