Benchmarking @vtex import
Benchmarks created with hyperfine

Using commonjs:

| Command | Mean [ms] | Min…Max [ms] |
|:---|---:|---:|
| `node axios-require.js` | 38.9 ± 2.2 | 37.1…46.6 |
| `node vtex-api-require.js` | 498.7 ± 15.0 | 467.6…528.9 |
| `node simple-require.js` | 580.9 ± 15.7 | 547.8…619.8 |
| `node destructure-require.js` | 589.3 ± 11.8 | 573.3…616.7 |


System:
OS: Ubuntu 20.04 LTS
CPU: Intel(R) Core(TM) i7-10510U CPU @ 1.80GHz
Memory: 16 GB
Shell: 5.0.16(1)-release (x86_64-pc-linux-gnu)