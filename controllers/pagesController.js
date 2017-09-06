const mail = require('../handlers/mail');

/**
 * FAQ
 */
exports.faq = (req, res) => {
  res.render('pages/faq', { title: 'Frequently Asked Questions' });
}

exports.getContact = (req, res) => {
  res.render('pages/contact', { title: 'Contact Us' });
}

exports.postContact = async (req, res) => {
  const name = req.body.name;
  const userEmail = req.body.email;
  const message = req.body.message;

  await mail.sendContact({
    userEmail,
    message,
    name,
    filename: 'contact',
    subject: 'Contact'
  });

  req.flash('success', `Your message has been sent to devs!`);
  res.redirect('back');
}
