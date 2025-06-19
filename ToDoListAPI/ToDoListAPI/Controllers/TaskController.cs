using System.Runtime.ConstrainedExecution;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using ToDoListAPI.Data;
using ToDoListAPI.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace ToDoListAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TaskController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TaskController(ApplicationDbContext context) //Questo controller utilizza ApplicationDbContext per interagire con il database principalmente tramite stored procedure eseguite con ExecuteSqlRaw di Entity Framework Core.
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAllTasks() // Recupera la lista di task tramite la stored procedure "TabelleJoinate" e restituisce un DTO personalizzato(TaskJoinDto).
        {
            var tasks = _context.TaskJoinDto
                .FromSqlRaw("EXEC TabelleJoinate")
                .ToList();

            return Ok(tasks);
        }

        [HttpGet("Utente/{UtenteId}")]
        public IActionResult GetTasksByUser(int UtenteId)
        {
            var tasks = _context.TaskJoinDto
                .FromSqlRaw("EXEC OrdinaUtente @UtenteId",
                    new SqlParameter("@UtenteId", UtenteId))
                .ToList();

            return Ok(tasks);
        }

        [HttpGet("Categoria/{CategoriaId}")]
        public IActionResult GetTasksByCategoria(int CategoriaId)
        {
            var tasks = _context.TaskJoinDto
                .FromSqlRaw("EXEC OrdinaCategoria @CategoriaId",
                    new SqlParameter("@CategoriaId", CategoriaId))
                .ToList();

            return Ok(tasks);
        }

        [HttpGet("Stato")]
        public IActionResult GetTasksByStato() // Recupera i task filtrati per stato (completati o non completati) tramite la stored procedure "OrdinaStato".
        {
            var tasks = _context.TaskJoinDto
                .FromSqlRaw("EXEC OrdinaStatoNo")
                .ToList();
            return Ok(tasks);
        }


        //[HttpGet("{id}")]
        //public IActionResult GetById(int id)  //Recupera un task specifico per ID dalla tabella Task.
        //{
        //    var task = _context.Task.Find(id);

        //    if (task == null)
        //        return NotFound();

        //    return Ok(task);
        //}

        [HttpPost]
        public IActionResult Create([FromBody] TaskCreateDto dto) // Crea un nuovo task eseguendo la stored procedure "AggiungiTask" con i dati forniti nel body della richiesta.
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var sql = "EXEC AggiungiTask @p0, @p1, @p2, @p3, @p4, @p5";

            _context.Database.ExecuteSqlRaw(
                sql,
                dto.Titolo,
                dto.Descrizione,
                dto.Scadenza,
                dto.Stato,
                dto.CategoriaID,
                dto.UtenteID
            );

            return Ok(new { message = "Task inserito." });
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] TaskCreateDto dto)  //Aggiorna un task esistente tramite la stored procedure "AggiornaTask" passando l'ID e i nuovi dati.
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var sql = "EXEC AggiornaTask @p0, @p1, @p2, @p3, @p4, @p5, @p6";

            _context.Database.ExecuteSqlRaw(
                sql,
                id,
                dto.Titolo,
                dto.Descrizione,
                dto.Scadenza,
                dto.Stato,
                dto.CategoriaID,
                dto.UtenteID
            );

            return Ok(new { message = "Task aggiornato tramite stored procedure." });
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)   //Elimina un task eseguendo la stored procedure "EliminaTask" con l'ID specificato.
        {
            var sql = "EXEC EliminaTask @p0";
            _context.Database.ExecuteSqlRaw(sql, id);

            return Ok(new { message = "Task eliminato tramite stored procedure." });
        }

        [HttpDelete("EliminaCompletate")]
        public IActionResult DeleteCompletedTasks() // Elimina tutti i task completati eseguendo la stored procedure "EliminaCompletate".
        {
            _context.Database.ExecuteSqlRaw("EXEC EliminaCompletate");
            return Ok(new { message = "Task completati eliminati." });
        }
    }
}
