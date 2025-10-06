// Repositorys/IOrderRepository.cs
using Microsoft.EntityFrameworkCore;
using OrdersFlow.Data;
using OrdersFlow.Models;



namespace OrdersFlow.Repositorys
{

    public interface IOrderRepository
    {
        Task<List<Order>> GetAllOrders();
        Task<Order> GetOrderById(int id);
        Task<Order> CreateOrder(Order order);
        Task<Order> UpdateOrder(Order order);
        Task CancelOrder(int id);
    }

    public class OrderRepository : IOrderRepository
    {
        private readonly AppDbContext _context;
        public OrderRepository(AppDbContext context) => _context = context;

        public async Task<List<Order>> GetAllOrders() =>
            await _context.Orders.Include(o => o.Customer).Include(o => o.Product).ToListAsync();

        public async Task<Order> GetOrderById(int id)
        {
            return await _context.Orders.Include(o => o.Customer).Include(o => o.Product)
                                 .FirstOrDefaultAsync(o => o.Id == id);
        }

        public async Task<Order> CreateOrder(Order order)
        {
            _context.Attach(order.Customer);
            _context.Attach(order.Product);

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            return order;
        }


        public async Task<Order> UpdateOrder(Order order)
        {
            _context.Entry(order).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return order;
        }

        public async Task CancelOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order != null)
            {
                order.active = false;
                _context.Entry(order).Property(o => o.active).IsModified = true;
                await _context.SaveChangesAsync();
            }
        }
    }
}
