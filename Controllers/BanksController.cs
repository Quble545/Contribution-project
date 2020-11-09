using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using contribution.Models;
using contribution.Persistance;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace contribution.Controllers
{
    [Route("/api/banks")]
    public class BanksController : Controller
    {
        private ControDbContext _context;

        public BanksController(ControDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IEnumerable<BankAccount>> getAll()
        {
            return await _context.Banks.ToListAsync();
        }
    }
}