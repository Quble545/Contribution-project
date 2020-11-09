using System;

namespace contribution.Models
{
    public class Reciept
    {
        public int Id { get; set; }
        public Member Member { get; set; }
        public int MemberId { get; set; }
        public BankAccount Bank { get; set; }
        public int BankId { get; set; }
        public int Amount { get; set; }
        public DateTime Date { get; set; }
    }
}