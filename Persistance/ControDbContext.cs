using contribution.Models;
using Microsoft.EntityFrameworkCore;

namespace contribution.Persistance
{
    public class ControDbContext : DbContext
    {
        public DbSet<Member> Members { get; set; }
        public DbSet<Reciept> Reciepts { get; set; }
        public DbSet<BankAccount> Banks { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<User> Users { get; set; }
        public ControDbContext(DbContextOptions<ControDbContext> options)
            : base(options)
        {

        }
    }
}