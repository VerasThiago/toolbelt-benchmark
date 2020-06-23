Benchmarking @vtex import
Benchmarks created with hyperfine

Using commonjs:

| Command | Mean [ms] | Min [ms] | Max [ms] | Relative |
|:---|---:|---:|---:|---:|
| `node axios-require.js` | 43.9 ± 3.4 | 37.8 | 51.4 | 1.00 |
| `node vtex-api-require.js` | 519.9 ± 24.6 | 482.4 | 607.7 | 11.83 ± 1.08 |
| `node simple-require.js` | 577.1 ± 11.3 | 552.7 | 595.9 | 13.13 ± 1.06 |
| `node destructure-require.js` | 580.9 ± 10.1 | 562.6 | 598.4 | 13.22 ± 1.06 |


System:
OS: Ubuntu 20.04 LTS
CPU: Intel(R) Core(TM) i7-10510U CPU @ 1.80GHz
Memory: 16 GB
Shell: 5.0.16(1)-release (x86_64-pc-linux-gnu)