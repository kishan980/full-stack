export const moveArrayElement = (array = [], from = 0, to = 0) => {
    const copy = array.slice()
    copy.splice(to, 0, copy.splice(from, 1)[0])
    return copy
}

export const formCreatedDate = (created) => {
    const date = new Date(created)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`
}

export const manageTooltipPopout = (windowWidth, infoEl, tooltipPopoutEl) => {
  let dialogOverlay = document.getElementsByClassName('create-art-help').item(0);
  if (dialogOverlay && infoEl.current && tooltipPopoutEl.current) {
    let dialog = dialogOverlay.getElementsByClassName('react-confirm-alert').item(0);
    let infoRect = infoEl.current.getBoundingClientRect();
    let dialogRect = dialog.getBoundingClientRect();

    if (windowWidth > 768) {
      document.body.classList.remove('react-confirm-alert-body-element');
      if (tooltipPopoutEl.current) {
        tooltipPopoutEl.current.classList.add('tooltip-popout-visible');
      }
      dialog.style.top = infoRect.y + 73 + 'px';
      dialog.style.left = (infoRect.x - (dialogRect.width * 0.60)) + 'px';
      console.log(dialog.style.top);
    } else {
      dialog.style.top = null;
      dialog.style.left = null;
    }
  }
}
