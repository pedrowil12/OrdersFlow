// Services/CustomerService.cs
using OrdersFlow.Models;
using OrdersFlow.Repositorys;

namespace OrdersFlow.Services
{
    public class CustomerService
    {
        private readonly ICustomerRepository _repository;
        public CustomerService(ICustomerRepository repository) => _repository = repository;

        public Task<List<Customer>> GetAll() => _repository.GetAllCustomers();
        public Task<Customer> GetById(int id) => _repository.GetCustomerById(id);
        public Task<Customer> Create(Customer customer) => _repository.CreateCustomer(customer);
        public Task<Customer> Update(Customer customer) => _repository.UpdateCustomer(customer);
        public Task Delete(int id) => _repository.DeleteCustomer(id);
    }
}
