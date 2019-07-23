(() => {
  /* Add as bookmarklet */
  document.onkeyup = e => {
    if (e.ctrlKey) {
      /* English */
      if (e.key === "e") {
        const innerHTML = `<p>
Hi {{firstName}}!<br />
<br />
Thank you for your message.<br />
Could you tell me more about <span id="select-me">requirements</span>?<br/>
<br/>
Best regards,<br/>
Krzysztof Karol
</p>
`;
        insertMessage(innerHTML);
      }

      /* German */
      if (e.key === "d") {
        const innerHTML = `<p>
Grüezi {{firstName}}!<br />
<br />
Vielen Dank für Ihre Nachricht<br />
Könnten Sie mir bitte etwas mehr über <span id="select-me">Voraussetzungen</span> schreiben?<br/>
<br/>
Mit freundlichen Grüssen<br/>
Krzysztof Karol
</p>
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
    return document
      .getElementsByClassName("profile-card-one-to-one__profile-link")[0]
      .innerHTML.trim()
      .split(" ")[0];
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
