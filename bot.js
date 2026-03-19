const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { args: ['--no-sandbox'] }
});

client.on('qr', (qr) => {
  console.log('\n📱 QR SCAN KARO WHATSAPP SE:\n');
  qrcode.generate(qr, { small: false });
});

client.on('ready', () => {
  console.log('\n✅ BOT LIVE HAI!\n');
});

client.on('message', async (msg) => {
  const text = msg.body.toLowerCase().trim();
  console.log('Message aaya:', text);
  let reply = '';

  if (text.match(/hi|hello|salam|start|menu/)) {
    reply = 'Assalam o Alaikum! 👋\nMain Ahsan Ali hun\nWeb Developer & Bot Builder\n\n1 - WhatsApp Bot\n2 - Invoice App\n3 - Website\n4 - Pricing\n5 - Contact';
  } else if (text === '1' || text.includes('bot')) {
    reply = 'WhatsApp Bot\nRs. 2,500/month\n7 din FREE Trial!\nOrder ke liye: order likhein';
  } else if (text === '2' || text.includes('invoice')) {
    reply = 'Invoice App\n$19 one-time\nBuy ke liye: buy likhein';
  } else if (text === '3' || text.includes('website')) {
    reply = 'Website\nLanding Page: Rs.3,500\nBusiness Site: Rs.8,000\nEcommerce: Rs.15,000';
  } else if (text === '4' || text.includes('price')) {
    reply = 'Pricing\nBot: Rs.2,500/month\nApp: $19\nWebsite: Rs.3,500+';
  } else if (text === '5' || text.includes('contact')) {
    reply = 'Contact\nWhatsApp: 03188185031\nEmail: aaawan.digital@gmail.com\nTime: 9AM-10PM';
  } else if (text.includes('order') || text.includes('buy')) {
    reply = 'Shukriya! 🎉\nNaam aur service batayein\n24 ghante mein ready karunga!';
  } else {
    reply = 'Shukriya! 😊\n1-Bot\n2-Invoice\n3-Website\n4-Price\n5-Contact';
  }

  msg.reply(reply);
  console.log('Reply bhej diya!');
});

client.initialize();
