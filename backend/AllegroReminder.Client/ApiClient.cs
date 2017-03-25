using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AllegroReminder.Model;
using RestSharp;

namespace AllegroReminder.Client
{
    public class ApiClient
    {
        private RestClient apiClient;

        public ApiClient(string apiUrl)
        {
            apiClient = new RestClient(apiUrl);
        }

        public BidsSet GetBought(string accessToken)
        {
            var request = new RestRequest("v1/allegro/my/bids/bought", Method.GET);
            request.AddParameter("access_token", accessToken);

            IRestResponse<BidsSet> response = apiClient.Execute<BidsSet>(request);

            return response.Data;
        }

        public BidsSet GetWatched(string accessToken)
        {
            var request = new RestRequest("v1/allegro/my/watched/active?access_token" + accessToken, Method.GET);
          //  request.AddParameter("access_token", accessToken);

            IRestResponse<BidsSet> response = apiClient.Execute<BidsSet>(request);

            return response.Data;
        }
    }
}
