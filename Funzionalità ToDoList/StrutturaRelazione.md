# Relazione Progetto: To-Do List

## 1. Introduzione
#### Breve descrizione del progetto

#### Obiettivo dell'applicazione

## 2. Analisi dei requisiti
#### Funzionalità

## 3. Tecnologie utilizzate
- **Frontend**: HTML, CSS, JS
- **Backend/API**: ASP.NET Core Web API *(C#)*
- **Database**: SQL Server


## 4. Progettazione
#### Struttura delle tabelle del DB

**Tabella `Tasks`:**
- `Id` (int, PK, Identity)
- `Title` (nvarchar)
- `IsCompleted` (bit)
- `DueDate` (datetime, opzionale)
- `Priority` (int, opzionale)

#### Struttura delle API
- `GET /api/tasks` – restituisce tutte le attività
- `POST /api/tasks` – aggiunge una nuova attività
- `PUT /api/tasks/{id}` – aggiorna un’attività
- `DELETE /api/tasks/{id}` – elimina un’attività

#### Logica del codice
- `AddTask()` – Aggiunge una nuova attività al database
- `GetTasks()` – Restituisce la lista delle attività
- `UpdateTask()` – Aggiorna lo stato di un’attività
- `DeleteTask()` – Rimuove un’attività specifica

#### Interfaccia utente

## 5. Implementazione
### Fasi di sviluppo
1. Progettazione e creazione del database SQL Server
2. Sviluppo delle API per la gestione delle attività
3. Costruzione del frontend con HTML/CSS
4. Collegamento tra frontend e backend via richieste HTTP

### Problemi incontrati

## 6. Conclusione
### Risultato finale

