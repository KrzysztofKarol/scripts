(() => {
  /* Add as bookmarklet */
  document.onkeyup = e => {
    if (e.ctrlKey) {
      /* English */
      if (e.key === "e") {
        const innerHTML = `
<p>Hi {{firstName}}!</p>
<p><br /></p>
<p>Thank you for your message.</p>
<p>Could you tell me more about <span id="select-me">the requirements</span>?</p>
<p><br/></p>
<p>Best regards,</p>
<p>Krzysztof Karol</p>
`;
        insertMessage(innerHTML);
      }

      /* German */
      if (e.key === "d") {
        const innerHTML = `
<p>Grüezi {{firstName}}!</p>
<p><br /></p>
<p>Vielen Dank für Ihre Nachricht</p>
<p>Könnten Sie mir bitte etwas mehr über <span id="select-me">Voraussetzungen</span> schreiben?</p>
<p><br/></p>
<p>Mit freundlichen Grüssen</p>
<p>Krzysztof Karol</p>
`;
        insertMessage(innerHTML);
      }
    }
  };

  function insertMessage(innerHTML) {
    /* In "Replay to" state */
    const firstName = _getFirstName();

    const innerHTMLWithFirstName = innerHTML.replace(
      "{{firstName}}",
      firstName
    );

    _setInnerHTML(innerHTMLWithFirstName);
    _selectById("select-me");
  }

  function _getFirstName() {
    const classNames = [
      "profile-card-one-to-one__profile-link" /* From invitation */,
      "msg-entity-lockup__entity-title" /* From messages */
    ];

    for (const className of classNames) {
      const element = document.getElementsByClassName(className)[0];

      if (element !== undefined) {
        return element.innerHTML.trim().split(" ")[0];
      }
    }

    return null;
  }

  function _setInnerHTML(innerHTML) {
    const element = document.getElementsByClassName(
      "msg-form__contenteditable"
    )[0];
    element.innerHTML = innerHTML;
    element.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function _selectById(id) {
    /* https://stackoverflow.com/a/985368 */
    const r = document.createRange();
    const w = document.getElementById(id);
    r.selectNodeContents(w);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(r);
  }
})();
