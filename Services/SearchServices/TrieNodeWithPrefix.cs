namespace Ecommerce_Server.Services.SearchServices
{
    public class TrieNodeWithPrefix
    {

        public TrieNode Node { get; set; }
        public string Prefix { get; set; }

        public TrieNodeWithPrefix(TrieNode node, string prefix)
        {
            Node = node;
            Prefix = prefix;
        }
    }
}
