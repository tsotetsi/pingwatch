#!/bin/bash
set -e

echo "Updating requirement files with hashes..."

pip-compile --generate-hashes requirements/base.in -o requirements/base.txt
pip-compile --generate-hashes requirements/local.in -o requirements/local.txt
pip-compile --generate-hashes requirements/production.in -o requirements/production.txt

echo "Requirements updated with latest hashes!"
echo "Don't forget to commit the updated .txt files"