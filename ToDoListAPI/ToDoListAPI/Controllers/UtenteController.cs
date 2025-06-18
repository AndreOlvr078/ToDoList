using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ToDoListAPI.Data;

namespace ToDoListAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UtenteController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UtenteController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var utenti = _context.Utente.ToList();
            return Ok(utenti);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var utente = _context.Utente.Find(id);
            if (utente == null)
                return NotFound();

            return Ok(utente);
        }

        [HttpPost]
        public IActionResult Create([FromBody] Utente utente)
        {
            _context.Utente.Add(utente);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetById), new { id = utente.ID }, utente);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Utente updated)
        {
            var utente = _context.Utente.Find(id);
            if (utente == null)
                return NotFound();

            utente.Nome = updated.Nome;
            _context.SaveChanges();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var utente = _context.Utente.Find(id);
            if (utente == null)
                return NotFound();

            _context.Utente.Remove(utente);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
