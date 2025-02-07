using Microsoft.Identity.Client;

namespace Ecommerce_Server.Services
{
    public class JwtOptions
    {
        public string Issuer { get; set; }
        public string Audience { get; set; }
        public int Lifetime { get; set; }
        public string SigningKey { get; set; }
    }

}
