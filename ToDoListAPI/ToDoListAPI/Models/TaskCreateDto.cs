namespace ToDoListAPI.Models
{
    public class TaskCreateDto
    {
        public int Id { get; set; }
        public string Titolo { get; set; }
        public string? Descrizione { get; set; }
        public DateTime? Scadenza { get; set; }
        public string Stato { get; set; }
        public int? CategoriaID { get; set; }
        public int? UtenteID { get; set; }
    }
}
