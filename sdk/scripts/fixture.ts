import * as anchor from '@project-serum/anchor';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import {DappStarter} from "../../target/types/dapp_starter";
import {PublicKey} from "@solana/web3.js";

dotenv.config();
export async function getFixture() {
    const connection = new anchor.web3.Connection(process.env.RPC_URL, 'confirmed');
    console.log('connection ', connection.rpcEndpoint);
    const dataKeypair = fs.readFileSync(path.join(os.homedir(), '.config/renec/id.json'));
    const keypair = anchor.web3.Keypair.fromSecretKey(
        Uint8Array.from(JSON.parse(dataKeypair.toString()))
    )

    const provider = new anchor.AnchorProvider(connection, new anchor.Wallet(keypair), { commitment: 'confirmed'} );

    anchor.setProvider(provider);
    const program = anchor.workspace.DappStarter as anchor.Program<DappStarter>;

    return { program, provider, connection };
}

export const RESERVE_PUBKEY = new PublicKey("AV9hvRU3zSvpQzXmb9nvwvZPNCLPWKnYzHwv7LWjQCKW");
export const RESERVE_PUBKEY_2 = new PublicKey("6RUMsvAkyvzV9XFwFgdHx9GSsGoUZY921EjehRbP3nwW");
