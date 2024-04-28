import { PublicKey } from 'o1js';
import { GamePoints } from './gamePoints'
import { Balances } from './balances'
import { Balance } from "@proto-kit/library";
import { ModulesConfig } from "@proto-kit/common";
import 'dotenv/config'

export const modules = {
  GamePoints,
  Balances,
};

const adminPublicStr = process.env.ADMIN_PUB_KEY || ""
const admin = PublicKey.fromBase58(adminPublicStr)

export const config: ModulesConfig<typeof modules> = {
  GamePoints: {
    admin
   },
   Balances: {
    totalSupply: Balance.from(10_000),
  },
};

export default {
  modules,
  config,
};
