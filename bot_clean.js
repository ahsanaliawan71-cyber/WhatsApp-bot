const { makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const QRCode = require('qrcode');
const http = require('http');

let qrImageData = '';
let botStatus = 'waiting';

const server = http.createServer(async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  if (botStatus === 'connected') {
    res.end('<html><body style="background:#000;color:#25D366;font-family:sans-serif;text-align:center;padding:50px"><h1>Bot Live Hai!</h1><p style="color:#fff">WhatsApp Bot chal raha hai 24/7</p></body></html>');
  } else if (qrImageData) {
    res.end(`<html><body style="background:#000;color:#fff;font-family:sans-serif;text-align:center;padding:30px"><h2 style="color:#25D366">WhatsApp QR Scan Karo</h2><p>WhatsApp > Linked Devices > Link a Device</p><img src="${qrImageData}" style="width:300px;height:300px;border:3px solid #25D366;border-radius:10px"/><p style="color:#888;font-size:12px">QR expire ho jaye to page refresh karo</p></body></html>`);
  } else {
    res.end('<html><body style="background:#000;color:#fff;font-family:sans-serif;text-align:center;padding:50px"><h2 style="color:#25D366">Bot Start Ho Raha Hai...</h2><p>30 seconds mein refresh karo</p><script>setTimeout(()=>location.reload(),5000)</script></body></html>');
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Server on port ' + PORT));

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info');
  const sock = makeWASocket({ auth: state, printQRInTerminal: true, browser: ['Bot', 'Chrome', '1.0'] });
  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('connection.update', async ({ connection, qr, lastDisconnect }) => {
    if (qr) { qrImageData = await QRCode.toDataURL(qr); botStatus = 'waiting'; console.log('QR ready!'); }
    if (connection === 'open') { botStatus = 'connected'; qrImageData = ''; console.log('BOT LIVE!'); }
    if (connection === 'close') { const code = lastDisconnect?.error?.output?.statusCode; if (code !== DisconnectReason.loggedOut) startBot(); }
  });
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;
    const from = msg.key.remoteJid;
    if (from.endsWith('@g.us')) return;
    const text = (msg.message.conversation || msg.message.extendedTextMessage?.text || '').toLowerCase().trim();
    let r = '';
    if (text.match(/hi|hello|salam|start|menu/)) r = 'Assalam o Alaikum! Main Ahsan Ali hun\nBot Builder & Developer\n\n1-Bot\n2-Invoice\n3-Website\n4-Price\n5-Contact';
    else if (text === '1' || text.includes('bot')) r = 'WhatsApp Bot Rs.2500/month\n7 din FREE!\nOrder: order likhein';
    else if (text === '2' || text.includes('invoice')) r = 'Invoice App $19 only!\nBuy: buy likhein';
    else if (text === '3' || text.includes('website')) r = 'Website\nLanding:Rs.3500\nBusiness:Rs.8000\nEcommerce:Rs.15000';
    else if (text === '4' || text.includes('price')) r = 'Bot:Rs.2500/m | App:$19 | Web:Rs.3500+';
    else if (text === '5' || text.includes('contact')) r = 'WhatsApp:03188185031\nEmail:aaawan.digital@gmail.com';
    else if (text.includes('order') || text.includes('buy')) r = 'Shukriya! Naam aur service batayein!';
    else r = '1-Bot 2-Invoice 3-Website 4-Price 5-Contact';
    await sock.sendMessage(from, { text: r });
    console.log('Reply sent!');
  });
}
startBot().catch(console.error);
