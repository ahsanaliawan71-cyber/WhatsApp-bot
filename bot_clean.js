const{makeWASocket,useMultiFileAuthState,DisconnectReason}=require('@whiskeysockets/baileys');
const qrcode=require('qrcode-terminal');
async function start(){
const{state,saveCreds}=await useMultiFileAuthState('auth');
const sock=makeWASocket({auth:state,printQRInTerminal:true,browser:['Bot','Chrome','1.0']});
sock.ev.on('creds.update',saveCreds);
sock.ev.on('connection.update',({connection,qr})=>{
if(qr){console.log('\n📱 QR SCAN KARO:\n');qrcode.generate(qr,{small:false});}
if(connection==='open')console.log('\n✅ BOT LIVE!\n');
if(connection==='close')start();
});
sock.ev.on('messages.upsert',async({messages})=>{
const msg=messages[0];
if(!msg.message||msg.key.fromMe)return;
const from=msg.key.remoteJid;
if(from.endsWith('@g.us'))return;
const text=(msg.message.conversation||msg.message.extendedTextMessage?.text||'').toLowerCase().trim();
let r='';
if(text.match(/hi|hello|salam|start/))r='Assalam o Alaikum! 👋\nMain Ahsan Ali hun\nBot Builder & Developer\n\n1-Bot\n2-Invoice\n3-Website\n4-Price\n5-Contact';
else if(text==='1'||text.includes('bot'))r='WhatsApp Bot\nRs.2500/month\n7 din FREE!\nOrder: order likhein';
else if(text==='2'||text.includes('invoice'))r='Invoice App\n$19 only!\nBuy: buy likhein';
else if(text==='3'||text.includes('website'))r='Website\nLanding:Rs.3500\nBusiness:Rs.8000';
else if(text==='4'||text.includes('price'))r='Bot:Rs.2500/m\nApp:$19\nWeb:Rs.3500+';
else if(text==='5'||text.includes('contact'))r='WhatsApp:03188185031\nEmail:aaawan.digital@gmail.com';
else if(text.includes('order')||text.includes('buy'))r='Shukriya! Naam aur service batayein!';
else r='1-Bot 2-Invoice 3-Website 4-Price 5-Contact';
await sock.sendMessage(from,{text:r});
});
}
start();
```

### Step 5: File Name Change Karo
Upar file name box mein:
```
bot_clean.js → bot.js
