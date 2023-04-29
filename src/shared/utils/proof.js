export default async function generateProof (input) {
  try {
    const { proof, publicSignals } = await window.snarkjs.groth16.fullProve(
      input,
      "/main.wasm",
      "/main.zkey"
    );
    const finalRes = {
      proof: proof,
      publicSignals: publicSignals
    };
    return finalRes;
  } catch (err) {
    console.log(err);
    return -1;
  }
}

