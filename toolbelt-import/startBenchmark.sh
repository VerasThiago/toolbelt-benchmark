 
#!/bin/bash 

set -euo pipefail

OUTDIR=$PWD/results
mkdir -p $OUTDIR

cd commonjs
./benchmark.sh $OUTDIR
cd ..