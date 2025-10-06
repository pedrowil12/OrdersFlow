using System.Text.Json.Serialization;

namespace OrdersFlow.Models
{
    public class Product
    {
        public int id { get; set; }

        public string name { get; set; } = string.Empty;

        public string description { get; set; } = string.Empty;

        public decimal price { get; set; }

        public bool active { get; set; }

        [JsonIgnore]
        public ICollection<Order> Orders { get; set; } = new List<Order>();

    }
}
