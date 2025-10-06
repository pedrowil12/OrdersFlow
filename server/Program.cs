using Microsoft.EntityFrameworkCore;
using OrdersFlow.Data;
using OrdersFlow.Repositorys;
using OrdersFlow.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

// == Common services (registrados para ambos api e worker) ==
builder.Services.AddDbContext<AppDbContext>(options =>
   options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();

builder.Services.AddScoped<ProductService>();
builder.Services.AddScoped<CustomerService>();
builder.Services.AddScoped<OrderService>();

builder.Services.AddSingleton<InMemoryOrderQueue>();
builder.Services.AddHostedService<OrderProcessingWorker>();

// Health check for queue
builder.Services.AddHealthChecks()
    .AddCheck<InMemoryQueueHealthCheck>("OrderQueue");

// CORS + controllers only relevant for API mode; we will add conditionally.

var runMode = Environment.GetEnvironmentVariable("RUN_MODE")?.ToLowerInvariant() ?? "api"; // "api" or "worker"

// Apply migrations on startup helper
void ApplyMigrations(IServiceProvider services)
{
    using var scope = services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// ---------- If API mode: create web app ----------
if (runMode == "api")
{
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowLocalhost",
            policy => policy
                .WithOrigins("http://localhost:5173")
                .AllowAnyHeader()
                .AllowAnyMethod());
    });

    builder.Services.AddControllers();
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();

    var app = builder.Build();

    // apply migrations
    ApplyMigrations(app.Services);

    app.UseCors("AllowLocalhost");

    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseHttpsRedirection();
    app.UseAuthorization();
    app.MapControllers();

    // health endpoint
    app.MapHealthChecks("/health");
    app.Run();
    return;
}

// ---------- If WORKER mode: create Host without web server ----------
if (runMode == "worker")
{
    var host = Host.CreateDefaultBuilder(args)
        .ConfigureServices((context, services) =>
        {
            // re-register everything already in builder.Services
            // you can copy registrations or reuse builder.Services above if needed
        })
        .Build();

    // apply migrations
    ApplyMigrations(host.Services);

    // run the host (will run hosted services including OrderProcessingWorker)
    await host.RunAsync();
    return;
}

// fallback: default to api
throw new Exception("RUN_MODE inválido. Use 'api' ou 'worker'.");
