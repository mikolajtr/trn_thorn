using System.Collections.Generic;
using RestSharp;

namespace AllegroReminder.Client
{
    public class AllegroApiClient
    {
        private string tokenUrl;
        private string apiUrl;
        private string offersUrl;
        private string clientId;
        private string clientSecret;
        private string accessToken;
        private RestClient apiClient;
        private RestClient offersClient;

        public AllegroApiClient(ApiClientArgs args)
        {
            this.tokenUrl = args.TokenUrl;
            this.clientId = args.ClientId;
            this.clientSecret = args.ClientSecret;
            this.apiUrl = args.ApiUrl;
            this.offersUrl = args.OffersUrl;
            this.apiClient = new RestClient(apiUrl);
            this.offersClient = new RestClient(offersUrl);
            this.accessToken = GetAccessToken();
        }

        public string AuthenticateUser(string username, string password)
        {
            var request = new RestRequest("/v1/allegro/login", Method.POST);
            request.AddHeader("authorization", $"Bearer {accessToken}");
            request.AddParameter("userLogin", username);
            request.AddParameter("hashPass", password.ToSha256().ToBase64());

            IRestResponse response = apiClient.Execute(request);

            return response.Content;
        }

        public string AuthenticateUserWithCode(string authorizationCode)
        {
            var client = new RestClient(tokenUrl);
            var request = new RestRequest(Method.POST);
            var encodedCredentials = $"{clientId}:{clientSecret}".ToBase64();
            request.AddParameter("grant_type", "authorization_code");
            request.AddHeader("code", authorizationCode);

            IRestResponse<Dictionary<string, string>> response = client.Execute<Dictionary<string, string>>(request);

            return response.Data["access_token"];
        }

        private string GetAccessToken()
        {
            var client = new RestClient(tokenUrl);
            var request = new RestRequest(Method.GET);
            var encodedCredentials = $"{clientId}:{clientSecret}".ToBase64();
            request.AddParameter("grant_type", "client_credentials");
            request.AddHeader("Authorization", $"Basic {encodedCredentials}");

            IRestResponse<Dictionary<string, string>> response = client.Execute<Dictionary<string, string>>(request);

            return response.Data["access_token"];
        }
    }
}
