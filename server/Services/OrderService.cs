// Services/OrderService.cs
using OrdersFlow.Models;
using OrdersFlow.Repositorys;

namespace OrdersFlow.Services
{
    public class OrderService
    {
        private readonly IOrderRepository _repository;
        private readonly InMemoryOrderQueue _queue;

        public OrderService(IOrderRepository repository, InMemoryOrderQueue queue)
        {
            _repository = repository;
            _queue = queue;
        }

        public Task<List<Order>> GetAll() => _repository.GetAllOrders();
        public Task<Order> GetById(int id) => _repository.GetOrderById(id);

        public async Task<Order> Create(Order order)
        {
            var createdOrder = await _repository.CreateOrder(order);

            // Publica na fila (simula Service Bus)
            _queue.Enqueue(createdOrder);

            return createdOrder;
        }

        public Task<Order> Update(Order order) => _repository.UpdateOrder(order);
        public Task Cancel(int id) => _repository.CancelOrder(id);
    }
}
