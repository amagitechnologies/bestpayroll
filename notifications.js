// Create a web component for popup alerts
customElements.define(
  "popup-alert",
  class extends HTMLElement {
    constructor() {
      super();

      const shadowRoot = this.attachShadow({ mode: "open" });

      const wrapper = document.createElement("div");
      wrapper.setAttribute("class", "popup__container");
      const icon = wrapper.appendChild(document.createElement("i"));
      icon.classList.add("popup__icon", "fas");
      const text = wrapper.appendChild(document.createElement("div"));
      text.setAttribute("class", "popup__text");
      text.textContent = "String.";

      const style = document.createElement("style");
      style.textContent = `
        .popup__container {
          padding: 10px 25px;
          border-radius: 25px;
          position: fixed;
          margin: 20px auto;
          width: 100%;
          max-width: 400px;
          text-align: center;
          left: 0;
          right: 0;
          background-color: #16abf2;
          color: white;
          top: -100px;
          opacity: 0;
          pointer: cursor;
          transition: all 0.5s ease-in; 
        }

        .popup__text {
          font-size: 1rem;
          font-family: "Montserrat", sans-serif;
        }

        .popup__container.visible {
          top: 0;
          opacity: 1; 
        }

        .popup__container.error {
          background-color: #D54A4A;
        }

        .popup__container.info {
          background-color: #16abf2;
        }

        .popup__container.success {
          background-color: #88C431;
        }

        .popup__container.warning {
          background-color: #F2802C;
        }

        .popup__icon {
          color: white;
          font-size: 12px;
        }

        @media only screen and (max-width: 500px) {
          .popup__container {
            max-width: 300px;
          }
        }
      `;

      this.shadowRoot.append(style, wrapper);
    }
  }
);

window.addEventListener("load", () => {
  // Add the popup element to the document
  const popup = document.createElement("popup-alert");
  document.body.appendChild(popup);

  // Initialize variables
  let timer;

  const popupRoot = document.querySelector("popup-alert").shadowRoot;
  const container = popupRoot.querySelector(".popup__container");
  const iconEl = popupRoot.querySelector(".popup__icon");
  const text = popupRoot.querySelector(".popup__text");

  // Close the popup on click
  container.addEventListener("click", (event) => {
    window.clearTimeout(timer);
    container.classList.remove("visible");
  });

  // Listen for any "popup" events
  document.addEventListener("popup", (event) => {
    // Get data from detail prop
    const { info, type, icon, delay } = event.detail;

    if (!popupRoot) return;

    // Reset previous classes and set to the given "type"
    container.setAttribute("class", "popup__container");
    container.classList.add(type || "default");

    // Reset icon class
    iconEl.setAttribute("class", "popup__icon fas");

    // Set fontawesome icon based on type of popup
    let iconClass;

    switch (type) {
      case "info":
        iconEl.classList.add("fa-info");
        break;
      case "warning":
        iconEl.classList.add("fa-exclamation");
        break;
      case "error":
        iconEl.classList.add("fa-exclamation");
        break;
      case "success":
        iconEl.classList.add("fa-check");
        break;
      default:
        iconEl.classList.add("fa-info");
    }

    // Set text of popup
    text.textContent = info;

    // Make popup visible
    container.classList.add("visible");

    // Hide the popup after delay or 5s
    function hidePopupTimer() {
      window.clearTimeout(timer);

      timer = window.setTimeout(
        () => container.classList.remove("visible"),
        delay || 5000
      );
    }

    hidePopupTimer();
  });
});
