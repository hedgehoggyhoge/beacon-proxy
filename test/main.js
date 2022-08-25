// test/main-test.js
const { expect } = require("chai");
const { ethers, upgrades} = require("hardhat");

describe("BeaconProxy", function () {
    it("Should do what we need when deployed from Hardhat", async function () {
        const Version1 = await ethers.getContractFactory("Version1");
        const Version2 = await ethers.getContractFactory("Version2");

        // Развертывание контракта, который хранит указатель на актуальную
        // версию контракта, (Implementation Pointer на диаграмме)
        const beacon = await upgrades.deployBeacon(Version1);
        await beacon.deployed();
        console.log("Beacon deployed to:", beacon.address);

        // Развертывание проксей (и, соответственно, стораджей)
        const proxy1 = await upgrades.deployBeaconProxy(beacon, Version1, []);
        await proxy1.deployed();
        console.log("Proxy1 deployed to:", proxy1.address);

        const proxy2 = await upgrades.deployBeaconProxy(beacon, Version1, []);
        await proxy2.deployed();
        console.log("Proxy2 deployed to:", proxy2.address);

        // Переменные для отправки запросов через с прокси.
        const proxy1_accessor = Version1.attach(proxy1.address)
        const proxy2_accessor = Version1.attach(proxy2.address)
        // И вот начались наши тесты.
        {
            const setValueTx = await proxy1_accessor.setCounter(105)
            await setValueTx.wait()
        }
        {
            const value = await proxy1_accessor.getCounter()
            expect(value.toString()).to.equal('105')
        }
        {
            const value = await proxy2_accessor.getCounter()
            expect(value.toString()).to.equal('100')
        }
        // Как мы видим, данные хранятся и правда внутри прокси-контрактов,
        // поэтому в одном переменная равна 105, а в другом 100.

        // Производим обновление указателя на версию контракта.
        await upgrades.upgradeBeacon(beacon, Version2);
        {
            const setValueTx = await proxy1_accessor.setCounter(105)
            await setValueTx.wait()
        }
        {
            const value = await proxy1_accessor.getCounter()
            expect(value.toString()).to.equal('610')  // 105 + 500 + 5
        }
        {
            const value = await proxy2_accessor.getCounter()
            expect(value.toString()).to.equal('105')
        }
        // Видно, что на обоих проксях новое поведение.

    });
});