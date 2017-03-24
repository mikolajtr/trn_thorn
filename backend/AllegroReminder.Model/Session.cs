using System;

namespace AllegroReminder.Model
{
    public class Session
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public Guid AccessToken { get; set; }
    }
}
