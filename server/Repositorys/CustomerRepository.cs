// Repositorys/ICustomerRepository.cs
using Microsoft.EntityFrameworkCore;
using OrdersFlow.Data;
using OrdersFlow.Models;


namespace OrdersFlow.Repositorys
{
    public interface ICustomerRepository
    {
        Task<List<Customer>> GetAllCustomers();
        Task<Customer> GetCustomerById(int id);
        Task<Customer> CreateCustomer(Customer customer);
        Task<Customer> UpdateCustomer(Customer customer);
        Task DeleteCustomer(int id);
    }


    public class CustomerRepository : ICustomerRepository
    {
        private readonly AppDbContext _context;
        public CustomerRepository(AppDbContext context) => _context = context;

        public async Task<List<Customer>> GetAllCustomers() =>
            await _context.Customers.Include(c => c.Orders).ToListAsync();

        public async Task<Customer> GetCustomerById(int id) =>
            await _context.Customers.Include(c => c.Orders).FirstOrDefaultAsync(c => c.id == id);

        public async Task<Customer> CreateCustomer(Customer customer)
        {
            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();
            return customer;
        }

        public async Task<Customer> UpdateCustomer(Customer customer)
        {
            _context.Entry(customer).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return customer;
        }

        public async Task DeleteCustomer(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer != null)
            {
                _context.Customers.Remove(customer);
                await _context.SaveChangesAsync();
            }
        }
    }
}
