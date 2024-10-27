import { Controller } from "@hotwired/stimulus"
import { Turbo } from "@hotwired/turbo-rails"
import { enter, leave } from "el-transition"

export default class extends Controller {
  static targets = ["container", "content"]
  static values = {
    advanceUrl: String,
    allowedClickOutsideSelector: String,
    disableCloseOnFormSubmit: Boolean
  }

  connect() {
    let _this = this
    this.showUTModal()

    this.turboFrame = this.element.closest('turbo-frame');

    // hide modal when back button is pressed
    window.addEventListener('popstate', function (event) {
      if (_this.#hasHistoryAdvanced()) _this.#resetUTModalElement()
    })

    window.utmodal = this
  }

  disconnect() {
    window.utmodal = undefined
  }

  showUTModal() {
    enter(this.containerTarget)
    this.#lockBodyScroll()

    if (this.advanceUrlValue && !this.#hasHistoryAdvanced()) {
      this.#setHistoryAdvanced()
      history.pushState({}, "", this.advanceUrlValue)
    }
  }

  // if we advanced history, go back, which will trigger
  // hiding the model. Otherwise, hide the modal directly.
  hideUTModal() {
    // Prevent multiple calls to hideUTModal.
    // Sometimes some events are double-triggered.
    if (this.hidingUTModal) return
    this.hidingUTModal = true

    let event = new Event('utmodal:closing', { cancelable: true })
    this.turboFrame.dispatchEvent(event)
    if (event.defaultPrevented) return

    this.#resetUTModalElement()
    this.#unlockBodyScroll()

    event = new Event('utmodal:closed', { cancelable: false })
    this.turboFrame.dispatchEvent(event)

    if (this.#hasHistoryAdvanced())
      history.back()
  }

  hide() {
    this.hideUTModal()
  }

  refreshPage() {
    window.Turbo.visit(window.location.href, { action: "replace" })
  }

  // hide modal on successful form submission
  // action: "turbo:submit-end->utmodal#submitEnd"
  submitEnd(e) {
    if (e.detail.success && (!this.hasDisableCloseOnFormSubmitValue || !this.disableCloseOnFormSubmitValue)) this.hideUTModal()
  }

  // hide modal when clicking ESC
  // action: "keyup@window->utmodal#closeWithKeyboard"
  closeWithKeyboard(e) {
    if (e.code == "Escape") this.hideUTModal()
  }

  // hide modal when clicking outside of modal
  // action: "click@window->utmodal#outsideUTModalClicked"
  outsideUTModalClicked(e) {
    let clickedInsideUTModal = this.contentTarget.contains(e.target) || this.contentTarget == e.target
    let clickedAllowedSelector = this.hasAllowedClickOutsideSelectorValue && e.target.closest(this.allowedClickOutsideSelectorValue) != null

    if (!clickedInsideUTModal && !clickedAllowedSelector)
      this.hideUTModal()
  }

  #resetUTModalElement() {
    leave(this.containerTarget).then(() => {
      this.turboFrame.removeAttribute("src")
      this.containerTarget.remove()
      this.#resetHistoryAdvanced()
    })
  }

  #hasHistoryAdvanced() {
    return document.body.getAttribute("data-turbo-utmodal-history-advanced") == "true"
  }

  #setHistoryAdvanced() {
    return document.body.setAttribute("data-turbo-utmodal-history-advanced", "true")
  }

  #resetHistoryAdvanced() {
    document.body.removeAttribute("data-turbo-utmodal-history-advanced")
  }

  #lockBodyScroll() {
    document.body.style.overflow = "hidden"
  }

  #unlockBodyScroll() {
    document.body.style.overflow = "auto"
  }
}

Turbo.StreamActions.utmodal = function () {
  const message = this.getAttribute("message")

  if (message == "hide") window.utmodal?.hide()
  if (message == "close") window.utmodal?.hide()
}
