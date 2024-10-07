import UltimateTurboModalController from './utmodal_controller';
import './styles/vanilla.css';

function setupUltimateTurboModal(application) {
  // Register the Stimulus controller
  application.register("utmodal", UltimateTurboModalController);

  // Set up Turbo.StreamActions.modal function
  Turbo.StreamActions.utmodal = function () {
    const message = this.getAttribute("message");
    if (message == "hide") window.utmodal?.hide();
    if (message == "close") window.utmodal?.hide();
  };

  // Escape modal from the backend on redirects
  document.addEventListener("turbo:frame-missing", function (event) {
    if (event.detail.response.redirected &&
      event.target == document.querySelector("turbo-frame#utmodal")) {
      event.preventDefault()
      event.detail.visit(event.detail.response)
    }
  })
}

export default setupUltimateTurboModal;
