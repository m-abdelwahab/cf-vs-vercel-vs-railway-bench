// Server component with computationally expensive rendering
// This component intentionally takes several seconds to render
// Uses React.createElement instead of JSX to avoid compilation

import React from "react";

function isPrime(num) {
	if (num <= 1) return false;
	if (num <= 3) return true;
	if (num % 2 === 0 || num % 3 === 0) return false;
	for (let i = 5; i * i <= num; i += 6) {
		if (num % i === 0 || num % (i + 2) === 0) return false;
	}
	return true;
}

function calculatePrimes(limit) {
	const primes = [];
	for (let i = 2; i <= limit; i++) {
		if (isPrime(i)) {
			primes.push(i);
		}
	}
	return primes;
}

function fibonacci(n) {
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
		0,
	);
	const averageFib =
		data[0].fibonacci.reduce((a, b) => a + b, 0) / data[0].fibonacci.length;

	return React.createElement(
		"div",
		{
			style: {
				padding: "32px",
				maxWidth: "1280px",
				margin: "0 auto",
				backgroundColor: "white",
				color: "#111827",
			},
		},
		React.createElement(
			"h1",
			{
				style: {
					fontSize: "36px",
					fontWeight: "bold",
					marginBottom: "24px",
					color: "#111827",
				},
			},
			"Complex Server-Rendered Component (React SSR)",
		),

		React.createElement(
			"div",
			{
				style: {
					marginBottom: "32px",
					padding: "16px",
					borderRadius: "8px",
					backgroundColor: "#f3f4f6",
					border: "1px solid #e5e7eb",
					boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
				},
			},
			React.createElement(
				"h2",
				{
					style: {
						fontSize: "24px",
						fontWeight: "600",
						marginBottom: "8px",
						color: "#1f2937",
					},
				},
				"Statistics",
			),
			React.createElement(
				"p",
				{ style: { fontSize: "18px" } },
				`Total Prime Numbers: ${totalPrimes}`,
			),
			React.createElement(
				"p",
				{ style: { fontSize: "18px" } },
				`Average Fibonacci Value: ${averageFib.toFixed(2)}`,
			),
			React.createElement(
				"p",
				{ style: { fontSize: "18px" } },
				`Total Sections: ${data.length}`,
			),
		),

		...data.map((section) =>
			React.createElement(
				"div",
				{
					key: section.id,
					style: {
						marginBottom: "32px",
						border: "1px solid #e5e7eb",
						borderRadius: "8px",
						padding: "24px",
						backgroundColor: "white",
						boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
					},
				},
				React.createElement(
					"h2",
					{
						style: {
							fontSize: "24px",
							fontWeight: "bold",
							marginBottom: "16px",
							color: "#111827",
						},
					},
					section.title,
				),

				React.createElement(
					"div",
					{ style: { marginBottom: "16px" } },
					React.createElement(
						"h3",
						{
							style: {
								fontSize: "20px",
								fontWeight: "600",
								marginBottom: "8px",
								color: "#6b21a8",
							},
						},
						"Prime Numbers (100 samples)",
					),
					React.createElement(
						"div",
						{
							style: {
								display: "grid",
								gridTemplateColumns: "repeat(10, 1fr)",
								gap: "8px",
							},
						},
						...section.primes.map((prime, idx) =>
							React.createElement(
								"div",
								{
									key: idx,
									style: {
										backgroundColor: "#e9d5ff",
										padding: "8px",
										textAlign: "center",
										borderRadius: "4px",
										fontSize: "14px",
										color: "#581c87",
										border: "1px solid #d8b4fe",
									},
								},
								prime,
							),
						),
					),
				),

				React.createElement(
					"div",
					{ style: { marginBottom: "16px" } },
					React.createElement(
						"h3",
						{
							style: {
								fontSize: "20px",
								fontWeight: "600",
								marginBottom: "8px",
								color: "#166534",
							},
						},
						"Fibonacci Sequence",
					),
					React.createElement(
						"div",
						{
							style: { display: "flex", flexWrap: "wrap", gap: "8px" },
						},
						...section.fibonacci.map((fib, idx) =>
							React.createElement(
								"div",
								{
									key: idx,
									style: {
										backgroundColor: "#dcfce7",
										padding: "4px 12px",
										borderRadius: "4px",
										fontSize: "14px",
										color: "#14532d",
										border: "1px solid #bbf7d0",
									},
								},
								fib,
							),
						),
					),
				),

				React.createElement(
					"div",
					{},
					React.createElement(
						"h3",
						{
							style: {
								fontSize: "20px",
								fontWeight: "600",
								marginBottom: "8px",
								color: "#1e40af",
							},
						},
						`Items (${section.items.length})`,
					),
					React.createElement(
						"div",
						{
							style: {
								display: "grid",
								gridTemplateColumns: "repeat(2, 1fr)",
								gap: "16px",
							},
						},
						...section.items.map((item) =>
							React.createElement(
								"div",
								{
									key: item.id,
									style: {
										backgroundColor: "#f9fafb",
										padding: "16px",
										borderRadius: "4px",
										border: "1px solid #d1d5db",
										boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
									},
								},
								React.createElement(
									"h4",
									{
										style: { fontWeight: "600", color: "#111827" },
									},
									`Item ${item.id}`,
								),
								React.createElement(
									"p",
									{
										style: { fontSize: "14px", color: "#4b5563" },
									},
									item.description,
								),
								React.createElement(
									"p",
									{
										style: { fontSize: "14px", color: "#1f2937" },
									},
									`Value: ${item.value.toFixed(4)}`,
								),
								React.createElement(
									"div",
									{
										style: {
											marginTop: "8px",
											fontSize: "12px",
											color: "#6b7280",
										},
									},
									React.createElement("p", {}, `Hash: ${item.metadata.hash}`),
									React.createElement(
										"p",
										{},
										`Complexity: ${item.metadata.complexity.toFixed(6)}`,
									),
									React.createElement(
										"p",
										{},
										`Timestamp: ${item.metadata.timestamp}`,
									),
								),
							),
						),
					),
				),
			),
		),

		React.createElement(
			"div",
			{
				style: {
					marginTop: "32px",
					padding: "24px",
					backgroundColor: "#f3f4f6",
					borderRadius: "8px",
					border: "1px solid #e5e7eb",
					boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
				},
			},
			React.createElement(
				"h2",
				{
					style: {
						fontSize: "24px",
						fontWeight: "bold",
						marginBottom: "16px",
						color: "#111827",
					},
				},
				"Additional Computations",
			),
			React.createElement(
				"div",
				{
					style: {
						display: "grid",
						gridTemplateColumns: "repeat(3, 1fr)",
						gap: "16px",
					},
				},
				...Array.from({ length: 300 }, (_, i) => {
					const n = i + 1;
					const factorial = Array.from(
						{ length: Math.min(n, 20) },
						(_, j) => j + 1,
					).reduce((acc, val) => acc * val, 1);
					return React.createElement(
						"div",
						{
							key: i,
							style: {
								backgroundColor: "white",
								padding: "12px",
								borderRadius: "4px",
								boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
								border: "1px solid #e5e7eb",
							},
						},
						React.createElement(
							"p",
							{
								style: {
									fontFamily: "monospace",
									fontSize: "14px",
									color: "#1f2937",
								},
							},
							`n=${n}, f=${factorial.toExponential(2)}`,
						),
					);
				}),
			),
		),
	);
}
