using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using ToDoListAPI.Data;
using ToDoListAPI.Models;

namespace ToDoListAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TaskController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TaskController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAllTasks()
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


        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var task = _context.Task.Find(id);

            if (task == null)
                return NotFound();

            return Ok(task);
        }

        [HttpPost]
        public IActionResult Create([FromBody] TaskCreateDto dto)
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
        public IActionResult Update(int id, [FromBody] TaskCreateDto dto)
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
        public IActionResult Delete(int id)
        {
            var sql = "EXEC EliminaTask @p0";
            _context.Database.ExecuteSqlRaw(sql, id);

            return Ok(new { message = "Task eliminato tramite stored procedure." });
        }
    }
}
