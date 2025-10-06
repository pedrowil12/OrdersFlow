using OrdersFlow.Models;
using System.Collections.Concurrent;

namespace OrdersFlow.Services
{
    public class InMemoryOrderQueue
    {
        private readonly ConcurrentQueue<Order> _queue = new();

        public void Enqueue(Order order) => _queue.Enqueue(order);

        public bool TryDequeue(out Order order) => _queue.TryDequeue(out order);
    }
}
