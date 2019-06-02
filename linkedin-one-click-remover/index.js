(async () => {

    class Page {

        static showAllConnections() {
            const intervalHandler = setInterval(
                () => this.#scrollToBottom(),
                1000,
            );

            return new Promise((resolve) => {
                setTimeout(() => {
                    clearInterval(intervalHandler);
                    resolve();
                }, 30 * 1000);
            });
        }

        static prepareConnections() {
            this.#getConnectionRows()
                .forEach(row => {
                    const connection = new Connection(row);

                    connection.prepare();
                });
        }

        static #getConnectionRows = () => document
            .querySelectorAll(".mn-connections .mn-connection-card");

        static #scrollToBottom = () => {
            window.scrollTo(0, document.body.scrollHeight);
        }
    }

    class Connection {

        #row;

        constructor(element) {
            this.#row = element;
        }

        prepare() {
            this.#toggleEllipsis();
            this.#cloneDeleteButton();
            this.#toggleEllipsis();
        }

        #clickConfirmDeleteButton = () => {
            document
                .querySelector(`button[data-control-name="confirm_removed"]`).click();
        }

        #clickDeleteButton = () => {
            this.#toggleEllipsis();
            this.#getDeleteButton().click();
            this.#clickConfirmDeleteButton();
        }

        #cloneDeleteButton = () => {
            const cloned = this.#getDeleteButton().cloneNode(true);

            cloned.addEventListener("click", () => {
                this.#clickDeleteButton();
            });

            this.#row.prepend(cloned);
        }

        #getDeleteButton = () => this.#row
            .querySelector(".js-mn-connection-card__dropdown-delete-btn button");

        #toggleEllipsis = () => {
            this.#row.querySelector(`*[data-control-name="ellipsis"]`).click();
        }
    }

    await Page.showAllConnections();
    Page.prepareConnections();
})();
