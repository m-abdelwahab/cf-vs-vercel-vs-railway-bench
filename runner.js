// Note: This whole file is vibe coded. I do not know how any of the formatting works. Blame Claude.

const tests = [
	{
		name: "next-js",
		// cfUrl: "https://next-cf-bench.pinglabs.workers.dev/bench",
		// vercelUrl: "https://vercel-edition-amber.vercel.app/bench",
		// railwayUrl: "https://next-bench-railway-edition.up.railway.app/bench",
	},
	{
		name: "react-ssr-bench",
		// cfUrl: "https://react-ssr-cf.pinglabs.workers.dev/bench",
		// vercelUrl: "https://react-ssr-bench-v2.vercel.app/api/bench",
		railwayUrl: "https://react-ssr-bench-railway-edition.up.railway.app/bench",
	},
	// {
	//   name: "sveltekit",
	//   cfUrl: "https://cf-sveltekit-bench.pinglabs.workers.dev/",
	//   vercelUrl: "https://vercel-svelte-bench.vercel.app",
	// },
	// {
	//   name: "shitty-sine-bench",
	//   cfUrl: "https://vanilla-ssr-cf.pinglabs.workers.dev/shitty-sine-bench",
	//   vercelUrl: "https://vanilla-bench-v2.vercel.app/api/shitty-sine-bench",
	// },
	// {
	//   name: "realistic-math-bench",
	//   cfUrl: "https://vanilla-ssr-cf.pinglabs.workers.dev/realistic-math-bench",
	//   vercelUrl: "https://vanilla-bench-v2.vercel.app/api/realistic-math-bench",
	// },
	// {
	//   name: "vanilla-slower",
	//   cfUrl: "https://vanilla-ssr-cf.pinglabs.workers.dev/slower-bench",
	//   vercelUrl: "https://vanilla-bench-v2.vercel.app/api/slower-bench",
	// },
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

		const cfResults = await runBenchmark(
			test.cfUrl,
			`${test.name} - Cloudflare`,
		);
		const vercelResults = await runBenchmark(
			test.vercelUrl,
			`${test.name} - Vercel`,
		);
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

		// Comparison section
		const validResults = [
			{ name: "Cloudflare", results: cfResults },
			{ name: "Vercel", results: vercelResults },
			{ name: "Railway", results: railwayResults },
		].filter((r) => r.results);

		if (validResults.length >= 2) {
			console.log("\n📈 Comparison:");

			// Find fastest and slowest
			validResults.sort((a, b) => a.results.mean - b.results.mean);
			const fastest = validResults[0];
			const slowest = validResults[validResults.length - 1];

			console.log(
				`  Fastest: ${fastest.name} (${formatTime(fastest.results.mean)})`,
			);
			console.log(
				`  Slowest: ${slowest.name} (${formatTime(slowest.results.mean)})`,
			);

			// Speed comparison
			const speedup = slowest.results.mean / fastest.results.mean;
			console.log(
				`  ${fastest.name} is ${speedup.toFixed(2)}x faster than ${slowest.name}`,
			);

			// Show all comparisons if we have 3 platforms
			if (validResults.length === 3) {
				console.log(`\n  All platforms by speed:`);
				validResults.forEach((r, i) => {
					const relativeSpeed = r.results.mean / fastest.results.mean;
					console.log(
						`    ${i + 1}. ${r.name}: ${formatTime(r.results.mean)} (${relativeSpeed.toFixed(2)}x)`,
					);
				});
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

		const validPlatforms = [
			{ name: "Cloudflare", data: cf },
			{ name: "Vercel", data: vercel },
			{ name: "Railway", data: railway },
		].filter((p) => p.data);

		if (validPlatforms.length >= 2) {
			// Sort by mean to find winner
			validPlatforms.sort((a, b) => a.data.mean - b.data.mean);
			const winner = validPlatforms[0];
			const slowest = validPlatforms[validPlatforms.length - 1];
			const speedup = slowest.data.mean / winner.data.mean;

			console.log(`| Platform   | Mean | Min | Max | Variability |`);
			console.log(`|------------|------|-----|-----|-------------|`);

			// Display all platforms (sorted by speed in final output)
			if (cf) {
				const cfVariability = cf.max - cf.min;
				console.log(
					`| Cloudflare | ${formatTime(cf.mean)} | ${formatTime(cf.min)} | ${formatTime(cf.max)} | ${formatTime(cfVariability)} |`,
				);
			}
			if (vercel) {
				const vercelVariability = vercel.max - vercel.min;
				console.log(
					`| Vercel     | ${formatTime(vercel.mean)} | ${formatTime(vercel.min)} | ${formatTime(vercel.max)} | ${formatTime(vercelVariability)} |`,
				);
			}
			if (railway) {
				const railwayVariability = railway.max - railway.min;
				console.log(
					`| Railway    | ${formatTime(railway.mean)} | ${formatTime(railway.min)} | ${formatTime(railway.max)} | ${formatTime(railwayVariability)} |`,
				);
			}

			console.log();
			console.log(
				`**Winner:** ${winner.name} (${speedup.toFixed(2)}x faster than ${slowest.name})`,
			);
			console.log();
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
