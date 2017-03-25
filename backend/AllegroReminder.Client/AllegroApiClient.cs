using System;
using System.Collections.Generic;
using System.Net;
using AllegroReminder.Model;
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
        private RestClient apiClient;
        private RestClient offersClient;

        public string AccessToken { get; private set; }

        public AllegroApiClient(ApiClientArgs args)
        {
            tokenUrl = args.TokenUrl;
            clientId = args.ClientId;
            clientSecret = args.ClientSecret;
            apiUrl = args.ApiUrl;
            offersUrl = args.OffersUrl;
            apiClient = new RestClient(apiUrl);
            offersClient = new RestClient(offersUrl);
            AccessToken = GetAccessToken();
        }

        public AuthenticationResult AuthenticateUser(string username, string password)
        {
            var result = new AuthenticationResult();

            var request = new RestRequest("/v1/allegro/login", Method.POST);
            request.AddHeader("authorization", $"Bearer {AccessToken}");
            request.AddParameter("userLogin", username);
            var hash = password.ToSha256Bytes();
            var base64 = Convert.ToBase64String(hash);
            request.AddParameter("hashPass", base64);

            IRestResponse<Dictionary<string, string>> response = apiClient.Execute<Dictionary<string, string>>(request);

            result.StatusCode = response.StatusCode;

            if (response.StatusCode == HttpStatusCode.OK)
            {
                result.UserId = response.Data["userId"];
            }
            else
            {
                result.ErrorMessage = response.Data["userMessage"];
            }

            return result;
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
