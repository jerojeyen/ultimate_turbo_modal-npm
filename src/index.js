import UltimateTurboModalController from './modal_controller';

function setupUltimateTurboModal(application) {
  // Register the Stimulus controller
  application.register("modal", UltimateTurboModalController);

  // Set up Turbo.StreamActions.modal function
  Turbo.StreamActions.modal = function () {
    const message = this.getAttribute("message");
    if (message == "hide") window.modal?.hide();
    if (message == "close") window.modal?.hide();
  };
}

export default setupUltimateTurboModal;
