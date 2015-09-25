#!/bin/sh

original_dir=`pwd`
script_in_dir=$(dirname $0)
cd $script_in_dir/..

npm update

bower update

# just make sure..
gulp remove-proxy

# ensure everything is built and up to date from jade/sass land
gulp

# now build the goofy project files
ionic build ios

# set the project build number to be unique.  ie - YYMMDD.HHMM
cd platforms/ios
vernum=`date +%y%m%d%H%M`
agvtool new-version -all $vernum

# finally, open xcode
open leadgen.xcodeproj

cd $original_dir
