namespace Ecommerce_Server.Services.SearchServices
{
    public class TrieNode
    {
        public char data;
        public bool IsEndOfWord { get; set; }
        public Dictionary<char, TrieNode> Children { get; private set; }

        public TrieNode(char ch)
        {
            data = ch;
            Children = new Dictionary<char, TrieNode>();
            IsEndOfWord = false;
        }
        public TrieNode()
        {

            Children = new Dictionary<char, TrieNode>();
            IsEndOfWord = false;
        }
    }
}
