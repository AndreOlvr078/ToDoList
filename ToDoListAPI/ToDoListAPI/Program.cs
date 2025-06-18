using Microsoft.EntityFrameworkCore;
using ToDoListAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// 🔧 CONFIGURA CORS (prima di Build)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()   // In sviluppo va bene così
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 🔧 REGISTRA IL DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// 🔧 ATTIVA IL CORS QUI (dopo Build ma prima di MapControllers)
app.UseCors("AllowAll");

// Swagger solo in sviluppo
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();

