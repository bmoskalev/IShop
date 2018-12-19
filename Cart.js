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
        $('.span-st').text(`$${this.amount.toFixed(2)}`);
        $('.span-gt').text(`$${this.amount.toFixed(2)}`);

    }

    _renderItemBigCart(item) {
        if (!this.containerPageCart) {
            return
        }
        let $cartWrapper = $(this.containerPageCart);
        let $cartItem = $('<div/>', {
            class: "cart-item",
            "data-id": item.id_product
        });
        let $itemInfo = $('<div/>', {
            class: "sh-proddet-column",
            "data-id": item.id_product
        });
        let $itemImg = $('<div/>', {
            class: "sh-proddet-foto"
        });
        let $imgWrapper = $('<a/>', {
            href: "singlepage.html"
        });
        let $img = $('<img/>', {
            class: "sh-proddet-img",
            src: item.imgSrc,
            alt: item.alt
        });
        $imgWrapper.append($img);
        $itemImg.append($imgWrapper);
        $itemInfo.append($itemImg);
        let $textWrapper = $('<div/>', {
            class: "sh-proddet-desc"
        });
        $textWrapper.append(`<p class="sh-proddet-desc-name">${item.product_name}</p>`);
        $textWrapper.append(`<p class="sh-proddet-desc-cs">Color:<span class="sh-proddet-desc-cs-value">Red</span></p>`);
        $textWrapper.append(`<p class="sh-proddet-desc-cs">Size:<span class="sh-proddet-desc-cs-value">xll</span></p>`);
        $itemInfo.append($textWrapper);
        $cartItem.append($itemInfo);
        $cartItem.append(`<div class="sh-other-columns"><p class="cart-item-text">$${item.price.toFixed(2)}</p></div>`);
        $cartItem.append(`<div class="sh-other-columns"><input class="sh-input-box" data-id="${item.id_product}" type="number" value="${item.quantity}" min="1"></div>`);
        $cartItem.append(`<div class="sh-other-columns"><p class="cart-item-text">free</p></div>`);
        let costItems = item.price * item.quantity;
        $cartItem.append(`<div class="sh-other-columns"><p class="cart-item-text">$${costItems.toFixed(2)}</p></div>`);
        let $itemOtherColumns = $('<div/>', {
            class: "sh-other-columns"
        });
        let $deleteBtnWrapper = $('<a/>', {
            class: "cart-item-link",
            'data-id': item.id_product,
            href: "#"
        });
        $deleteBtnWrapper.append(`<i class="fas fa-times-circle"></i>`);
        $itemOtherColumns.append($deleteBtnWrapper);
        $cartItem.append($itemOtherColumns);
        $cartWrapper.append($cartItem);
        $deleteBtnWrapper.on('click', (e) => {
            e.preventDefault();
            this._remove(item.id_product)
        });
        this._renderSum();
        $(`div[data-id="${item.id_product}"]`).on('input', '.sh-input-box', () => {
            this._setItemQuantity(item.id_product);
            localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
        })

    }

    _setItemQuantity(productId) {
        let find = this.cartItems.find(product => product.id_product === productId);
        let value = +$(this.containerPageCart).find(`.sh-input-box[data-id="${productId}"]`).val();
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
                $(this.containerPageCart).find(`div[data-id="${productId}"]`).remove();
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
                price: +$(item).data('price'),
                product_name: $(item).data('name'),
                imgSrc: $(item).data('imgSrc'),
                alt: $(item).data('alt'),
                quantity: 1
            };
            this.cartItems.push(product);
            this._renderItem(product);
        }
        localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
        this._renderSum();
    }

    _updateCart(item) {
        let $container = $(`div[data-id="${item.id_product}"]`);
        $container.find('.shopping-cart-quick-text-price').text(`${item.quantity} x $${item.price.toFixed(2)}`);
        $container.find('.sh-input-box').val(`${item.quantity}`);
        let totalPrice = item.quantity * item.price;
        $container.find('.itemTotal').text(`$${totalPrice.toFixed(2)}`);
    }
}