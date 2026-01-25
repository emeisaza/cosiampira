const https = require('https');

const urls = [
    'https://cosiampira.com/manifiesto-del-futurismo-rural/',
    'https://cosiampira.com/12-notas-para-el-ambient-futuro/',
    'https://cosiampira.com/eliane-radigue-budismo-voltaje-y-una-escucha-infinita/',
    'https://cosiampira.com/seduciendo-a-baudrillard/',
    'https://cosiampira.com/no-es-nada/',
    'https://cosiampira.com/devenir-y-deriva/',
    'https://cosiampira.com/sobre-los-senderos-del-jardin/',
    'https://cosiampira.com/el-tiempo-no-tiene-importancia/',
    'https://cosiampira.com/sintesis-de-genero/'
];

const getPage = (url) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve({ url, html: data }));
            res.on('error', reject);
        });
    });
};

const extract = async () => {
    const results = [];
    for (const url of urls) {
        try {
            const { html } = await getPage(url);

            // Extract using Regex
            const imageMatch = html.match(/meta property="og:image" content="([^"]+)"/) || html.match(/meta name="twitter:image" content="([^"]+)"/);
            const titleMatch = html.match(/meta property="og:title" content="([^"]+)"/) || html.match(/<title>([^<]+)<\/title>/);
            const authorMatch = html.match(/meta name="author" content="([^"]+)"/) || html.match(/rel="author">([^<]+)<\/a>/) || html.match(/class="author-name">([^<]+)<\/a>/);
            // Date often in: <time class="entry-date published" datetime="2020-01-01...">
            const dateMatch = html.match(/class="entry-date published" datetime="([^"]+)"/) || html.match(/meta property="article:published_time" content="([^"]+)"/);

            results.push({
                url,
                image: imageMatch ? imageMatch[1] : '',
                title: titleMatch ? titleMatch[1] : '',
                author: authorMatch ? authorMatch[1] : 'Cosiámpira',
                date: dateMatch ? dateMatch[1].split('T')[0] : '2025-01-01'
            });
        } catch (e) {
            console.error(`Error fetching ${url}:`, e);
            results.push({ url, error: true });
        }
    }
    console.log(JSON.stringify(results, null, 2));
};

extract();
