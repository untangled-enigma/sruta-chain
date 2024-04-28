import { GamePoints } from './gamePoints'
import { ModulesConfig } from "@proto-kit/common";

export const modules = {
  GamePoints,
};

export const config: ModulesConfig<typeof modules> = {
  GamePoints: { },
};

export default {
  modules,
  config,
};
