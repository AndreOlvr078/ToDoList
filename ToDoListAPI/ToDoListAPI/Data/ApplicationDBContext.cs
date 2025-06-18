using Microsoft.EntityFrameworkCore;
using ToDoListAPI.Models;
namespace ToDoListAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<Task> Task { get; set; }
        public DbSet<Categorie> Categorie { get; set; }
        public DbSet<Utente> Utente { get; set; }
        public DbSet<TaskJoinDto> TaskJoinDto { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Task>()
                .HasOne(t => t.Categoria)
                .WithMany(c => c.Task)
                .HasForeignKey(t => t.CategoriaID);

            modelBuilder.Entity<Task>()
                .HasOne(t => t.Utente)
                .WithMany(u => u.Task)
                .HasForeignKey(t => t.UtenteID);
            modelBuilder.Entity<TaskJoinDto>().HasNoKey();
        }
    }
}
