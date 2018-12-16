class Cart {
  constructor(containerIconCart, source, containerPageCart) {
    this.containerIconCart = containerIconCart;
    this.source = source;
    this.containerPageCart = containerPageCart;
    this.amount = 0;
    this.cartItems = [];
    this._init(this.source);
  }

  _init(source) {
    if (!localStorage.getItem('cartItems')) {
      fetch(source)
        .then(result => result.json())
        .then(data => {
          for (const item of data.items) {
            this.cartItems.push(item);
            this._renderItem(item);
            this._renderItemBigCart(item);
          }
          this.amount = data.amount;
          this._renderSum();
        })
    } else {
      this.cartItems = JSON.parse(localStorage.getItem('cartItems'));
      this.amount = 0;
      for (let item of this.cartItems) {
        this.amount += item.price * item.quantity;
        this._renderItem(item);
        this._renderItemBigCart(item);
      }
      this._renderSum();
    }
  }

  clearCart() {
    this.cartItems = [];
    this.amount = 0;
    this._renderSum();
    $(this.containerIconCart).empty();
    $(this.containerPageCart).empty();
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  _renderSum() {
    this.amount = 0;
    for (const item of this.cartItems) {
      this.amount += item.price * item.quantity;
    }
    $(".cartTotalPrice").text(`$${this.amount.toFixed(2)}`);
    $('.grandTotalSum').text(`$${this.amount.toFixed(2)}`);
    $('.subTotal').text(`SUB TOTAL $${this.amount.toFixed(2)}`);

  }

  _renderItemBigCart(item) {
    if (!this.containerPageCart) {
      return
    }
    let $cartWrapper = $(this.containerPageCart);
    let $cartItem = $('<tr/>', {
      "data-id": item.id_product
    });
    let $itemInfo = $('<td/>', {
      class: "tcolumn1",
      "data-id": item.id_product
    });
    let $abortWrapper = $('<div/>');
    let $itemImg = $('<div/>', {
      class: "shop-cart-img"
    });
    let $imgWrapper = $('<a/>', {
      href: "single_page.html"
    });
    let $img = $('<img/>', {
      src: item.imgSrc,
      alt: item.alt
    });
    $imgWrapper.append($img);
    let $textWrapper = $('<div/>', {
      class: "shop-cart-text"
    });
    $itemImg.append($imgWrapper);
    $textWrapper.append(`<h3 class="shopping-cart-quick-name">${item.product_name}</h3>`);
    $textWrapper.append(`<p><span>Color:</span> Red</p>`);
    $textWrapper.append(`<p><span>Size:</span> XL</p>`);
    $itemInfo.append($itemImg);
    $itemInfo.append($textWrapper);
    $cartItem.append($itemInfo);
    $cartItem.append(`<td class="tcolumn2">${item.price.toFixed(2)}</td>`);

    $cartItem.append(`<td class="tcolumn2"><input class="bigCartQuantity" data-id="${item.id_product}" 
    type="number" value="${item.quantity}"></td>`);
    $cartItem.append(`<td class="tcolumn2">FREE</td>`);
    let sumResult = item.price * item.quantity;
    $cartItem.append(`<td class="tcolumn2 itemTotal">$${sumResult.toFixed(2)}</td>`);
    let $cancelWrapper = $('<td/>', {
      class: "tcolumn3",
      "data-id": item.id_product
    });
    let $deleteBtnWrapper = $('<div/>', {
      class: "shop-cart-abort",
      'data-id': item.id_product
    });
    $deleteBtnWrapper.append(`<a class="testClass" data-id=${item.id_product} href="#">&#10006;</a>`);
    $abortWrapper.append($deleteBtnWrapper);
    $cancelWrapper.append($abortWrapper);
    $cartItem.append($cancelWrapper);
    $cartWrapper.append($cartItem);
    $deleteBtnWrapper.on('click', (e) => {
      e.preventDefault();
      this._remove(item.id_product)
    });
    this._renderSum();
    $(`tr[data-id="${item.id_product}"]`).on('input', '.bigCartQuantity', () => {
      this._setItemQuantity(item.id_product);
      localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    })

  }

  _setItemQuantity(productId) {
    let find = this.cartItems.find(product => product.id_product === productId);
    let value = +$(this.containerPageCart).find(`.bigCartQuantity[data-id="${productId}"]`).val();
    if (value > 0 && Number.isInteger(value)) {
      find.quantity = value;
      this._updateCart(find);
    } else {
      return
    }
    this._renderSum();

  }


  _renderItem(item) {
    let $itemWrapper = $('<div/>', {
      class: "shopping-cart-quick__block",
      "data-id": item.id_product
    });
    let $imgWrapper = $('<a/>', {
      href: "single_page.html"
    });
    let $img = $('<img/>', {
      src: item.imgSrc,
      alt: item.alt
    });
    $imgWrapper.append($img);
    let $textWrapper = $('<div/>', {
      class: "shopping-cart-quick-text"
    });
    $textWrapper.append(`<h2 class="shopping-cart-quick-name">${item.product_name}</h2>`);
    //$textWrapper.append(`<h2>Rating ${elem.rating}/5.0</h2>`);
    //$textWrapper.append($(this._getItemRating(item)));
    $textWrapper.append(`<h3 class="shopping-cart-quick-text-price">${item.quantity} x $${item.price.toFixed(2)}</h3>`);
    let $cancelWrapper = $('<div/>', {
      class: "shopping-cart-icon-cancel",
      "data-id": item.id_product
    });
    let $deleteBtnWrapper = $('<div/>', {
      class: "shop-cart-abort",
      'data-id': item.id_product
    });
    $deleteBtnWrapper.append(`<a class="testClass" data-id=${item.id_product} href="#">&#10006;</a>`);
    $cancelWrapper.append($deleteBtnWrapper);
    $itemWrapper.append($imgWrapper);
    $itemWrapper.append($textWrapper);
    $itemWrapper.append($cancelWrapper);
    $(this.containerIconCart).append($itemWrapper);
    $deleteBtnWrapper.on('click', (e) => {
      e.preventDefault();
      this._remove(item.id_product)
    })
  }

  _remove(productId) {
    let find = this.cartItems.find(product => product.id_product === productId);
    if (find) {
      if (find.quantity !== 1) {
        find.quantity--;
        this._updateCart(find);
      } else {
        $(this.containerIconCart).find(`div[data-id="${productId}"]`).remove();
        $(this.containerPageCart).find(`tr[data-id="${productId}"]`).remove();
        let idx = this.cartItems.indexOf(find);
        this.cartItems.splice(idx, 1);
        this._updateCart(find);
      }
      localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
      this._renderSum();

    }
  }

  addElement(item) {
    let productId = $(item).data('id');
    let find = this.cartItems.find(product => product.id_product === productId);
    if (find) {
      find.quantity++;
      this._updateCart(find);
    } else {
      let product = {
        id_product: productId,
        price: $(element).data('price'),
        product_name: $(element).data('name'),
        imgSrc: $(element).data('imgSrc'),
        alt: $(element).data('alt'),
        quantity: 1
      };
      this.cartItems.push(product);
      this._renderItem(product);
    }
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    this._renderSum();
  }

  static _updateCart(product) {
    let $container = $(`div[data-id="${product.id_product}"]`);
    $container.find('.shopping-cart-quick-text-price').text(`${product.quantity} x $${product.price.toFixed(2)}`);
    let $container2 = $(`tr[data-id="${product.id_product}"]`);
    $container2.find('.bigCartQuantity').val(`${product.quantity}`);
    let totalPrice = product.quantity * product.price;
    $container2.find('.itemTotal').text(`$${totalPrice.toFixed(2)}`);
  }
}