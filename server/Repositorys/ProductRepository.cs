using Microsoft.EntityFrameworkCore;
using OrdersFlow.Data;
using OrdersFlow.Models;

namespace OrdersFlow.Repositorys
{
    public interface IProductRepository
    {
        Task<List<Product>> GetAllProducts();
        Task<Product> CreateProduct(Product product);
        Task<Product> UpdateProduct(Product product);
        Task DisableProduct(int idProduct);
    }
    public class ProductRepository : IProductRepository
    {
        private readonly AppDbContext _context;

        public ProductRepository(AppDbContext context) { 
            _context = context;
        }

        public async Task<List<Product>> GetAllProducts()
        {
            var products = await _context.Products.ToListAsync();

            return products;
        }

        public async Task<Product> CreateProduct(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task<Product> UpdateProduct(Product product)
        {
            _context.Entry(product).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task DisableProduct(int idProduct)
        {
            var product = new Product { id = idProduct, active = false };

            _context.Attach(product);

            _context.Entry(product).Property(p => p.active).IsModified = true;

            await _context.SaveChangesAsync();
        }

    }
}
