export default async (promise, expectedRevertMessage = '') => {
  try {
    await promise;
  } catch (error) {
    let invalidOpcode = false;
    let outOfGas = false;
    let revert = false;
    if (expectedRevertMessage !== '') {
      // Check end of error string, it's where the revert reason is output.
      revert = error.message.indexOf(expectedRevertMessage) !== -1;
    } else {
      // TODO: Check jump destination to destinguish between a throw
      //       and an actual invalid jump.
      invalidOpcode = error.message.search('invalid opcode') >= 0;
      // TODO: When we contract A calls contract B, and B throws, instead
      //       of an 'invalid jump', we get an 'out of gas' error. How do
      //       we distinguish this from an actual out of gas event? (The
      //       testrpc log actually show an 'invalid jump' event.)
      outOfGas = error.message.search('out of gas') >= 0;
      revert = error.message.search('revert') >= 0;
    }

    assert(
      invalidOpcode || outOfGas || revert,
      "Expected throw with revert string '" +
        expectedRevertMessage +
        "', got '" +
        error +
        "' instead"
    );
    return;
  }
  assert.fail('Expected throw not received');
};
