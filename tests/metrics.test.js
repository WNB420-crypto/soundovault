import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseMetric,formatStreams,formatValue} from '../src/data/metrics.js';
test('parses abbreviated and numeric stream counts',()=>{assert.equal(parseMetric('4.4M'),4400000);assert.equal(parseMetric('12.5K'),12500);assert.equal(parseMetric('1,234'),1234);assert.equal(parseMetric(420),420)});
test('invalid and missing counts remain zero',()=>{assert.equal(parseMetric(undefined),0);assert.equal(parseMetric('bad'),0);assert.equal(parseMetric(Infinity),0)});
test('zero metrics are shown honestly',()=>{assert.equal(formatStreams(0),'0');assert.equal(formatValue(0),'$0');assert.equal(formatStreams(4400000),'4.4M')});
