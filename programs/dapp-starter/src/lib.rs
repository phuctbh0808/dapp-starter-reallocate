use anchor_lang::prelude::*;
declare_id!("JEJ2s6gk5ssAtwPV29UNgUMEHvWC9MXZYRH1Q7QuGBLi");

#[program]
pub mod dapp_starter {
    use super::*;
    pub fn initialize(_ctx: Context<Initialize>) -> ProgramResult {
        Ok(())
    }

    pub fn increment(ctx: Context<Increment>) -> ProgramResult {
        let config = &mut ctx.accounts.config;
        config.count += 1;
        Ok(())
    }

    pub fn init_config(ctx: Context<InitConfig>, reserve: Pubkey, apy: f32, start_time: u32, end_time: u32) -> ProgramResult {
        let config = &mut ctx.accounts.config;
        config.reserve = reserve;
        config.apy = apy;
        config.is_initialized = true;
        config.start_time = start_time;
        config.end_time = end_time;
        config.reserve_clone = reserve;
        Ok(())
    }

    pub fn close_config(ctx: Context<CloseConfig>, reserve: Pubkey) -> ProgramResult {
        // We close account manually to ensure backward compatability
        // If we close an account using Anchor, we need to redeploy program 2 times
        let config = &mut ctx.accounts.config;
        let user = &ctx.accounts.user;
        let dest_starting_lamports = user.lamports();
        **user.lamports.borrow_mut() = dest_starting_lamports.checked_add(config.lamports()).unwrap();
        **config.lamports.borrow_mut() = 0;

        config.assign(&System::id());
        config.realloc(0, false)?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info>{
    #[account(
        init, 
        payer = deployer, 
        space = 8 + 8,
    )]
    pub config: Account<'info, Counter>,

    #[account(mut)]
    pub deployer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Increment<'info>{
    #[account(
        mut
    )]
    pub config: Account<'info, Counter>,

    #[account(mut)]
    pub user: Signer<'info>,
}

#[account]
pub struct Counter {
    pub count: u64,
}

#[derive(Accounts)]
#[instruction(reserve: Pubkey)]
pub struct InitConfig<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 4 + 1 + 32 * 2 + 16 * 6,
        seeds = [reserve.as_ref()],
        bump,
    )]
    pub config: Account<'info, Config>,

    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Config {
    pub reserve: Pubkey,
    pub apy: f32,
    pub start_time: u32,
    pub end_time: u32,
    pub is_initialized: bool,
    pub reserve_clone: Pubkey,
    pub _reserve_space: [u128; 4],
}

#[derive(Accounts)]
#[instruction(reserve: Pubkey)]
pub struct CloseConfig<'info> {
    /// CHECK
    #[account(
        mut,
        seeds = [reserve.as_ref()],
        bump,
    )]
    pub config: AccountInfo<'info>,
    #[account(mut)]
    pub user: Signer<'info>,
}