#!/usr/bin/python
#
# Copyright (C) 2012 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Compresses all .js files recursively in the project."""

__author__ = 'ericbidelman@chromium.org (Eric Bidelman)'

import os


DIRS = ['../src']
EXT = '.js'
JS_COMPILER = 'compiler-latest/compiler.jar'

def GetAllJsFiles(dirs):
  l = []
  for d in dirs:
    files = os.walk(d)
    for root, currdir, file_list in files:
      l.extend('%s/%s' % (root, f)  for f in file_list if f.endswith(EXT))
  return l

if __name__ == '__main__':

  for path in GetAllJsFiles(DIRS):
    # Remove old minified .js files.
    if path.split('/')[-1].endswith('.min.js'):
      #os.system('rm ' + path)
      continue

    new_path = '%s.min%s' % (path.split(EXT)[0], EXT)

    print 'Compressing %s -> %s' % (path, new_path)
    cmd = ('java -jar %s --accept_const_keyword '
           '--language_in=ECMASCRIPT5 --compilation_level SIMPLE_OPTIMIZATIONS '
           '--js %s --js_output_file %s' % (JS_COMPILER, path, new_path))
    os.system(cmd)

