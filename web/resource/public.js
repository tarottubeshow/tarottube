$('.full-height').css({
  minHeight: window.innerHeight,
})

<<<<<<< HEAD
function completePayment(ev, amount) {
  fetch('/charge-reading.json', {
    method: 'POST',
    body: JSON.stringify({
      token: ev.token.id,
      email: ev.payerEmail,
      name: ev.payerName,
=======
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
>>>>>>> origin/master
      amount: amount,
    }),
    headers: {'content-type': 'application/json'},
  })
<<<<<<< HEAD
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
=======
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

  var checkoutFunc
  paymentRequest.canMakePayment().then(
    function(result) {
      if (result) {
        checkoutFunc = paymentRequest.show
      } else {
        checkoutFunc = function() {
          checkoutLame(name, amount)
        }
      }
      $(buttonCls).click(checkoutFunc)
    }
  )

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
>>>>>>> origin/master

$('.cta').click(function(ev) {
  const $target = $(ev.currentTarget)
  const cta = $target.data('cta')
  if(cta == null) {
    window.scrollTo(0, document.body.scrollHeight)
  } else if(cta == 'email') {
    window.open('mailto:keiran@tarottube.com')
  }
})
