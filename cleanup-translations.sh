#!/bin/sh

find "source/translation/" -iname '*.po' -exec xgettext --no-location -o {} {} \;