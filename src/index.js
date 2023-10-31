import UltimateTurboModalController from './modal_controller';
import './styles/vanilla.css';

function setupUltimateTurboModal(application) {
  // Register the Stimulus controller
  application.register("modal", UltimateTurboModalController);

  // Set up Turbo.StreamActions.modal function
  Turbo.StreamActions.modal = function () {
    const message = this.getAttribute("message");
    if (message == "hide") window.modal?.hide();
    if (message == "close") window.modal?.hide();
  };

  // Escape modal from the backend on redirects
  document.addEventListener("turbo:frame-missing", function (event) {
    if (event.detail.response.redirected &&
      event.target == document.querySelector("turbo-frame#modal")) {
      event.preventDefault()
      event.detail.visit(event.detail.response)
    }
  })
}

export default setupUltimateTurboModal;
