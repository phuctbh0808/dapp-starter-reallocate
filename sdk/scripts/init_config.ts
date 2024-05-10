import * as anchor from '@project-serum/anchor';
import {getFixture} from "./fixture";
(async () => {
    const { program, connection } = await getFixture();
    const reserve = anchor.web3.Keypair.generate();
    const [config] = anchor.web3.PublicKey.findProgramAddressSync(
        [reserve.publicKey.toBuffer()],
        program.programId,
    );
    console.log('Reverse ', reserve.publicKey.toBase58());
    console.log(await connection.getLatestBlockhash());
    const tx =
        await program.methods.initConfig(reserve.publicKey, 1.2)
            .accounts({
                config,
                user: program.provider.publicKey,
            }).rpc();

    console.log("Init config success at tx", tx);

    // Get the new counter value
    const configAccount = await program.account.config.fetch(config);
    console.log(configAccount);
})()