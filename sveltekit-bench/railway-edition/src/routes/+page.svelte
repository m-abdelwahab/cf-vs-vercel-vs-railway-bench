<script lang="ts">
	const { data: initialData } = $props();

	const { totalPrimes, averageFib, computations, data } = initialData;
</script>

<div
	class="mx-auto max-w-7xl bg-white p-8 text-gray-900 transition-colors duration-300 dark:bg-gray-900 dark:text-gray-100"
>
	<h1 class="mb-6 text-4xl font-bold text-gray-900 dark:text-gray-100">
		Complex Server-Rendered Component
	</h1>

	<div
		class="mb-8 rounded-lg border border-gray-200 bg-gray-100 p-4 shadow dark:border-gray-700 dark:bg-gray-800"
	>
		<h2 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-gray-200">Statistics</h2>
		<p class="text-lg">Total Prime Numbers: {totalPrimes}</p>
		<p class="text-lg">
			Average Fibonacci Value: {averageFib.toFixed(2)}
		</p>
		<p class="text-lg">Total Sections: {data.length}</p>
	</div>

	{#each data as section}
		<div
			class="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800"
		>
			<h2 class="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
				{section.title}
			</h2>

			<div class="mb-4">
				<h3 class="mb-2 text-xl font-semibold text-purple-800 dark:text-purple-300">
					Prime Numbers (100 samples)
				</h3>
				<div class="grid grid-cols-10 gap-2">
					{#each section.primes as prime}
						<div
							class="rounded border border-purple-200 bg-purple-100 p-2 text-center text-sm text-purple-900 dark:border-purple-800 dark:bg-purple-900/60 dark:text-purple-100"
						>
							{prime}
						</div>
					{/each}
				</div>
			</div>

			<div class="mb-4">
				<h3 class="mb-2 text-xl font-semibold text-green-800 dark:text-green-300">
					Fibonacci Sequence
				</h3>
				<div class="flex flex-wrap gap-2">
					{#each section.fibonacci as fib}
						<div
							class="rounded border border-green-200 bg-green-100 px-3 py-1 text-sm text-green-900 dark:border-green-800 dark:bg-green-900/60 dark:text-green-100"
						>
							{fib}
						</div>
					{/each}
				</div>
			</div>

			<div>
				<h3 class="mb-2 text-xl font-semibold text-blue-800 dark:text-blue-300">
					Items ({section.items.length})
				</h3>
				<div class="grid grid-cols-2 gap-4">
					{#each section.items as item}
						<div
							class="rounded border border-gray-300 bg-gray-50 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900"
						>
							<h4 class="font-semibold text-gray-900 dark:text-gray-100">
								Item {item.id}
							</h4>
							<p class="text-sm text-gray-600 dark:text-gray-300">
								{item.description}
							</p>
							<p class="text-sm text-gray-800 dark:text-gray-200">
								Value: {item.value.toFixed(4)}
							</p>
							<div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
								<p>Hash: {item.metadata.hash}</p>
								<p>Complexity: {item.metadata.complexity.toFixed(6)}</p>
								<p>Timestamp: {item.metadata.timestamp}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	{/each}

	<div
		class="mt-8 rounded-lg border border-gray-200 bg-gray-100 p-6 shadow dark:border-gray-700 dark:bg-gray-800"
	>
		<h2 class="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
			Additional Computations
		</h2>
		<div class="grid grid-cols-3 gap-4">
			{#each computations as { n, factorial }}
				<div
					class="rounded border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-900"
				>
					<p class="font-mono text-sm text-gray-800 dark:text-gray-200">
						n={n}, f={factorial.toExponential(2)}
					</p>
				</div>
			{/each}
		</div>
	</div>
</div>
