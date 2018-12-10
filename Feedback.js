class Feedback {
    constructor(source, container) {
        this.source = source;
        this.container = container;
        this.countFeedbacks = 0; // Общее кол-во товаров в корзине
        this.lastIndex = 0; // Общее стоимость товаров в корзине
        this.feedbackItems = []; // Массив со всеми товарами
        this._init(this.source);
    }

    _init(source) {
        $(this.container).append('<h3>Feedbacks</h3>');
         fetch(source)
            .then(result => result.json())
            .then(data => {
                this.countFeedbacks = data.countFeedbacks;
                this.lastIndex = data.lastIndex;
                for (let feedback of data.feedbacks) {
                    this.feedbackItems.push(feedback);
                    this._renderItem(feedback);
                }
            });
// Add feedback on page
        let $addBtn = $('.submitBtn');
        $addBtn.click((e) => {
            e.preventDefault();
            this._addFeedback();
        })
    }

    _renderItem(feedback) {
        let $container = $('<div/>', {
            class: 'feedback-item',
            'data-feedback': feedback.id,
        });
        $container.append($(`<p class="feedback-author">${feedback.author}</p>`));
        $container.append($(`<p class="feedback-text">${feedback.text}</p>`));
        if (feedback.isApproved) {
            $container.addClass("approved");
        } else {
            let $apprBtn = $('<button/>', {
                class: 'button-site my-acc apprBtn',
                text: 'Approve feedback'
            }).click(() => {
                this._approve(feedback.id);
            });
            $container.append($apprBtn);

        }
        let $remBtn = $('<button/>', {
            class: 'button-site my-acc remBtn',
            text: 'Remove feedback'
        }).click(() => {
            this._remove(feedback.id);
        });
        $container.append($remBtn);
        $container.appendTo($(this.container));
    }

    _addFeedback() {
        if (!$('.feedbackAuthor').val() || !$('.feedbackText').val()) {
            return;
        }
        let feedback = {
            id: ++this.lastIndex,
            author: $('.feedbackAuthor').val(),
            text: $('.feedbackText').val(),
            isApproved: false
        };
        this.feedbackItems.push(feedback);
        this.countFeedbacks++;
        this._renderItem(feedback);
    }

    _remove(feedbackId) {
        let find = this.feedbackItems.find(feedback => feedback.id === feedbackId);

        $(`div[data-feedback="${feedbackId}"]`).remove();
        this.feedbackItems.splice(this.feedbackItems.indexOf(find), 1);
        this.countFeedbacks--;
    }

    _approve(feedbackId) {
        let find = this.feedbackItems.find(feedback => feedback.id === feedbackId);
        find.isApproved = true;
        $(`div[data-feedback="${feedbackId}"]`).addClass("approved");
        $('.apprBtn').remove();
    }
}