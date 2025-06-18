using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ToDoListAPI.Data;
using ToDoListAPI.Models;

namespace ToDoListAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategorieController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategorieController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var categorie = _context.Categorie.ToList();
            return Ok(categorie);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var categoria = _context.Categorie.Find(id);
            if (categoria == null)
                return NotFound();

            return Ok(categoria);
        }

        [HttpPost]
        public IActionResult Create([FromBody] CategorieDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var categoria = new Data.Categorie
            {
                Descrizione = dto.Descrizione,
            };

            _context.Categorie.Add(categoria);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetAll), new { id = categoria.ID }, categoria);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] CategorieDto updated)
        {
            var categoria = _context.Categorie.Find(id);
            if (categoria == null)
                return NotFound();

            categoria.Descrizione = updated.Descrizione;
            _context.SaveChanges();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var categoria = _context.Categorie.Find(id);
            if (categoria == null)
                return NotFound();

            _context.Categorie.Remove(categoria);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
