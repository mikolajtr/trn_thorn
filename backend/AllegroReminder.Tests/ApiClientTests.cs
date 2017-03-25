using AllegroReminder.Client;
using NUnit.Framework;

namespace AllegroReminder.Tests
{
    [TestFixture]
    public class ApiClientTests
    {
        [Test]
        public void ShouldReturnAccessToken()
        {
            var client = new AllegroApiClient(new ApiClientArgs
            {
                ClientId = "a41f5b2a-8e87-4b8b-b6fe-74cc763720d7",
                ClientSecret = "bxbb2gFqCP1aM3kNPeptAWQMGz9gosbe9JCO1sqlp0BhY9G4UufpkXgsSFQYE545",
                ApiUrl = "https://api.natelefon.pl/",
                OffersUrl = "https://allegroapi.io",
                TokenUrl = "https://ssl.allegro.pl/auth/oauth/token"
            });
            var token = client.AuthenticateUser("mikolajtr2", "Passworsadadd1!");
        }
    }
}
