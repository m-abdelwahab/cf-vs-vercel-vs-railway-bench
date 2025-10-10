import { getComplexData } from '$lib/complex';

export const load = () => {
	const { data, totalPrimes, averageFib } = getComplexData();

	const computations = Array.from({ length: 300 }, (_, i) => {
		const n = i + 1;
		const factorial = Array.from({ length: Math.min(n, 20) }, (_, j) => j + 1).reduce(
			(acc, val) => acc * val,
			1
		);
		return { n, factorial };
	});

	return {
		data,
		totalPrimes,
		averageFib,
		computations
	};
};
