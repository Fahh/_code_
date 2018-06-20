var form = document.querySelector('#formulaire_contact');

function sendMail() {

  console.log("SEND MAIL");
  var service_id = "gmail";
  var template_id = "formulaire";
  // Recuperer valeurss
  var name = form.querySelector('#name').value;
  var message = form.querySelector('#message').value;
  var to = form.querySelector('#email').value;

  var topImage = document.querySelector('img#orderTop').src;
  var bottomImage = document.querySelector('img#orderBottom').src;
  var template_params = {
    'to': to,
    'name': name,
    'message': message,
    'topImage': topImage,
    'bottomImage': bottomImage
  }
  console.log("SENT WITH PARAMS");
  console.log(template_params);

  emailjs.send(service_id, template_id, template_params).then(function() {
    alert("Sent!");

    var sentButton = document.querySelector("#sentButton");
    sentButton.addEventListener('click', displayMessageSent);


  }, function(err) {
    alert("Send email failed!\r\n Response:\n " + JSON.stringify(err));
  });
}
var submitBtn = document.querySelector("#submitButton");
submitBtn.addEventListener('click', sendMail);
