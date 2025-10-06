// Controllers/ProductController.cs
using Microsoft.AspNetCore.Mvc;
using OrdersFlow.Models;
using OrdersFlow.Services;

namespace OrdersFlow.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly ProductService _service;
        public ProductController(ProductService service) => _service = service;

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _service.GetAll());

        [HttpPost]
        public async Task<IActionResult> Create(Product product) => Ok(await _service.Create(product));

        [HttpPut]
        public async Task<IActionResult> Update(Product product)
        {
            await _service.Update(product);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Disable(int id)
        {
            await _service.Disable(id);
            return NoContent();
        }
    }
}
