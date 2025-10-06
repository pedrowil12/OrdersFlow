using System.Text.Json.Serialization;

namespace OrdersFlow.Models
{
    public class Customer
    {
        public int id { get; set; }

        public string name { get; set; } = string.Empty;

        public string address { get; set; } = string.Empty;

        public string phone { get; set; } = string.Empty;

        [JsonIgnore]
        public ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}
