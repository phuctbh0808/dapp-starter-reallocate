import * as anchor from '@project-serum/anchor';
import {getFixture, RESERVE_PUBKEY} from "./fixture";

(async () => {
    const { program, connection } = await getFixture();
    const [config] = anchor.web3.PublicKey.findProgramAddressSync(
        [RESERVE_PUBKEY.toBuffer()],
        program.programId,
    );
    // Get the new counter value
    const configAccount = await program.account.config.fetch(config);
    console.log(configAccount);
})()