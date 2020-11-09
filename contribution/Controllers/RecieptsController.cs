using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using contribution.Models;
using contribution.Persistance;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace contribution.Controllers
{
    [Route("/api/reciepts")]
    public class RecieptsController : Controller
    {
        private ControDbContext _context;

        public RecieptsController(ControDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IEnumerable<Reciept>> getALl()
        {
            return await _context.Reciepts.Include(r => r.Member).Include(r => r.Bank).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<Reciept> getById(int Id)
        {
            return await _context.Reciepts.SingleOrDefaultAsync(r => r.Id == Id);
        }

        [HttpPost]
        public ActionResult insert([FromBody] Reciept reciept)
        {
            try
            {
                _context.Reciepts.Add(reciept);
                _context.SaveChanges();

                return Ok(reciept);
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        [HttpPut("{id}")]
        public async Task<Reciept> update(int Id, [FromBody] Reciept reciept)
        {
            var recieptDb = await _context.Reciepts.SingleOrDefaultAsync(r => r.Id == Id);

            if (recieptDb != null)
            {
                recieptDb.MemberId = reciept.MemberId;
                recieptDb.Amount = reciept.Amount;
                recieptDb.Date = DateTime.Now;
                recieptDb.BankId = reciept.BankId;

                _context.SaveChanges();
            }

            return recieptDb;
        }

        [HttpDelete("{id}")]
        public void delete(int Id)
        {
            var reciept = _context.Reciepts.Find(Id);
            _context.Reciepts.Remove(reciept);
            _context.SaveChanges();
        }
    }
}