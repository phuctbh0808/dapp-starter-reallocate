import * as anchor from '@project-serum/anchor';
import {getFixture, RESERVE_PUBKEY} from "./fixture";
(async () => {
    const { program, connection } = await getFixture();
    const reserve = RESERVE_PUBKEY;
    const [config] = anchor.web3.PublicKey.findProgramAddressSync(
        [reserve.toBuffer()],
        program.programId,
    );
    try {
        const tx =
            await program.methods.closeConfig(reserve)
                .accounts({
                    config,
                    user: program.provider.publicKey,
                }).rpc();

        console.log("Close config success at tx", tx);
    } catch (error) {
        console.error(error);
        throw error;
    }
})()