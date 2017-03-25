using System.Net;
using System.Net.Http;
using System.Web.Http;
using AllegroReminder.Api.Models;
using AllegroReminder.Api.Utils;
using AllegroReminder.Client;
using AllegroReminder.Model;

namespace AllegroReminder.Api.Controllers
{
    [RoutePrefix("Auth")]
    public class AuthController : ApiController
    {
        private AuthClient apiClient;

        public AuthController()
        {
            apiClient = new AuthClient(SettingsHelpers.GetApiClientArgs());
        }

        [Route("Login")]
        [HttpPost]
        public HttpResponseMessage Login(LoginInformations loginInformations)
        {
            var authResult = apiClient.AuthenticateUser(
                loginInformations.Username,
                loginInformations.Password);

            var message = new HttpResponseMessage(authResult.StatusCode);

            if (authResult.StatusCode != HttpStatusCode.OK)
            {
                message.Content = new StringContent(authResult.ErrorMessage);
                return message;
            }
            return Request.CreateResponse(HttpStatusCode.OK,
                new Credentials
                {
                    UserId = authResult.UserId,
                    AccessToken = apiClient.AccessToken
                }, 
                Configuration.Formatters.JsonFormatter);
        }
    }
}