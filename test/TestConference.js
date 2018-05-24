const Conference = artifacts.require("Conference")

contract('Conference', (accounts) =>  {
	it("create new conference", async () => {
		const conference = await Conference.new();
		return conference.quota().then((quota) => {
			assert.equal(quota, 500, "quota should be 500");
		})
	})

	
	it("test buy ticket", async () => {
		const conference = await Conference.new();

		const account = accounts[2];
		const startBalance = await web3.eth.getBalance(account).toNumber()

		ticketPrice = web3.toWei(0.1, 'ether');
		conference.buyTicket({from: account, value: ticketPrice}).then(async (result) => {
			const endBalance = await web3.eth.getBalance(account).toNumber()
			const diff = startBalance - endBalance
			assert.isTrue(diff > ticketPrice, "success buy ticket");
		})
	})
})
