using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace OrdersFlow.Models
{
    public enum OrderStatus
    {
        Pendente,
        Processando,
        Finalizado
    }

    public class Order
    {
        public int Id { get; set; }

        // Usando enum para Status
        public OrderStatus Status { get; set; } = OrderStatus.Pendente;

        public int Quantity { get; set; }

        public decimal Price { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        public int ProductId { get; set; }

        public int CustomerId { get; set; }

        public bool active { get; set; } = true;

        public Product Product { get; set; } = null!;

        public Customer Customer { get; set; } = null!;

        // Simula dados do Service Bus
        [NotMapped] // EF não precisa mapear isso
        public Guid CorrelationId { get; set; } = Guid.NewGuid();

        [NotMapped]
        public string EventType { get; set; } = "OrderCreated";
    }
}
