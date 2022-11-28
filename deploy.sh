#!/bin/bash
# Run on local machine

set -e

sshuser=$1
reponame="https://github.com/thiscoldhouse/theluddite.git"

prodpath="/var/www/theluddite.org/"

localdeploy=theludditedeploy
server="172.104.24.137"

cd /tmp
git clone $reponame $localdeploy

echo "Beaming code to the servers"

echo "First, removing old code"
ssh -t aleruiz@$server "rm -rf $prodpath* "
echo "Sending new code"
scp -r /tmp/$localdeploy/* aleruiz@$server:$prodpath
echo "Cleaning up"
rm -rf $localdeploy
cd -
echo "Done"
