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
        public IActionResult GetAll()
        {
            var tasks = _context.Task.ToList();

            return Ok(tasks);

        }

       [HttpPut("{id}")]
public IActionResult Update(int id, [FromBody] TaskCreateDto dto)
{
    var existingTask = _context.Task.Find(id);

    if (existingTask == null)
    {
        return NotFound();
    }

    existingTask.Titolo = dto.Titolo;
    existingTask.Descrizione = dto.Descrizione;
    existingTask.Scadenza = dto.Scadenza;
    existingTask.Stato = dto.Stato;
    existingTask.CategoriaID = dto.CategoriaID;
    existingTask.UtenteID = dto.UtenteID;

    _context.SaveChanges();

    return Ok(existingTask);
}

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var task = _context.Task.Find(id);

            if (task == null)
            {
                return NotFound();
            }

            _context.Task.Remove(task);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
