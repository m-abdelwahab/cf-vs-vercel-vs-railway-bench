// Note: This whole file is vibe coded. I do not know how any of the formatting works. Blame Claude.

const tests = [
	{
		name: "next-js",
		// cfUrl: "https://next-cf-bench.pinglabs.workers.dev/bench",
		// vercelUrl: "https://vercel-edition-amber.vercel.app/bench",
		railwayUrl: "https://next-bench-railway-edition.up.railway.app/bench",
	},
	{
		name: "react-ssr-bench",
		// cfUrl: "https://react-ssr-cf.pinglabs.workers.dev/bench",
		// vercelUrl: "https://react-ssr-bench-v2.vercel.app/api/bench",
		railwayUrl: "https://react-ssr-bench-railway-edition.up.railway.app/bench",
	},
	{
		name: "sveltekit",
		// cfUrl: "https://cf-sveltekit-bench.pinglabs.workers.dev/",
		// vercelUrl: "https://vercel-svelte-bench.vercel.app",
		railwayUrl: "https://sveltekit-bench-railway-edition.up.railway.app",
	},
	{
		name: "shitty-sine-bench",
		// cfUrl: "https://vanilla-ssr-cf.pinglabs.workers.dev/shitty-sine-bench",
		// vercelUrl: "https://vanilla-bench-v2.vercel.app/api/shitty-sine-bench",
		railwayUrl:
			"https://vanilla-bench-railway-edition.up.railway.app/shitty-sine-bench",
	},
	{
		name: "realistic-math-bench",
		// cfUrl: "https://vanilla-ssr-cf.pinglabs.workers.dev/realistic-math-bench",
		// vercelUrl: "https://vanilla-bench-v2.vercel.app/api/realistic-math-bench",
		railwayUrl:
			"https://vanilla-bench-railway-edition.up.railway.app/realistic-math-bench",
	},
	{
		name: "vanilla-slower",
		// cfUrl: "https://vanilla-ssr-cf.pinglabs.workers.dev/slower-bench",
		// vercelUrl: "https://vanilla-bench-v2.vercel.app/api/slower-bench",
		railwayUrl:
			"https://vanilla-bench-railway-edition.up.railway.app/slower-bench",
	},
];

const fs = require("fs");
const path = require("path");

const ITERATIONS = 100;
const CONCURRENCY = 10;

async function measureResponseTime(url) {
	const start = performance.now();
	try {
		const response = await fetch(url);
		const end = performance.now();
		const responseTime = end - start;

		// Read the response body
		await response.text();

		return {
			time: responseTime,
			status: response.status,
			success: response.ok,
		};
	} catch (error) {
		return {
			time: null,
			status: null,
			success: false,
			error: error.message,
		};
	}
}

async function runBenchmark(url, name) {
	console.log(`\n🏃 Running benchmark for ${name}...`);
	console.log(`URL: ${url}`);
	console.log(`Iterations: ${ITERATIONS} (concurrency: ${CONCURRENCY})\n`);

	const results = [];
	let completed = 0;
	let nextIndex = 0;

	// Spawn a fixed number of workers; each pulls the next index until done
	async function worker() {
		while (true) {
			const i = nextIndex++;
			if (i >= ITERATIONS) break;
			const result = await measureResponseTime(url);
			results.push(result);
			completed++;
			process.stdout.write(`  Progress: ${completed}/${ITERATIONS}\r`);
		}
	}

	const workerCount = Math.min(CONCURRENCY, ITERATIONS);
	const workers = Array.from({ length: workerCount }, () => worker());
	await Promise.all(workers);

	console.log(`\n`);

	// Analyze results
	const successful = results.filter((r) => r.success);
	const failed = results.filter((r) => !r.success);
	const times = successful.map((r) => r.time);

	// Count status codes
	const statusCodes = {};
	results.forEach((r) => {
		if (r.status !== null) {
			statusCodes[r.status] = (statusCodes[r.status] || 0) + 1;
		}
	});

	// Count error types
	const errors = {};
	failed.forEach((r) => {
		if (r.error) {
			errors[r.error] = (errors[r.error] || 0) + 1;
		}
	});

	const failureRate = (failed.length / results.length) * 100;

	if (times.length === 0) {
		console.log(`❌ No successful requests for ${name}`);
		console.log(`   Failure rate: ${failureRate.toFixed(2)}%`);
		if (Object.keys(statusCodes).length > 0) {
			console.log(`   Status codes:`, statusCodes);
		}
		if (Object.keys(errors).length > 0) {
			console.log(`   Errors:`, errors);
		}
		return null;
	}

	const min = Math.min(...times);
	const max = Math.max(...times);
	const mean = times.reduce((a, b) => a + b, 0) / times.length;

	return {
		min,
		max,
		mean,
		successful: successful.length,
		failed: failed.length,
		failureRate,
		statusCodes,
		errors: Object.keys(errors).length > 0 ? errors : undefined,
		times,
	};
}

