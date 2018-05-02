$('.full-height').css({
  minHeight: window.innerHeight,
})

function completePayment(ev, amount) {
  fetch('/charge-reading.json', {
    method: 'POST',
    body: JSON.stringify({
      token: ev.token.id,
      email: ev.payerEmail,
      name: ev.payerName,
      amount: amount,
    }),
    headers: {'content-type': 'application/json'},
  })
  .then(function(response) {
    if (response.ok) {
      ev.complete('success');
      $('.checkout-buttons').hide()
      $('.thank-you').show()
    } else {
      ev.complete('fail');
    }
  })
}

var paymentRequest15 = window.STRIPE.paymentRequest({
  country: 'US',
  currency: 'usd',
  total: {
    label: '15-Minute Tarot Reading',
    amount: 4000,
  },
  requestPayerName: true,
  requestPayerEmail: true,
})

paymentRequest15.on('token', function(ev) {
  completePayment(ev, 4000)
})

var paymentRequest30 = window.STRIPE.paymentRequest({
  country: 'US',
  currency: 'usd',
  total: {
    label: '30-Minute Tarot Reading',
    amount: 6000,
  },
  requestPayerName: true,
  requestPayerEmail: true,
})

paymentRequest30.on('token', function(ev) {
  completePayment(ev, 6000)
})

$('.charge-15').click(function() {
  paymentRequest15.canMakePayment().then(function(result) {
    paymentRequest15.show()
  })
})

$('.charge-30').click(function() {
  paymentRequest30.canMakePayment().then(function(result) {
    paymentRequest30.show()
  })
})

$('.cta').click(function(ev) {
  const $target = $(ev.currentTarget)
  const cta = $target.data('cta')
  if(cta == null) {
    window.scrollTo(0, document.body.scrollHeight)
  } else if(cta == 'email') {
    window.open('mailto:keiran@tarottube.com')
  }
})
