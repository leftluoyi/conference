$(document).ready(() => {
  if(typeof web3 !== 'undefined') {
    web3Provider = web3.currentProvider
  } else {
    web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
  }
  web3 = new Web3(web3Provider)


  const accounts = web3.eth.accounts
  let flag = true
  for(let account of accounts) {
    if(flag) {
      flag = false;
      continue;
    }
    $('#active_account').append('<option value="' + account + '">' + account + '</option>')
  }

  $.getJSON('Conference.json', async (data) => {
    const ConferenceArtifact = data;
    Conference = TruffleContract(ConferenceArtifact);
    Conference.setProvider(web3Provider)

    const conference = await Conference.new({from: accounts[0], gas: 1000000});
    $('#contract_address').html("Contract is deployed at: " + conference.address)
    conference.organizer.call().then(organizer => {
      $('#organizer_address').html("Organizer address is: " + organizer)
    })
    conference.quota.call().then(data => {
      $('#quota').val(data)
    })

    updateNumRegistrant(conference)    
    
    $('#change_quota').click(() => {
      conference.changeQuota($('#quota').val(), {from: accounts[0]})
    })

    $('#buy_ticket').click(() => {
      ticketPrice = web3.toWei(checkTicketPrice(), 'ether');
      conference.buyTicket({from: getActiveAccount(), value: ticketPrice})
    })

    $('#refund_ticket').click(() => {
      ticketPrice = web3.toWei(checkTicketPrice(), 'ether');
      conference.refundTicket(getActiveAccount(), ticketPrice, {from: accounts[0]})
    })




  })

  const updateNumRegistrant = (conference) => {
    conference.numRegistrants.call().then(data => {
      $('#num_registrant').html("Number of Registrants: " + data)
    })
  }

  const checkTicketPrice = () => {
    const price = parseFloat($('#price').val())
    if(isNaN(price)) {
      alert("Please input currect ticket price!")
    } else {
      return price
    }
  }

  const getActiveAccount = () => {
    return $('#active_account').val();
  }

  
})