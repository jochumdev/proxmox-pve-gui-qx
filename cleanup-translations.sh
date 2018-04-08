#!/bin/sh

find "apps/" -wholename '*/source/translation/*.po' -exec xgettext --no-location -o {} {} \;