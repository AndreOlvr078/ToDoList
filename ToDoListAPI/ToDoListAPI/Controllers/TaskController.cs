using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
        public async Task<IActionResult> GetAll()
        {
            var tasks = await _context.Task.ToListAsync();

            return Ok(tasks);

        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TaskCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var task = new Data.Task
            {
                Titolo = dto.Titolo,
                Descrizione = dto.Descrizione,
                Scadenza = dto.Scadenza,
                Stato = dto.Stato,
                CategoriaID = dto.CategoriaID,
                UtenteID = dto.UtenteID
            };

            _context.Task.Add(task);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAll), new { id = task.Id }, task);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var task = await _context.Task.FindAsync(id);

            if (task == null)
            {
                return NotFound();
            }

            _context.Task.Remove(task);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
