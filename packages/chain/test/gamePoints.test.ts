import { TestingAppChain } from "@proto-kit/sdk";
import { Field, PrivateKey, PublicKey } from "o1js";

import { GamePoints, accountsMap } from "../src/gamePoints";

import { log } from "@proto-kit/common";

log.setLevel("ERROR");


describe("Secure Spy-Message Network", () => {
    let adminPrivateKey: PrivateKey, admin: PublicKey
    let appChain: ReturnType<
        typeof TestingAppChain.fromRuntime<{
            GamePoints: typeof GamePoints
        }>
    >;
    let gamePoints: GamePoints

    beforeAll(async () => {
        adminPrivateKey = PrivateKey.random();
        admin = adminPrivateKey.toPublicKey()

        appChain = TestingAppChain.fromRuntime({
            GamePoints
        });

        adminPrivateKey = PrivateKey.random();
        admin = adminPrivateKey.toPublicKey();


        appChain.configurePartial({
            Runtime: {
                Balances: {},
                GamePoints: {
                    admin
                }
            },
        });

        await appChain.start();

        gamePoints = appChain.runtime.resolve("GamePoints");
        appChain?.setSigner(adminPrivateKey);
    }, 1_000_000);

    test("admin is set", async () => {
        const adminRoot = gamePoints.config.admin;
        // gamePoints.config.admin;
        expect(adminRoot.toBase58()).toBe(admin.toBase58())
    })

    test("Add a account", async () => {
        appChain?.setSigner(adminPrivateKey);

        const player1 = Field("1000")
        accountsMap.set(player1, Field("0"))

        const tx1 = await appChain.transaction(admin, () => {
            gamePoints.addPlayer(accountsMap.getRoot())
        });

        await tx1.sign();
        await tx1.send();

        const block = await appChain.produceBlock();
        expect(block?.transactions[0].status.toBoolean()).toBe(true);

        const newRoot = await appChain.query.runtime.GamePoints.accountsRoot.get();
        expect(newRoot?.toString()).toBe(accountsMap.getRoot().toString())

    })

    test("update account points", async () => {
        const player1 = Field("1000")
        const newPoints = Field("200")
        accountsMap.set(player1, newPoints)


        const witness = accountsMap.getWitness(player1)
        const tx1 = await appChain.transaction(admin, () => {
            gamePoints.updatePoints( witness,player1,Field(0),newPoints )
        });

        await tx1.sign();
        await tx1.send();

        const block = await appChain.produceBlock();
        expect(block?.transactions[0].status.toBoolean()).toBe(true);

        const newRoot = await appChain.query.runtime.GamePoints.accountsRoot.get();
        expect(newRoot?.toString()).toBe(accountsMap.getRoot().toString())

    })


})