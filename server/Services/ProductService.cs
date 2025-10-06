// Services/ProductService.cs
using OrdersFlow.Models;
using OrdersFlow.Repositorys;

namespace OrdersFlow.Services
{
    public class ProductService
    {
        private readonly IProductRepository _repository;
        public ProductService(IProductRepository repository) => _repository = repository;

        public Task<List<Product>> GetAll() => _repository.GetAllProducts();
        public Task<Product> Create(Product product) => _repository.CreateProduct(product);
        public Task Update(Product product) => _repository.UpdateProduct(product);
        public Task Disable(int id) => _repository.DisableProduct(id);
    }
}