function formatTime(ms) {
	return `${(ms / 1000).toFixed(3)}s`;
}

async function main() {
	console.log("=".repeat(60));
	console.log("  SSR Performance Benchmark: Cloudflare vs Vercel vs Railway");
	console.log("=".repeat(60));

	const allResults = [];

	for (const test of tests) {
		console.log("\n" + "-".repeat(60));
		console.log(`Test: ${test.name}`);
		console.log("-".repeat(60));

		const cfResults = test.cfUrl
			? await runBenchmark(test.cfUrl, `${test.name} - Cloudflare`)
			: null;
		const vercelResults = test.vercelUrl
			? await runBenchmark(test.vercelUrl, `${test.name} - Vercel`)
			: null;
		const railwayResults = test.railwayUrl
			? await runBenchmark(test.railwayUrl, `${test.name} - Railway`)
			: null;

		console.log("=".repeat(60));
		console.log(`  RESULTS (${test.name})`);
		console.log("=".repeat(60));

		if (cfResults) {
			console.log("\n📊 Cloudflare Results:");
			console.log(
				`  Successful requests: ${cfResults.successful}/${ITERATIONS}`,
			);
			if (cfResults.failed > 0) {
				console.log(`  Failed requests: ${cfResults.failed}/${ITERATIONS}`);
				console.log(`  Failure rate: ${cfResults.failureRate.toFixed(2)}%`);
				console.log(`  Status codes:`, cfResults.statusCodes);
				if (cfResults.errors) {
					console.log(`  Errors:`, cfResults.errors);
				}
			}
			console.log(`  Min:  ${formatTime(cfResults.min)}`);
			console.log(`  Max:  ${formatTime(cfResults.max)}`);
			console.log(`  Mean: ${formatTime(cfResults.mean)}`);
		}

		if (vercelResults) {
			console.log("\n📊 Vercel Results:");
			console.log(
				`  Successful requests: ${vercelResults.successful}/${ITERATIONS}`,
			);
			if (vercelResults.failed > 0) {
				console.log(`  Failed requests: ${vercelResults.failed}/${ITERATIONS}`);
				console.log(`  Failure rate: ${vercelResults.failureRate.toFixed(2)}%`);
				console.log(`  Status codes:`, vercelResults.statusCodes);
				if (vercelResults.errors) {
					console.log(`  Errors:`, vercelResults.errors);
				}
			}
			console.log(`  Min:  ${formatTime(vercelResults.min)}`);
			console.log(`  Max:  ${formatTime(vercelResults.max)}`);
			console.log(`  Mean: ${formatTime(vercelResults.mean)}`);
		}

		if (railwayResults) {
			console.log("\n📊 Railway Results:");
			console.log(
				`  Successful requests: ${railwayResults.successful}/${ITERATIONS}`,
			);
			if (railwayResults.failed > 0) {
				console.log(
					`  Failed requests: ${railwayResults.failed}/${ITERATIONS}`,
				);
				console.log(
					`  Failure rate: ${railwayResults.failureRate.toFixed(2)}%`,
				);
				console.log(`  Status codes:`, railwayResults.statusCodes);
				if (railwayResults.errors) {
					console.log(`  Errors:`, railwayResults.errors);
				}
			}
			console.log(`  Min:  ${formatTime(railwayResults.min)}`);
			console.log(`  Max:  ${formatTime(railwayResults.max)}`);
			console.log(`  Mean: ${formatTime(railwayResults.mean)}`);
		}

		// Comparison logic
		const providers = [];
		if (cfResults) providers.push({ name: "Cloudflare", results: cfResults });
		if (vercelResults)
			providers.push({ name: "Vercel", results: vercelResults });
		if (railwayResults)
			providers.push({ name: "Railway", results: railwayResults });

		if (providers.length >= 2) {
			console.log("\n📈 Comparison:");
			// Sort by mean response time (fastest first)
			const sorted = [...providers].sort(
				(a, b) => a.results.mean - b.results.mean,
			);
			const fastest = sorted[0];
			console.log(
				`  Fastest: ${fastest.name} (${formatTime(fastest.results.mean)} mean)`,
			);

			for (let i = 1; i < sorted.length; i++) {
				const ratio = sorted[i].results.mean / fastest.results.mean;
				console.log(
					`  ${sorted[i].name} is ${ratio.toFixed(2)}x slower than ${fastest.name}`,
				);
			}
		}

		allResults.push({
			name: test.name,
			urls: {
				cloudflare: test.cfUrl,
				vercel: test.vercelUrl,
				railway: test.railwayUrl,
			},
			results: {
				cloudflare: cfResults,
				vercel: vercelResults,
				railway: railwayResults,
			},
		});
	}

	console.log("\n" + "=".repeat(60));

	// Output final results summary for README
	console.log("\n\n" + "=".repeat(60));
	console.log("  FINAL RESULTS SUMMARY");
	console.log("=".repeat(60) + "\n");

	for (const result of allResults) {
		const cf = result.results.cloudflare;
		const vercel = result.results.vercel;
		const railway = result.results.railway;

		console.log(`## ${result.name}`);
		console.log();

		const providers = [];
		if (cf) providers.push({ name: "Cloudflare", results: cf });
		if (vercel) providers.push({ name: "Vercel", results: vercel });
		if (railway) providers.push({ name: "Railway", results: railway });

		if (providers.length > 0) {
			// Create table header
			console.log(`| Platform   | Mean | Min | Max | Variability |`);
			console.log(`|------------|------|-----|-----|-------------|`);

			// Add rows for each provider
			for (const provider of providers) {
				const r = provider.results;
				const variability = r.max - r.min;
				const paddedName = provider.name.padEnd(10);
				console.log(
					`| ${paddedName} | ${formatTime(r.mean)} | ${formatTime(r.min)} | ${formatTime(r.max)} | ${formatTime(variability)} |`,
				);
			}
			console.log();

			// Determine winner
			if (providers.length >= 2) {
				const sorted = [...providers].sort(
					(a, b) => a.results.mean - b.results.mean,
				);
				const winner = sorted[0];
				const secondPlace = sorted[1];
				const speedup = secondPlace.results.mean / winner.results.mean;
				console.log(
					`**Winner:** ${winner.name} (${speedup.toFixed(2)}x faster than ${secondPlace.name})`,
				);
				console.log();
			}
		}
	}

	console.log("---");
	console.log(
		`\n*Benchmark run: ${new Date().toISOString().split("T")[0]} • ${ITERATIONS} iterations • Concurrency: ${CONCURRENCY}*`,
	);
	console.log("\n" + "=".repeat(60) + "\n");

	// Write consolidated results to results-(datetime).json inside results/ directory
	try {
		const resultsDir = path.resolve(__dirname, "results");
		await fs.promises.mkdir(resultsDir, { recursive: true });

		const timestamp = new Date().toISOString();
		const safeStamp = timestamp.replace(/[:.]/g, "-");
		const filePath = path.join(resultsDir, `results-${safeStamp}.json`);

		const summary = {
			timestamp,
			iterations: ITERATIONS,
			concurrency: CONCURRENCY,
			tests: allResults,
		};

		await fs.promises.writeFile(
			filePath,
			JSON.stringify(summary, null, 2),
			"utf8",
		);
		console.log(`📝 Results written to: ${filePath}`);
	} catch (err) {
		console.error("Failed to write results file:", err.message);
	}
}

main().catch(console.error);
