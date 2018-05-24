pragma solidity ^0.4.23;

contract Conference {
	address public organizer;
	mapping (address => uint) public registrantsPaid;
	uint public numRegistrants;
	uint public quota;

	// modifier onlyOwner {
	// 	require(
	// 		msg.sender == organizer,
	// 		"Only organizer can call this function."
	// 	)
	// }

	event Deposit(address _from, uint _amount);
	event Refund(address _to, uint _aount);

	constructor() public {
		organizer = msg.sender;
		quota = 500;
		numRegistrants = 0;
	}

	function buyTicket() payable public returns (bool success) {
		if (numRegistrants >= quota) { return false; }
		registrantsPaid[msg.sender] = msg.value;
		numRegistrants++;
		Deposit(msg.sender, msg.value);
		return true;
	}

	function changeQuota(uint newquota) public {
		if (msg.sender != organizer) { return;}
		quota = newquota;
	}

	function refundTicket(address recipient, uint amount) public {
		if (msg.sender != organizer) { return; }
		if(registrantsPaid[recipient] == amount) {
			address myAddress = this;
			if (myAddress.balance >= amount) {
				recipient.transfer(amount);
				registrantsPaid[recipient] = 0;
				numRegistrants--;
				Refund(recipient, amount);
			}
		}
	}

	function destroy() public {
		if (msg.sender == organizer) {
			selfdestruct(organizer);
		}
	}
}