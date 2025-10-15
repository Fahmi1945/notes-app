// If another module already defined the 'app-bar' custom element, skip defining it again.
if (!customElements.get('app-bar')) {
  class AppBarComponent extends HTMLElement {
    connectedCallback() {
      this.render();
    }

    render() {
      this.innerHTML = `
        <div class="app-bar">
          <div class="app-bar-left">
            <h1>Notes APP</h1>
          </div>
          <div class="app-bar-right">
            <h2>create a new note</h2>
            <button id="addNoteButton" class="add-button" title="Buat catatan baru">+</button>
          </div>
        </div>
      `;
    }
  }
  customElements.define('app-bar', AppBarComponent);
}
