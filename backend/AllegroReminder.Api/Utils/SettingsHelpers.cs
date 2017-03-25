using System.Web.Configuration;
using AllegroReminder.Client;

namespace AllegroReminder.Api.Utils
{
    public static class SettingsHelpers
    {
        public static ApiClientArgs GetApiClientArgs()
        {
            return new ApiClientArgs
            {
                ClientId = WebConfigurationManager.AppSettings["clientId"],
                ClientSecret = WebConfigurationManager.AppSettings["clientSecret"],
                TokenUrl = WebConfigurationManager.AppSettings["tokenUrl"],
                ApiUrl = WebConfigurationManager.AppSettings["apiUrl"],
                OffersUrl = WebConfigurationManager.AppSettings["offersUrl"]
            };
        }
    }
}