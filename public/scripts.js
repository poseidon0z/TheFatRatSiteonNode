if (document.readyState == 'loading') {
  document.addEventListener('DOMContentLoaded', ready);
} else {
  ready;
}

function ready() {
  var removeCartItemButtons = document.getElementsByClassName('btn-danger');
  for (var i = 0; i < removeCartItemButtons.length; i++) {
    var button = removeCartItemButtons[i];
    button.addEventListener('click', removeCartEvent);
  }

  var quantityInputs = document.getElementsByClassName('cart-quantity-input');
  for (var i = 0; i < quantityInputs.length; i++) {
    var input = quantityInputs[i];
    input.addEventListener('change', quantityChanged);
  }

  var addToCartButtons = document.getElementsByClassName('shop-item-btn');
  for (var i = 0; i < addToCartButtons.length; i++) {
    var button = addToCartButtons[i];
    button.addEventListener('click', addToCartClicked);
  }

  if (document.getElementsByClassName('btn-purchase')[0]) {
    document
      .getElementsByClassName('btn-purchase')[0]
      .addEventListener('click', purchaseClicked);
  }

  var tourButttons = document.getElementsByClassName('tour-btn');
  for (var i = 0; i < tourButttons.length; i++) {
    var button = tourButttons[i];
    button.addEventListener('click', tourLinkClicked);
  }
}

function purchaseClicked() {
  var items = [];
  const cartItems = document.getElementsByClassName('cart-product');
  for (const cartItem of cartItems) {
    const itemId = cartItem.dataset.ItemId;
    const quantityColumn = cartItem.getElementsByClassName('cart-quantity');
    const quantity = quantityColumn[0].getElementsByClassName(
      'cart-quantity-input'
    )[0].value;
    items.push({
      id: itemId,
      quantity: quantity,
    });
  }
  fetch('/purchase', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      items: items,
    }),
  })
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      alert(data.message);
      var cartItems = document.getElementsByClassName('cart-items')[0];
      while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild);
      }
      updateCartTotal();
    })
    .catch((error) => {
      console.log(error);
    });
}

function addToCartClicked(event) {
  var button = event.target;
  var shopItem = button.parentElement.parentElement;
  var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText;
  var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText;
  var img = shopItem.getElementsByClassName('shop-item-image')[0].src;
  var id = shopItem.dataset.ItemId;
  addItemToCart(title, price, img, id);
  updateCartTotal();
}

function addItemToCart(title, price, imgSrc, id) {
  var cartItems = document.getElementsByClassName('cart-items')[0];
  var cartItemNames = cartItems.getElementsByClassName('cart-item-title');
  for (var i = 0; i < cartItemNames.length; i++) {
    if (cartItemNames[i].innerText == title) {
      alert('This item is already in the cart!');
      return;
    }
  }
  var cartRow = document.createElement('div');
  cartRow.dataset.ItemId = id;
  cartRow.classList.add('cart-row');
  cartRow.classList.add('cart-product');
  var cartRowContents = `
  <div class="cart-item cart-column">
      <img
          class="cart-item-image"
          src="${imgSrc}"
          alt="fly away album art"
          width="100"
          height="100"
      />
      <span class="cart-item-title">${title}</span>
  </div>
  <span class="cart-price cart-column">${price}</span>
  <div class="cart-quantity cart-column">
    <input class="cart-quantity-input" type="number" value="1" />
    <button class="btn btn-danger" role="button">REMOVE</button>
  </div>`;
  cartRow.innerHTML = cartRowContents;
  cartItems.append(cartRow);
  cartRow
    .getElementsByClassName('btn-danger')[0]
    .addEventListener('click', removeCartEvent);
  cartRow
    .getElementsByClassName('cart-quantity-input')[0]
    .addEventListener('change', quantityChanged);
}

function removeCartEvent(event) {
  var buttonClicked = event.target;
  buttonClicked.parentElement.parentElement.remove();
  updateCartTotal();
}

function quantityChanged(event) {
  var input = event.target;
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }
  updateCartTotal();
}

function tourLinkClicked() {
  alert('Sorry... Event has ended');
}

function updateCartTotal() {
  var cartItemContainer = document.getElementsByClassName('cart-items')[0];
  var cartRows = cartItemContainer.getElementsByClassName('cart-row');
  var total = 0;
  for (var i = 0; i < cartRows.length; i++) {
    var cartRow = cartRows[i];
    var priceElement = cartRow.getElementsByClassName('cart-price')[0];
    var quantityElement = cartRow.getElementsByClassName(
      'cart-quantity-input'
    )[0];
    var price = parseFloat(priceElement.innerText.replace('$', ''));
    var quantity = parseFloat(quantityElement.value);
    total = total + price * quantity;
  }
  total = Math.round(total * 100) / 100;
  document.getElementsByClassName('cart-total-price')[0].innerText =
    '$' + total;
}
