// Server component with computationally expensive rendering
// This component intentionally takes several seconds to render

function isPrime(num: number) {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }
  return true;
}

function calculatePrimes(limit: number) {
  const primes: number[] = [];
  for (let i = 2; i <= limit; i++) {
    if (isPrime(i)) {
      primes.push(i);
    }
  }
  return primes;
}

function fibonacci(n: number): number {
  if (n <= 1) return n;
  let a = 0,
    b = 1;
  for (let i = 2; i <= n; i++) {
    const temp = a + b;
    a = b;
    b = temp;
  }
  return b;
}

function generateComplexData() {
  // Calculate first 10,000 primes
  const primes = calculatePrimes(100000);

  // Calculate fibonacci numbers
  const fibs = Array.from({ length: 100 }, (_, i) => fibonacci(i));

  // Generate complex nested data
  const complexData = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    title: `Section ${i + 1}`,
    primes: primes.slice(i * 100, (i + 1) * 100),
    fibonacci: fibs,
    items: Array.from({ length: 20 }, (_, j) => ({
      id: j,
      value: Math.sqrt(i * 1000 + j),
      description: `Item ${j} in section ${i}`,
      metadata: {
        timestamp: Date.now(),
        hash: (i * j * 12345).toString(36),
        complexity: Math.sin(i) * Math.cos(j),
      },
    })),
  }));

  return complexData;
}

export default function ComplexComponent() {
  // Expensive server-side computation
  const data = generateComplexData();

  // Additional expensive operations
  const totalPrimes = data.reduce(
    (sum, section) => sum + section.primes.length,
    0
  );
  const averageFib =
    data[0].fibonacci.reduce((a, b) => a + b, 0) / data[0].fibonacci.length;

  return (
    <div className="p-8 max-w-7xl mx-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Complex Server-Rendered Component
      </h1>

      <div className="mb-8 p-4 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow">
        <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
          Statistics
        </h2>
        <p className="text-lg">Total Prime Numbers: {totalPrimes}</p>
        <p className="text-lg">
          Average Fibonacci Value: {averageFib.toFixed(2)}
        </p>
        <p className="text-lg">Total Sections: {data.length}</p>
      </div>

      {data.map((section) => (
        <div
          key={section.id}
          className="mb-8 border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800 shadow"
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            {section.title}
          </h2>

          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2 text-purple-800 dark:text-purple-300">
              Prime Numbers (100 samples)
            </h3>
            <div className="grid grid-cols-10 gap-2">
              {section.primes.map((prime, idx) => (
                <div
                  key={idx}
                  className="bg-purple-100 dark:bg-purple-900/60 p-2 text-center rounded text-sm text-purple-900 dark:text-purple-100 border border-purple-200 dark:border-purple-800"
                >
                  {prime}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2 text-green-800 dark:text-green-300">
              Fibonacci Sequence
            </h3>
            <div className="flex flex-wrap gap-2">
              {section.fibonacci.map((fib, idx) => (
                <div
                  key={idx}
                  className="bg-green-100 dark:bg-green-900/60 px-3 py-1 rounded text-sm text-green-900 dark:text-green-100 border border-green-200 dark:border-green-800"
                >
                  {fib}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2 text-blue-800 dark:text-blue-300">
              Items ({section.items.length})
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {section.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 dark:bg-gray-900 p-4 rounded border border-gray-300 dark:border-gray-700 shadow-sm"
                >
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    Item {item.id}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {item.description}
                  </p>
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    Value: {item.value.toFixed(4)}
                  </p>
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <p>Hash: {item.metadata.hash}</p>
                    <p>Complexity: {item.metadata.complexity.toFixed(6)}</p>
                    <p>Timestamp: {item.metadata.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      <div className="mt-8 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Additional Computations
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 300 }, (_, i) => {
            const n = i + 1;
            const factorial = Array.from(
              { length: Math.min(n, 20) },
              (_, j) => j + 1
            ).reduce((acc, val) => acc * val, 1);
            return (
              <div
                key={i}
                className="bg-white dark:bg-gray-900 p-3 rounded shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <p className="font-mono text-sm text-gray-800 dark:text-gray-200">
                  n={n}, f={factorial.toExponential(2)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
