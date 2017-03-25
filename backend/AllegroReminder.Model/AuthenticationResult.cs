using System.Net;

namespace AllegroReminder.Model
{
    public class AuthenticationResult
    {
        public string UserId { get; set; }
        public string ErrorMessage { get; set; }
        public HttpStatusCode StatusCode { get; set; }
    }
}
