namespace ToDoListAPI.Data
{
    public class Categorie
    {
        public int ID { get; set; }
        public string Descrizione { get; set; } 

        public ICollection<Task> Task { get; set; } 
    }
}
