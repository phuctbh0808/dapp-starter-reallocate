import * as anchor from "@project-serum/anchor";
import { DappStarter } from "../target/types/dapp_starter";
import * as assert from "assert";
import {Program} from "@project-serum/anchor";

describe("dapp-starter", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const config = anchor.web3.Keypair.generate();

  const program = anchor.workspace.DappStarter as Program<DappStarter>;

  it("Is initialized!", async () => {
    const tx = await program.rpc.initialize({
      accounts: {
        config: config.publicKey,
        deployer: program.provider.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [config],
    });
    console.log("Your transaction signature", tx);

    // Get the new counter value
    const counter = await program.account.counter.fetch(config.publicKey);
    assert.equal(counter.count, 0, "expect counter value to be 0");
  });

  it("Increment!", async () => {
    const tx = await program.rpc.increment({
      accounts: {
        config: config.publicKey,
        user: program.provider.publicKey,
      },
      signers: [],
    });

    // Get the new counter value
    const counter = await program.account.counter.fetch(config.publicKey);
    assert.equal(counter.count, 1, "expect counter value to be 1");
  });

  it("Init config", async () => {
    const reserve = anchor.web3.Keypair.generate();
    const [config] = anchor.web3.PublicKey.findProgramAddressSync(
        [reserve.publicKey.toBuffer()],
        program.programId,
    );
    try {
      const tx =
          await program.methods.initConfig(reserve.publicKey, 1.2, 1000, 2000)
              .accounts({
                config,
                user: program.provider.publicKey,
              }).rpc();

      console.log("Init config success at tx", tx);
    } catch (error) {
      console.error(error);
      throw error;
    }

    // Get the new counter value
    const configAccount = await program.account.config.fetch(config);
    console.log(configAccount);
  });
});
