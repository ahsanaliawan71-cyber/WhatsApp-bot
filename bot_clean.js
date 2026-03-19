const { makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info');
  const sock = makeWASocket({ auth: state, printQRInTerminal: true });
  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('connection.update', ({ connection, qr }) => {
    if (qr) { console.log('\n📱 QR SCAN KARO:\n'); qrcode.generate(qr, { small: false }); }
    if (connection === 'open') console.log('\n✅ BOT LIVE!\n');
    if (connection === 'close') startBot();
  });
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;
    const from = msg.key.remoteJid;
    if (from.endsWith('@g.us')) return;
    const text = (msg.message.conversation || msg.message.extendedTextMessage?.text || '').toLowerCase().trim();
    let reply = '';
    if (text.match(/hi|hello|salam|start/)) reply = 'Assalam o Alaikum! Main Ahsan Ali hun\n1-Bot\n2-Invoice\n3-Website\n4-Price\n5-Contact';
    else if (text === '1' || text.includes('bot')) reply = 'WhatsApp Bot Rs.2500/month - 7 din FREE trial! Order ke liye: order likhein';
    else if (text === '2' || text.includes('invoice')) reply = 'Invoice App $19 only! Buy ke liye: buy likhein';
    else if (text === '3' || text.includes('website')) reply = 'Website: Landing Rs.3500 | Business Rs.8000 | Ecommerce Rs.15000';
    else if (text === '4' || text.includes('price')) reply = 'Bot:Rs.2500/m | App:$19 | Website:Rs.3500+';
    else if (text === '5' || text.includes('contact')) reply = 'WhatsApp:03188185031 | Email:aaawan.digital@gmail.com';
    else if (text.includes('order') || text.includes('buy')) reply = 'Shukriya! Naam aur service batayein - 24 ghante mein ready!';
    else reply = '1-Bot 2-Invoice 3-Website 4-Price 5-Contact';
    await sock.sendMessage(from, { text: reply });
    console.log('Reply sent!');
  });
}
startBot();
