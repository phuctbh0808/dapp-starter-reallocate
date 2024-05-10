import * as anchor from '@project-serum/anchor';
import {getFixture, RESERVE_PUBKEY} from "./fixture";
(async () => {
    const { program, connection } = await getFixture();
    const reserve = RESERVE_PUBKEY;
    const [config] = anchor.web3.PublicKey.findProgramAddressSync(
        [reserve.toBuffer()],
        program.programId,
    );
    const tx =
        await program.methods.initConfig(reserve, 1.2, 1000, 2000)
            .accounts({
                config,
                user: program.provider.publicKey,
            }).rpc();

    console.log("Init config success at tx", tx);

    // Get the new counter value
    const configAccount = await program.account.config.fetch(config);
    console.log(configAccount);
})()