--visualizzazione tabelle
SELECT * FROM [TestDB].[dbo].[Task]
SELECT * FROM [TestDB].[dbo].[Categorie]
SELECT * FROM [TestDB].[dbo].[Utente]


--Inserimento dati
INSERT INTO Task (Titolo, Descrizione, Scadenza, CategoriaID, Stato, UtenteID)
VALUES 
('Spesa', 'Latte', '2025-06-18', 1, 'In Corso...', 1),
('Finire SQL', 'Tabelle', '2025-06-20', 2, 'Completato', 2),
('Spesa', 'Pane', NULL, 1, 'In Corso...', 3),
('Medicine', 'Tachipirine', '2025-06-19', 3, 'Completato', 4),
('Pulire', 'Bagno', NULL, 1, 'Completato', 5);

INSERT INTO Task (Titolo, Descrizione, Scadenza, CategoriaID, Stato)
VALUES 
('Spesa', 'Latte', '2025-06-18', 1, 'In Corso...'),
('Finire SQL', 'Tabelle', '2025-06-20', 2, 'Completato'),
('Spesa', 'Pane', NULL, 1, 'In Corso...'),
('Medicine', 'Tachipirine', '2025-06-19', 3, 'Completato'),
('Pulire', 'Bagno', NULL, 1, 'Completato');

INSERT INTO Task (Titolo, Descrizione, Scadenza, Stato, UtenteID)
VALUES 
('Spesa', 'Latte', '2025-06-18', 'In Corso...', 1),
('Finire SQL', 'Tabelle', '2025-06-20', 'Completato', 2),
('Spesa', 'Pane', NULL, 'In Corso...', 3),
('Medicine', 'Tachipirine', '2025-06-19', 'Completato', 4),
('Pulire', 'Bagno', NULL, 'Completato', 5);


--Eliminazione dati
DELETE FROM Task
WHERE Id = 2;


DELETE FROM Task
WHERE CategoriaID = 2;


--Aggiornamento dati
UPDATE Task
SET 
    Titolo = 'Titolo Aggiornato',
    Scadenza = GETDATE(),
    Descrizione = 'cose di lavoro'
WHERE CategoriaID = 2;


--Inserimento Categorie
INSERT INTO Categorie (Descrizione)
VALUES ('Casa'), ('Lavoro'), ('Salute');


--creazione indice
CREATE INDEX IX_Task_CategoriaID ON Task(CategoriaID);

--visualizza solo determinati dati
SELECT * FROM Task WHERE CategoriaID = 1;

--elimina indice
DROP INDEX IX_Task_CategoriaID ON Task


--Ordinamento Tabella CON JOIN
SELECT T.Titolo, T.Descrizione, T.Scadenza, T.Stato, C.Descrizione AS Categoria, U.Nome AS Utenti
FROM Task T
INNER JOIN Categorie C ON T.CategoriaID = C.ID
INNER JOIN Utente U ON T.UtenteID = U.ID
--WHERE C.ID = 1



SELECT * FROM Task
ORDER BY CategoriaID;



--AGGIUNGERE SCADENZA --- FATTO


--AGGIUNGERE UTENTE PER TASK --- FATTO

ALTER TABLE Task
ADD CONSTRAINT FK_Task_Utente
FOREIGN KEY (UtenteID)
ReFERENCES Utente(ID);

INSERT INTO Utente (Nome) VALUES ('Mario');
--AGGIUNGERE COMPLETATO IN CORSO --- FATTO
