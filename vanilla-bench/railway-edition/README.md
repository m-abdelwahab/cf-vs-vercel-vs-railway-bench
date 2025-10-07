# Vanilla SSR - Railway Edition

A simple server-side rendering demo built with vanilla JavaScript for Railway.

## Setup

This project uses Bun runtime. Make sure you have Bun installed:

```bash
curl -fsSL https://bun.sh/install | bash
```

Then install dependencies (if any):

```bash
bun install
```

## Development

```bash
bun run dev
```

## Production

```bash
bun run start
```

## Endpoints

The following benchmark endpoints are available:

- `/bench` - Complex SSR benchmark with prime numbers, fibonacci sequences, and nested data rendering
- `/slower-bench` - More intensive SSR benchmark with 3x more data processing
- `/realistic-math-bench` - CPU-bound integer and string operations benchmark
- `/shitty-sine-bench` - CPU-bound floating-point math benchmark (100M sine/cosine operations)

## Environment Variables

- `PORT` - Port to run the server on (default: 3000)
