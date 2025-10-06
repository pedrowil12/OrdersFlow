using Microsoft.EntityFrameworkCore;
using OrdersFlow.Models;

namespace OrdersFlow.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public DbSet<Order> Orders { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Product> Products { get; set; }

        // Adicione este método para configurar o mapeamento
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder); // É uma boa prática chamar a implementação base

            // Diz ao EF Core para tratar a propriedade 'Status' do 'Order' como uma string no banco
            modelBuilder.Entity<Order>()
                .Property(o => o.Status)
                .HasConversion<string>();
        }
    }
}