/**
 * Testing module lib/boxes/secret_box.js
 */

var sbox = require('../../lib/boxes/secret_box');
var arrFactory = new (require('../../lib/util/arrays'))();
var verify = require('../../lib/util/verify');
var assert = require('assert');

function compare(v,expectation) {
	assert.strictEqual(v.length, expectation.length);
	assert.ok(verify.verify(v, expectation, v.length));
}

var firstkey = new Uint8Array(32);
firstkey.set([ 0x1b,0x27,0x55,0x64,0x73,0xe9,0x85,0xd4,
               0x62,0xcd,0x51,0x19,0x7a,0x9a,0x46,0xc7,
               0x60,0x09,0x54,0x9e,0xac,0x64,0x74,0xf2,
               0x06,0xc4,0xee,0x08,0x44,0xf6,0x83,0x89 ]);

var nonce = new Uint8Array(24);
nonce.set([ 0x69,0x69,0x6e,0xe9,0x55,0xb6,0x2b,0x73,
            0xcd,0x62,0xbd,0xa8,0x75,0xfc,0x73,0xd6,
            0x82,0x19,0xe0,0x03,0x6b,0x7a,0x0b,0x37 ]);

var m_padded = new Uint8Array(163);
m_padded.set([ 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
               0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
               0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
               0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
               0xbe,0x07,0x5f,0xc5,0x3c,0x81,0xf2,0xd5,
               0xcf,0x14,0x13,0x16,0xeb,0xeb,0x0c,0x7b,
               0x52,0x28,0xc5,0x2a,0x4c,0x62,0xcb,0xd4,
               0x4b,0x66,0x84,0x9b,0x64,0x24,0x4f,0xfc,
               0xe5,0xec,0xba,0xaf,0x33,0xbd,0x75,0x1a,
               0x1a,0xc7,0x28,0xd4,0x5e,0x6c,0x61,0x29,
               0x6c,0xdc,0x3c,0x01,0x23,0x35,0x61,0xf4,
               0x1d,0xb6,0x6c,0xce,0x31,0x4a,0xdb,0x31,
               0x0e,0x3b,0xe8,0x25,0x0c,0x46,0xf0,0x6d,
               0xce,0xea,0x3a,0x7f,0xa1,0x34,0x80,0x57,
               0xe2,0xf6,0x55,0x6a,0xd6,0xb1,0x31,0x8a,
               0x02,0x4a,0x83,0x8f,0x21,0xaf,0x1f,0xde,
               0x04,0x89,0x77,0xeb,0x48,0xf5,0x9f,0xfd,
               0x49,0x24,0xca,0x1c,0x60,0x90,0x2e,0x52,
               0xf0,0xa0,0x89,0xbc,0x76,0x89,0x70,0x40,
               0xe0,0x82,0xf9,0x37,0x76,0x38,0x48,0x64,
               0x5e,0x07,0x05 ]);

var c_padded = new Uint8Array(163);
c_padded.set([ 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
               0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
               0xf3,0xff,0xc7,0x70,0x3f,0x94,0x00,0xe5,
               0x2a,0x7d,0xfb,0x4b,0x3d,0x33,0x05,0xd9,
               0x8e,0x99,0x3b,0x9f,0x48,0x68,0x12,0x73,
               0xc2,0x96,0x50,0xba,0x32,0xfc,0x76,0xce,
               0x48,0x33,0x2e,0xa7,0x16,0x4d,0x96,0xa4,
               0x47,0x6f,0xb8,0xc5,0x31,0xa1,0x18,0x6a,
               0xc0,0xdf,0xc1,0x7c,0x98,0xdc,0xe8,0x7b,
               0x4d,0xa7,0xf0,0x11,0xec,0x48,0xc9,0x72,
               0x71,0xd2,0xc2,0x0f,0x9b,0x92,0x8f,0xe2,
               0x27,0x0d,0x6f,0xb8,0x63,0xd5,0x17,0x38,
               0xb4,0x8e,0xee,0xe3,0x14,0xa7,0xcc,0x8a,
               0xb9,0x32,0x16,0x45,0x48,0xe5,0x26,0xae,
               0x90,0x22,0x43,0x68,0x51,0x7a,0xcf,0xea,
               0xbd,0x6b,0xb3,0x73,0x2b,0xc0,0xe9,0xda,
               0x99,0x83,0x2b,0x61,0xca,0x01,0xb6,0xde,
               0x56,0x24,0x4a,0x9e,0x88,0xd5,0xf9,0xb3,
               0x79,0x73,0xf6,0x22,0xa4,0x3d,0x14,0xa6,
               0x59,0x9b,0x1f,0x65,0x4c,0xb4,0x5a,0x74,
               0xe3,0x55,0xa5 ]);

var m = m_padded.subarray(32);
var c = c_padded.subarray(16);

var result;

/**
 * Analog of tests/secretbox3.cpp, expected result printed in tests/secretbox3.out.
 */
console.log("Testing of 'secret_box.pack', analog to tests/secretbox3.cpp");
result = sbox.pack(m, nonce, firstkey, arrFactory);
// result is cipher without the pad
compare(result, c);
// but it is a buffer view that hides these zeros
compare(new Uint8Array(result.buffer, 0, result.length+16), c_padded);
arrFactory.wipe(result);
console.log("PASS.\n");

/**
 * Analog of tests/secretbox4.cpp, expected result printed in tests/secretbox4.out.
 */
console.log("Testing of 'secret_box.open', analog to tests/secretbox4.cpp");
result = sbox.open(c, nonce, firstkey, arrFactory);
//result is message without the pad
compare(result, m);
//but it is a buffer view that hides these zeros
compare(new Uint8Array(result.buffer, 0, result.length+32), m_padded);
arrFactory.wipe(result);
console.log("PASS.\n");

/**
 * Test box with data less than 32 bytes (bug hunt -- fixed pad-on-fly in stream.xsalsa20_xor)
 */
var shortM = m.subarray(0, 10);
console.log("Testing of secret_box pack and open on short data");
result = sbox.pack(shortM, nonce, firstkey, arrFactory);
compare(result.subarray(16), c.subarray(16, 26));
result = sbox.open(result, nonce, firstkey, arrFactory);
compare(result, shortM);
arrFactory.wipe(result);
console.log("PASS.\n");

/**
 * Test packing with nonce
 */
console.log("Testing packing message with nonce");
result = new Uint8Array(40+m.length);	// prepare array for output bytes 
sbox.packIntoArrWithNonce(result, m, nonce, firstkey, arrFactory);
// first 24 bytes of result should contain nonce
compare(result.subarray(0,24), nonce);
// other bytes should contain cipher
compare(result.subarray(24), c);
console.log("PASS.\n");

/**
 * Test opening of array with nonce and cipher
 */
console.log("Testing opening message from array with nonce and cipher");
// prepare array with nonce and cipher
result = new Uint8Array(nonce.length+c.length);
result.set(nonce);
result.set(c, nonce.length);
result = sbox.openArrWithNonce(result, firstkey, arrFactory);
//result is message without the pad
compare(result, m);
//but it is a buffer view that hides these zeros
compare(new Uint8Array(result.buffer, 0, result.length+32), m_padded);
console.log("PASS.\n");


arrFactory.wipe(firstkey, nonce, m_padded, c_padded, result);
arrFactory.wipeRecycled();