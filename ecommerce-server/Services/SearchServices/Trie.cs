namespace Ecommerce_Server.Services.SearchServices
{
    public static class Trie
    {
        private static readonly TrieNode root;

        // Static constructor to initialize the root node
        static Trie()
        {
            root = new TrieNode();
        }

        // Insert a word into the trie
        public static void Insert(string word)
        {
            var currentNode = root;

            foreach (char ch in word.ToLower())
            {
                if (!currentNode.Children.ContainsKey(ch))
                {
                    currentNode.Children[ch] = new TrieNode(ch);
                }
                currentNode = currentNode.Children[ch];
            }

            currentNode.IsEndOfWord = true;
        }

        public static List<string> Search(string query)
        {
            query = query.ToLower().Trim();
            List<string> result = new List<string>();
            string prefix = "";
            var currentNode = root;

            foreach (char ch in query)
            {

                if (!currentNode.Children.ContainsKey(ch))
                {
                    List<string> suggestionsWords = new List<string>();
                    suggestionsWords = GetSuggestion(prefix, currentNode);
                    foreach (string word in suggestionsWords)
                    {
                        int numOperation = query.Length > 6 ? 3 : 2;
                        string wordValue = word.Length > query.Length ? word.Substring(0, query.Length) : word;
                        if (Levenshtein_Distance(wordValue, query) <= numOperation)
                        {
                            result.Add(word);
                        }
                    }
                    return result; // fuzzy algorithm
                }
                prefix += ch;
                currentNode = currentNode.Children[ch];
            }
            if (currentNode.IsEndOfWord)
            {
                result.Add(prefix);
                return result;  // return excat word
            }
            else
            {

                return GetSuggestion(prefix, currentNode); // return recommendation
            }
        }

        public static List<string> GetSuggestion(string prefix, TrieNode currentNode)
        {
            List<string> result = new List<string>();


            Queue<TrieNodeWithPrefix> queue = new Queue<TrieNodeWithPrefix>();

            foreach (var node in currentNode.Children) queue.Enqueue(new TrieNodeWithPrefix(node.Value, prefix + node.Key));


            while (queue.Count != 0 && result.Count < 10)
            {
                var NodeQueue = queue.Peek();
                if (NodeQueue.Node.IsEndOfWord) result.Add(NodeQueue.Prefix);
                foreach (var childrenNode in NodeQueue.Node.Children) queue.Enqueue(new TrieNodeWithPrefix(childrenNode.Value, NodeQueue.Prefix + childrenNode.Key));
                queue.Dequeue();
            }
            return result;
        }


        public static int Levenshtein_Distance(string word1, string word2)
        {

            int m = word1.Length;
            int n = word2.Length;

            if (Math.Abs(m - n) > 3) return int.MaxValue;

            // Create a 2D matrix to store the distance values
            int[,] matrix = new int[m + 1, n + 1];


            // Initialize the first row and column
            for (int i = 0; i <= m; i++) matrix[i, 0] = i;
            for (int j = 0; j <= n; j++) matrix[0, j] = j;

            for (int i = 1; i <= m; i++)
            {
                for (int j = 1; j <= n; j++)
                {
                    if (word1[i - 1] == word2[j - 1])
                    {
                        matrix[i, j] = matrix[i - 1, j - 1];
                    }
                    else
                    {
                        int cost = Math.Min(Math.Min(matrix[i - 1, j], matrix[i - 1, j - 1]), matrix[i, j - 1]);
                        matrix[i, j] = cost + 1;
                    }
                }
            }

            return matrix[m, n];
        }
    
    }
}
