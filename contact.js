(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;

  // Replace this with your real Formspree endpoint, e.g. 'https://formspree.io/f/xxxxxxx'
  var FORMSPREE_ENDPOINT = 'https://formspree.io/f/xvzebgww';
  var COOLDOWN_SECONDS = 30;

  var roleSelect = document.getElementById('contact-role');
  var roleOtherField = document.getElementById('contact-role-other-field');
  var roleOtherInput = document.getElementById('contact-role-other');
  var submitBtn = form.querySelector('.contact-submit-btn');
  var successMsg = document.getElementById('contact-success');
  var errorMsg = document.getElementById('contact-error');

  var submitBtnDefaultText = submitBtn.textContent;
  var cooldownTimer = null;
  var isCoolingDown = false;

  roleSelect.addEventListener('change', function () {
    var isOther = roleSelect.value === 'Other';
    roleOtherField.style.display = isOther ? '' : 'none';
    roleOtherInput.required = isOther;
    if (!isOther) roleOtherInput.value = '';
  });

  function startCooldown() {
    var remaining = COOLDOWN_SECONDS;
    isCoolingDown = true;
    submitBtn.classList.add('is-cooldown');
    submitBtn.textContent = 'Wait ' + remaining + 's';

    cooldownTimer = setInterval(function () {
      remaining -= 1;
      if (remaining <= 0) {
        clearInterval(cooldownTimer);
        isCoolingDown = false;
        submitBtn.classList.remove('is-cooldown');
        submitBtn.textContent = submitBtnDefaultText;
      } else {
        submitBtn.textContent = 'Wait ' + remaining + 's';
      }
    }, 1000);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    successMsg.hidden = true;

    if (isCoolingDown) {
      errorMsg.textContent = 'Not so fast!';
      errorMsg.hidden = false;
      return;
    }

    errorMsg.hidden = true;
    errorMsg.textContent = 'Something went wrong — please try again or email me directly.';

    var firstName = document.getElementById('contact-first-name').value.trim();
    var lastName = document.getElementById('contact-last-name').value.trim();
    var email = document.getElementById('contact-email').value.trim();
    var role = roleSelect.value === 'Other'
      ? roleOtherInput.value.trim().slice(0, 50)
      : roleSelect.value;
    var message = document.getElementById('contact-message').value.trim();

    var subject = firstName + ' ' + lastName + ' - ' + role + ' - Portfolio Website';

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    var payload = new FormData();
    payload.append('first_name', firstName);
    payload.append('last_name', lastName);
    payload.append('email', email);
    payload.append('role', role);
    payload.append('message', message);
    payload.append('_subject', subject);

    fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: payload
    })
      .then(function (response) {
        if (response.ok) {
          form.reset();
          roleOtherField.style.display = 'none';
          successMsg.hidden = false;
        } else {
          errorMsg.hidden = false;
        }
      })
      .catch(function () {
        errorMsg.hidden = false;
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = submitBtnDefaultText;
        startCooldown();
      });
  });
}());
