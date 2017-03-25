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

        public static string ToSha256(this string inputString)
        {
            SHA256 sha256 = SHA256.Create();
            byte[] bytes = Encoding.UTF8.GetBytes(inputString);
            byte[] hash = sha256.ComputeHash(bytes);
            return GetStringFromHash(hash);
        }

        private static string GetStringFromHash(byte[] hash)
        {
            StringBuilder result = new StringBuilder();
            for (int i = 0; i < hash.Length; i++)
            {
                result.Append(hash[i].ToString("X2"));
            }
            return result.ToString();
        }
    }
}
