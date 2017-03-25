using System.Web.Http;
using AllegroReminder.Api.Utils;
using AllegroReminder.Client;

namespace AllegroReminder.Api.Controllers
{
    [RoutePrefix("Auth")]
    public class AuthController : ApiController
    {
        private AllegroApiClient apiClient;

        public AuthController()
        {
            apiClient = new AllegroApiClient(SettingsHelpers.GetApiClientArgs());
        }

        [HttpPost]
        [Route("Code")]
        public string AuthorizeWithCode(string authorizationCode)
        {
            var userToken = apiClient.AuthenticateUserWithCode(authorizationCode);
            return userToken;
        }
    }
}