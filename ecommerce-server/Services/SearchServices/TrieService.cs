
    namespace Ecommerce_Server.Services.SearchServices
    {
        public class TrieService
        {
            private static TrieService? instance = null;
            private static readonly object lockObj = new object();
            private readonly TrieNode root;

            // Private constructor to initialize root
            private TrieService()
            {
                root = new TrieNode();
            }

            // Singleton access method
            public static TrieService GetInstance()
            {
                if (instance == null)
                {
                    lock (lockObj)
                    {
                        if (instance == null)
                        {
                            instance = new TrieService();
                        }
                    }
                }
                return instance;
            }

            // Insert a word into the Trie
            public void Insert(string word)
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

            // Search with fuzzy matching and suggestions
            public List<string> Search(string query)
            {
                query = query.ToLower().Trim();
                List<string> result = new List<string>();
                string prefix = "";
                var currentNode = root;

                foreach (char ch in query)
                {
                    if (!currentNode.Children.ContainsKey(ch))
                    {
                        var suggestionsWords = GetSuggestion(prefix, currentNode);
                        foreach (string word in suggestionsWords)
                        {
                            int numOperation = query.Length > 6 ? 3 : 2;
                            string wordValue = word.Length > query.Length ? word.Substring(0, query.Length) : word;
                            if (Levenshtein_Distance(wordValue, query) <= numOperation)
                            {
                                result.Add(word);
                            }
                        }
                        return result;
                    }
                    prefix += ch;
                    currentNode = currentNode.Children[ch];
                }

                if (currentNode.IsEndOfWord)
                {
                    result.Add(prefix); // exact match
                    return result;
                }
                else
                {
                    return GetSuggestion(prefix, currentNode); // suggestions
                }
            }

            // Get autocomplete suggestions
            private List<string> GetSuggestion(string prefix, TrieNode currentNode)
            {
                List<string> result = new List<string>();
                Queue<TrieNodeWithPrefix> queue = new Queue<TrieNodeWithPrefix>();

                foreach (var node in currentNode.Children)
                {
                    queue.Enqueue(new TrieNodeWithPrefix(node.Value, prefix + node.Key));
                }

                while (queue.Count != 0 && result.Count < 10)
                {
                    var nodeQueue = queue.Dequeue();
                    if (nodeQueue.Node.IsEndOfWord)
                        result.Add(nodeQueue.Prefix);

                    foreach (var child in nodeQueue.Node.Children)
                    {
                        queue.Enqueue(new TrieNodeWithPrefix(child.Value, nodeQueue.Prefix + child.Key));
                    }
                }

                return result;
            }

            // Fuzzy matching using Levenshtein Distance
            private int Levenshtein_Distance(string word1, string word2)
            {
                int m = word1.Length, n = word2.Length;
                if (Math.Abs(m - n) > 3) return int.MaxValue;

                int[,] matrix = new int[m + 1, n + 1];
                for (int i = 0; i <= m; i++) matrix[i, 0] = i;
                for (int j = 0; j <= n; j++) matrix[0, j] = j;

                for (int i = 1; i <= m; i++)
                {
                    for (int j = 1; j <= n; j++)
                    {
                        if (word1[i - 1] == word2[j - 1])
                            matrix[i, j] = matrix[i - 1, j - 1];
                        else
                            matrix[i, j] = 1 + Math.Min(Math.Min(matrix[i - 1, j], matrix[i, j - 1]), matrix[i - 1, j - 1]);
                    }
                }

                return matrix[m, n];
            }
        public bool Remove(string word)
        {
            return Remove(root, word.ToLower(), 0);
        }

        private bool Remove(TrieNode current, string word, int index)
        {
            if (index == word.Length)
            {
                if (!current.IsEndOfWord)
                    return false; // Word not found

                current.IsEndOfWord = false;
                return current.Children.Count == 0; // If leaf node, it can be deleted
            }

            char ch = word[index];
            if (!current.Children.ContainsKey(ch))
                return false; // Word not found

            bool shouldDeleteChild = Remove(current.Children[ch], word, index + 1);

            if (shouldDeleteChild)
            {
                current.Children.Remove(ch);

                // Return true if no children and not end of another word
                return current.Children.Count == 0 && !current.IsEndOfWord;
            }

            return false;
        }

    }
}


