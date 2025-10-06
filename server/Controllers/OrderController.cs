using Microsoft.AspNetCore.Mvc;
using OrdersFlow.Models;
using OrdersFlow.Services;

namespace OrdersFlow.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly OrderService _service;

        public OrderController(OrderService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _service.GetAll());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id) => Ok(await _service.GetById(id));

        [HttpPost]
        public async Task<IActionResult> Create(Order order) => Ok(await _service.Create(order));

        [HttpPut]
        public async Task<IActionResult> Update(Order order) => Ok(await _service.Update(order));

        [HttpDelete("{id}")]
        public async Task<IActionResult> Cancel(int id)
        {
            await _service.Cancel(id);
            return NoContent();
        }
    }
}
