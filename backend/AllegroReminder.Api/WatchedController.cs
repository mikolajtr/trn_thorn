using AllegroReminder.Client;
using System.Web.Configuration;
using System.Web.Http;
using AllegroReminder.Api.Models;
using AllegroReminder.Model;

namespace AllegroReminder.Api
{
    [RoutePrefix("Watched")]
    public class WatchedController : ApiController
    {
        private ApiClient apiClient;

        public WatchedController()
        {
            apiClient = new ApiClient(WebConfigurationManager.AppSettings["apiUrl"]);
        }

        [HttpPost]
        [Route("Active")]
        public BidsSet Active(TokenParameter token)
        {
            return apiClient.GetWatched(token.AccessToken);
        }
    }
}