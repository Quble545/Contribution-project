using System.Collections.Generic;
using System.Threading.Tasks;
using contribution.Models;
using contribution.Persistance;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace contribution.Controllers
{
    [Route("/api/payments")]
    public class PaymentsController : Controller
    {
        public ControDbContext _context { get; set; }

        public PaymentsController(ControDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IEnumerable<Payment>> getAll()
        {
            return await _context.Payments.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<Payment> getById(int Id)
        {
            return await _context.Payments.SingleOrDefaultAsync(p => p.Id == Id);
        }

        [HttpPost]
        public ActionResult insert([FromBody] Payment payment)
        {
            try
            {
                _context.Payments.Add(payment);
                _context.SaveChanges();

                return Ok(payment);
            }
            catch (System.Exception)
            {
                return BadRequest();
            }
        }

        [HttpPut("{id}")]
        public ActionResult update(int Id, [FromBody] Payment payment)
        {
            var paymentDb = _context.Payments.Find(Id);

            if (paymentDb != null)
            {
                paymentDb.Amount = payment.Amount;
                paymentDb.Purpose = payment.Purpose;

                _context.SaveChanges();
            }

            return Ok(payment);

        }

        [HttpDelete("{id}")]
        public void delete(int Id)
        {
            var payment = _context.Payments.Find(Id);
            _context.Remove(payment);
            _context.SaveChanges();

        }
    }
}