export interface WeekMeta {
  week: number;
  title: string;
  topics: string[];
}

/** Mirrors the WeekNN.md topic headings. Used for the syllabus picker + exam blueprint. */
export const SYLLABUS: WeekMeta[] = [
  {
    week: 1,
    title: "Simulation, Invariants, Search & Number Theory",
    topics: ["Reversort", "Invariants", "Linear/Binary search", "GCD & number theory"],
  },
  {
    week: 2,
    title: "Sorting Invariants & Binary Search on the Answer",
    topics: ["Sorting invariants", "Merge/quick ideas", "Binary search on answer", "Monotonicity"],
  },
  {
    week: 3,
    title: "Greedy Strategies, Exchange Arguments & Stable Matchings",
    topics: ["Greedy", "Exchange argument", "Scheduling", "Stable matching (Gale-Shapley)"],
  },
  {
    week: 4,
    title: "Disjoint Set Union (DSU) & Offline Time-Reversal",
    topics: ["DSU / union-find", "Path compression", "Offline queries", "Time reversal"],
  },
  {
    week: 5,
    title: "Graph Traversals, Bipartite Graphs & BFS Level Invariants",
    topics: ["BFS/DFS", "Bipartite check", "2-colouring", "Level invariants"],
  },
  {
    week: 6,
    title: "Shortest Paths: BFS, Dijkstra, Bellman-Ford & Floyd-Warshall",
    topics: ["Dijkstra", "0-1 BFS", "Bellman-Ford", "Floyd-Warshall"],
  },
  {
    week: 7,
    title: "Minimum Spanning Trees (MST) & Directed Arborescences",
    topics: ["Kruskal", "Prim", "Cut/cycle property", "Directed MST (Edmonds)"],
  },
  {
    week: 8,
    title: "Network Flow Foundations, Residual Graphs & Reductions",
    topics: ["Max-flow", "Residual graph", "Augmenting paths", "Modelling/reductions"],
  },
  {
    week: 9,
    title: "MaxFlow-MinCut Duality, Police Chase & König's Vertex Cover",
    topics: ["MaxFlow-MinCut", "Cut recovery", "König's theorem", "Bipartite vertex cover"],
  },
  {
    week: 10,
    title: "Dynamic Programming Foundations: DAGs, Recurrences & State Design",
    topics: ["Memoization", "Tabulation", "State design", "Count transitions / modulo"],
  },
];

export const weekTitle = (w: number) => SYLLABUS.find((s) => s.week === w)?.title ?? `Week ${w}`;
