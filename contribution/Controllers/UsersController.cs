using System.Threading.Tasks;
using contribution.Models;
using contribution.Persistance;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace contribution.Controllers
{
    [Route("/api/users")]
    public class UsersController : Controller
    {
        public ControDbContext _context { get; set; }

        public UsersController(ControDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult> getAll()
        {
            return Ok(await _context.Users.ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> getById(int Id)
        {
            return Ok(await _context.Users.SingleOrDefaultAsync(u => u.Id == Id));
        }

        [HttpPost]
        public async Task<ActionResult> insert([FromBody] User user)
        {
            var userDb = _context.Users.SingleOrDefaultAsync(u => u.Username == user.Username);

            if (userDb.Result == null)
            {
                await _context.Users.AddAsync(user);
                await _context.SaveChangesAsync();

                return Ok(user);
            }

            return BadRequest("User already exist");
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> update(int Id, [FromBody] User user)
        {
            var userDb = _context.Users.SingleOrDefaultAsync(u => u.Id == Id);

            if (userDb.Result != null)
            {
                userDb.Result.Username = user.Username;
                userDb.Result.Password = user.Password;

                await _context.SaveChangesAsync();
            }

            return Ok(user);
        }

        [HttpDelete("{id}")]
        public void delete(int Id)
        {
            var user = _context.Users.Find(Id);

            _context.Users.Remove(user);
            _context.SaveChangesAsync();
        }
    }
}