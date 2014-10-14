#!/bin/bash
#
# Runs Closure Compiler on src .js files.
#
# Copyright 2011 Eric Bidelman <ebidel@gmail.com>

JS_EXT=js
JSDIR='../src'

CLOSURE_COMPILER=compiler-latest/compiler.jar

JS_FILES=("${JSDIR}/filer.${JS_EXT}")

for i in ${JS_FILES[*]}; do
  filename=`basename $i`
  name=`basename ${filename%%.*}`
  ext=`basename ${filename##*.}`
  dir=`dirname $i`
  java -jar ${CLOSURE_COMPILER} --accept_const_keyword --language_in=ECMASCRIPT5 --compilation_level SIMPLE_OPTIMIZATIONS --js $i --js_output_file $dir/$name.min.$ext
done
