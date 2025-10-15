// File: scripts/components/LoadingIndicator.js

class LoadingIndicator extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  // Public API to show the loading indicator
  show() {
    this.removeAttribute('hidden');
  }

  // Public API to hide the loading indicator
  hide() {
    this.setAttribute('hidden', '');
  }

  render() {
    this.innerHTML = `
      <style>
        .loading-overlay {
          /* Overlay di atas segalanya */
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          transition: opacity 0.3s ease;
        }

        .loading-spinner {
          /* Gaya Spinner */
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top: 4px solid var(--color-text-primary, #F9FAFB);
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Aturan untuk menyembunyikan/menampilkan */
        :host([hidden]) .loading-overlay {
          display: none;
        }
      </style>
      <div class="loading-overlay">
        <div class="loading-spinner"></div>
      </div>
    `;
  }
}

customElements.define('loading-indicator', LoadingIndicator);