using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ToDoListAPI.Data;

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

        //[HttpPost]
        //public async Task<IActionResult> Create(Data.Task task)
        //{
        //    _context.Task.Add(task);
        //    await _context.SaveChangesAsync();
        //    return CreatedAtAction(nameof(GetAll), new { id = task.Id }, task);
        //}
    }
}
