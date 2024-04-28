import { runtimeModule, state, runtimeMethod ,RuntimeModule } from "@proto-kit/module";
import { State, assert } from "@proto-kit/protocol";
import { Field, MerkleMap, MerkleMapWitness, PublicKey, Struct } from "o1js";


export class MessageVerificationInput extends Struct({
    root: Field
  }){}

export const accountsMap = new MerkleMap();

interface GamePointConfig {
    admin: PublicKey;
}


@runtimeModule()
export class GamePoints extends RuntimeModule<GamePointConfig>  {
    @state() public accountsRoot = State.from<Field>(Field);

    @runtimeMethod()
    public updatePoints(
       witness: MerkleMapWitness,
       accountNo: Field,
       valueBefore: Field,
       valueAfter: Field
    ): void {
        const [root, key] = witness.computeRootAndKey(valueBefore)
        assert(this.accountsRoot.get().value.equals(root), "Root mismatch" )
        assert(accountNo.equals(key), "Key mismatch" )

        const [newRoot,] = witness.computeRootAndKey(valueAfter)
        this.accountsRoot.set(newRoot)
    }

    @runtimeMethod()
    public addPlayer(root:Field):void{
        //TODO: Add proof to check for older values
        assert(this.config.admin.equals(this.transaction.sender.value), "only admin call this")
        this.accountsRoot.set(root)
    }
}
