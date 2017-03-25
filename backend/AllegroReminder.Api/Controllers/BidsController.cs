using System;
using System.Web.Configuration;
using System.Web.Http;
using AllegroReminder.Api.Models;
using AllegroReminder.Client;
using AllegroReminder.Model;
using RestSharp;

namespace AllegroReminder.Api.Controllers
{
    [RoutePrefix("Bids")]
    public class BidsController : ApiController
    {
        private ApiClient apiClient;

        public BidsController()
        {
            apiClient = new ApiClient(WebConfigurationManager.AppSettings["apiUrl"]);
        }

        [Route("Bought")]
        [HttpPost]
        public BidsSet Bought(TokenParameter token)
        {
            return apiClient.GetBought(token.AccessToken);
        } 
    }
}