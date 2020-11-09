using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using contribution.Models;
using contribution.Persistance;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace contribution.Controllers
{
    [Route("/api/members")]
    public class MembersController : Controller
    {
        private ControDbContext _context { get; set; }

        public MembersController(ControDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IEnumerable<Member>> getAll()
        {
            try
            {
                var members = await _context.Members.ToListAsync();
                return members;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet("{id}")]
        public async Task<Member> getById(int Id)
        {
            var member = await _context.Members.SingleOrDefaultAsync(m => m.Id == Id);

            if (member == null)
                return null;

            return member;
        }

        [HttpPost]
        public async Task<ActionResult> post([FromBody] Member member)
        {
            try
            {
                _context.Members.Add(member);
                _context.SaveChanges();

                var members = await _context.Members.SingleOrDefaultAsync(m => m.Phone == member.Phone && m.Name == member.Name);
                return Ok(members);
            }
            catch (Exception)
            {
                return BadRequest();
            }

        }

        [HttpPut("{id}")]
        public void Update(int Id, [FromBody] Member member)
        {
            var memberDb = _context.Members.Find(Id);

            try
            {
                memberDb.Name = member.Name;
                memberDb.Phone = member.Phone;
                memberDb.Country = member.Country;
                _context.SaveChanges();

            }
            catch (Exception)
            {
            }
        }

        [HttpDelete("{id}")]
        public void Delete(int Id)
        {
            var member = _context.Members.Find(Id);

            if (member != null)
            {
                _context.Members.Remove(member);
                _context.SaveChanges();
            }
        }

    }
}