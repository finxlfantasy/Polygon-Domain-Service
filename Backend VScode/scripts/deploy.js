const main = async() => {
    const domainContractFactory = await hre.ethers.getContractFactory("Domains");
    const domainContract = await  domainContractFactory.deploy("hunter");
    await domainContract.deployed();

    console.log("Contract deployed to:", domainContract.address);
    const domainName = "hunter";
    
    let rawPrice = await domainContract.price(domainName);
    let price = (parseInt(rawPrice, 10) / 10 ** 18).toString();
    // We’re passing in a second variable - value. Shmoney.yyy
    let txn = await domainContract.register(domainName, {value: hre.ethers.utils.parseEther(price) });
    await txn.wait();
    console.log("Minted domain ${domainName}.hunter");

    txn = await domainContract.setRecord(domainName, "Why is the anime called hunter x hunter?");
    await txn.wait();
    console.log("Set record for .hunter");

    const address = await domainContract.getAddress(domainName);
    console.log("Owner of domain hunter:${domainName}:", address);

    const balance = await hre.ethers.provider.getBalance(domainContract.address);
    console.log("Contract balance:", hre.ethers.utils.formatEther(balance));
}

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    }   catch (error) {
        console.log(error);
        process.exit(1);
    }
 };

 runMain();