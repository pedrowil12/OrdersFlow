using Microsoft.Extensions.Hosting;
using OrdersFlow.Models;
using OrdersFlow.Repositorys;

namespace OrdersFlow.Services
{
    public class OrderProcessingWorker : BackgroundService
    {
        private readonly InMemoryOrderQueue _queue;
        private readonly IServiceProvider _serviceProvider;

        public OrderProcessingWorker(InMemoryOrderQueue queue, IServiceProvider serviceProvider)
        {
            _queue = queue;
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                if (_queue.TryDequeue(out var order))
                {
                    using var scope = _serviceProvider.CreateScope();
                    var repository = scope.ServiceProvider.GetRequiredService<IOrderRepository>();

                    if (order.Status != OrderStatus.Pendente) continue;

                    order.Status = OrderStatus.Processando;
                    await repository.UpdateOrder(order);

                    // Simula processamento de 5 segundos
                    await Task.Delay(5000, stoppingToken);

                    order.Status = OrderStatus.Finalizado;
                    await repository.UpdateOrder(order);
                }

                // Sempre espera 5 segundos antes de pegar o próximo
                await Task.Delay(5000, stoppingToken);
            }

        }
    }
}
