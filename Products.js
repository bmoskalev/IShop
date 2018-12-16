class Products {
    constructor(container, source, startItem, countItems) {
        this.container = container;
        this.source = source;
        this.startItem = startItem;
        this.countItem = countItems;
        this._init(this.source);
    }

    _init(source) {
        fetch(source)
            .then(result => result.json())
            .then(data => {
                for (let i = 0; i < this.countItem; i++) {
                    this._render(data[this.startItem + i]);
                }
            })

    }

    _render(item) {
        let $itemWrapper = $('<div/>', {
            class: 'item'
        });
        let $linkWrapper = $('<a/>', {
            class: "product",
            href: "singlepage.html"
        });
        let $img = $('<img/>', {
            class: "product-img",
            src: item.imgSrc,
            alt: item.alt
        });
        $linkWrapper.append($img);
        let $text = $('<div/>', {
            class: 'product-text-box'
        });
        $text.append($(`<p class="product-text">${item.product_name}</p>`));
        $text.append($(`<p class="product-price">&#36;${item.price.toFixed(2)}</p>`));
        $linkWrapper.append($text);
        let $cartWrapper = $('<div/>', {
            class: 'box-add'
        });
        let $cartLink = $('<a/>', {
            href: '#',
            class: "add",
            'data-id': item.id_product,
            'data-name': item.product_name,
            'data-price': item.price,
            'data-imgSrc': item.imgSrc,
            'data-alt': item.alt
        });
        $cartLink.append($('<img class="cart-img" src="img/addcart.svg" alt="cart-img">'));
        $cartLink.append("Add to Cart");
        $cartWrapper.append($cartLink);
        $itemWrapper.append($linkWrapper);
        $itemWrapper.append($cartWrapper);
        $(this.container).append($itemWrapper);

    }

}
