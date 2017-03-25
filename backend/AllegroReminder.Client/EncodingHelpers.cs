using System;
using System.Security.Cryptography;
using System.Text;

namespace AllegroReminder.Client
{
    public static class EncodingHelpers
    {
        public static string ToBase64(this string text)
        {
            var bytes = Encoding.UTF8.GetBytes(text);
            var encodedText = Convert.ToBase64String(bytes);

            return encodedText;
        }

        public static byte[] ToSha256Bytes(this string inputString)
        {
            SHA256 sha256 = SHA256.Create();
            byte[] bytes = Encoding.UTF8.GetBytes(inputString);
            byte[] hash = sha256.ComputeHash(bytes);
            return hash;
        }
    }
}
