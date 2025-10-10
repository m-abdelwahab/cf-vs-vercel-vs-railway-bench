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
				complexity: Math.sin(i) * Math.cos(j)
			}
		}))
	}));

	return complexData;
}

export function getComplexData() {
	// Expensive server-side computation
	const data = generateComplexData();

	// Additional expensive operations
	const totalPrimes = data.reduce((sum, section) => sum + section.primes.length, 0);
	const averageFib = data[0].fibonacci.reduce((a, b) => a + b, 0) / data[0].fibonacci.length;

	return {
		data,
		totalPrimes,
		averageFib
	};
}
