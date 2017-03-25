using System.Data.Entity;
using AllegroReminder.Model;

namespace AllegroReminder.DataAccess
{
    public class ReminderContext : DbContext
    {
        public ReminderContext() : base("AllegroReminder")
        {
        }

        public IDbSet<AccessToken> AccessTokens { get; set; }
    }
}
