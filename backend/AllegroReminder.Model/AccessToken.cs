using System;

namespace AllegroReminder.Model
{
    public class AccessToken
    {
        public int Id { get; set; }
        public string Token { get; set; }
        public DateTime ExpirationDate { get; set; }
    }
}
