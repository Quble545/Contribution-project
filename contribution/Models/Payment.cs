using System;

namespace contribution.Models
{
    public class Payment
    {
        public int Id { get; set; }
        public int Amount { get; set; }
        public string Purpose { get; set; }
        public DateTime Date { get; set; }
    }
}