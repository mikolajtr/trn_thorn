using System.Web.Http;

namespace AllegroReminder.Api.Controllers
{
    [RoutePrefix("Version")]
    public class VersionController : ApiController
    {
        [Route("")]
        [HttpGet]
        public string Index()
        {
            return "Release 1.0";
        }
    }
}