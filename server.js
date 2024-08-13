const express = require('express');
const path = require('path');
const fs = require('fs');
const youtubedl = require('youtube-dl-exec'); // Ensure this library is installed
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/download', async (req, res) => {
    const url = req.body.url;
    if (!url) {
        return res.status(400).send('No URL provided');
    }

    try {
        const output = path.join(__dirname, 'downloads', 'video.mp4'); // Define download path
        await youtubedl(url, {
            output: output,
            format: 'best'
        });

        res.download(output, (err) => {
            if (err) {
                console.error('Error downloading the file:', err);
                res.status(500).send('Failed to download video');
            } else {
                fs.unlinkSync(output); // Clean up after download
            }
        });
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).send('Failed to download video');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
