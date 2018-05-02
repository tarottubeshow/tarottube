$('.full-height').css({
  minHeight: window.innerHeight,
})

function showFail() {
  alert("Something went wrong!")
}

function showThankYou() {
  $('.checkout-buttons').hide()
  $('.thank-you').show()
}

function doCheckout(token, amount, cb) {
  fetch('/charge-reading.json', {
    method: 'POST',
    body: JSON.stringify({
      token: token,
      amount: amount,
    }),
    headers: {'content-type': 'application/json'},
  })
  .then(cb)
}

function completePayment(ev, amount) {
  doCheckout(
    ev.token.id,
    amount,
    function(response) {
      if (response.ok) {
        ev.complete('success');
        showThankYou()
      } else {
        ev.complete('fail');
      }
    },
  )
}

function checkoutLame(name, amount) {
  var handler = StripeCheckout.configure({
    key: window.STRIPE_KEY,
    image: 'https://tarottube.com/resource/favicon.png',
    locale: 'auto',
    token: function(token) {
      doCheckout(
        token.id,
        amount,
        function(response) {
          if (response.ok) {
            showThankYou()
          } else {
            showFail()
          }
        },
      )
    }
  })
  handler.open({
    name: 'Tarot Tube',
    description: name,
    amount: amount,
  });
}

function setupRequest(name, amount, buttonCls) {
  var paymentRequest = window.STRIPE.paymentRequest({
    country: 'US',
    currency: 'usd',
    total: {
      label: name,
      amount: amount,
    },
    requestPayerName: true,
    requestPayerEmail: true,
  })

  paymentRequest.on('token', function(ev) {
    completePayment(ev, amount)
  })


  $(buttonCls).click(function() {
    paymentRequest.canMakePayment().then(function(result) {
      if (result) {
        paymentRequest.show()
      } else {
        checkoutLame(name, amount)
      }
    })
  })
}

setupRequest(
  "15-Minute Tarot Reading",
  4000,
  '.charge-15'
)

setupRequest(
  "30-Minute Tarot Reading",
  6000,
  '.charge-30'
)

$('.cta').click(function(ev) {
  const $target = $(ev.currentTarget)
  const cta = $target.data('cta')
  if(cta == null) {
    window.scrollTo(0, document.body.scrollHeight)
  } else if(cta == 'email') {
    window.open('mailto:keiran@tarottube.com')
  }
})
