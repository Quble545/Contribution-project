using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using contribution.Models;
using contribution.Persistance;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace contribution.Controllers
{
    [Route("/api/login")]
    public class TokenController : Controller
    {
        private readonly ControDbContext _context;
        public TokenController(ControDbContext context)
        {
            _context = context;

        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] User user)
        {
            if (await IsValidUser(user.Username, user.Password))
            {
                return new ObjectResult(await GenerateToken(user.Username));
            }
            else
            {
                return BadRequest("Invalid username or password");
            }
        }

        public async Task<bool> IsValidUser(string username, string password)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Username == username && u.Password == password);

            return user == null ? false : true;
        }

        public async Task<dynamic> GenerateToken(string username)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Username == username);
            var claims = new List<Claim>
            {
                new Claim("username", username),
                new Claim("id", user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Nbf, new DateTimeOffset(DateTime.Now).ToUnixTimeSeconds().ToString()),
                new Claim(JwtRegisteredClaimNames.Exp, new DateTimeOffset(DateTime.Now.AddDays(1)).ToUnixTimeSeconds().ToString())
            };

            var token = new JwtSecurityToken(
                new JwtHeader(
                    new SigningCredentials(
                        new SymmetricSecurityKey(Encoding.UTF8.GetBytes("14916F529E457B82EF438A51DB064B31ACDBD2505725FCA42606B428B2DBB7C9")),
                        SecurityAlgorithms.HmacSha256
                    )
                ),
                new JwtPayload(claims)
            );

            var output = new
            {
                Access_token = new JwtSecurityTokenHandler().WriteToken(token),
                Username = username
            };

            return output;

        }
    }
}