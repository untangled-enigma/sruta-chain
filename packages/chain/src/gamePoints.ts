import { runtimeModule, state, runtimeMethod ,RuntimeModule } from "@proto-kit/module";
import { State, assert } from "@proto-kit/protocol";
import { Field, MerkleMap, MerkleMapWitness, PublicKey, Struct } from "o1js";


export class MessageVerificationInput extends Struct({
    root: Field
  }){}

export const messagesMap = new MerkleMap();

@runtimeModule()
export class GamePoints extends RuntimeModule<Record<string, never>>  {
    @state() public accountsRoot = State.from<Field>(Field);
    @state() public admin = State.from<PublicKey>(PublicKey);

    @runtimeMethod()
    public updatePoints(
       witness: MerkleMapWitness,
       valueBefore: Field,
       valueAfter: Field
    ): void {
        //TODO: root set logic
    }

    @runtimeMethod()
    public addPlayer(root:Field):void{
        assert( this.admin.get().value.equals(this.transaction.sender.value), "only admin call this")
        this.accountsRoot.set(root)
    }
}
