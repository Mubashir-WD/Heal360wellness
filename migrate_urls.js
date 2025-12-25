
const fs = require('fs').promises;
const path = require('path');

const cwd = 'c:/Users/Thinkpad/Downloads/Heal_360';
const filesToMigrate = [
    'about.html',
    'program.html',
    'team.html',
    'blog.html',
    'contact.html',
    'privacy.html',
    'blog-details.html'
];

async function migrate() {
    for (const file of filesToMigrate) {
        const filePath = path.join(cwd, file);
        try {
            // Check if file exists
            await fs.access(filePath);
        } catch (e) {
            console.log(`Skipping ${file}, not found`);
            continue;
        }

        let content = await fs.readFile(filePath, 'utf-8');
        const name = file.replace('.html', '');
        const folderName = name; // simple mapping

        // 1. Update Resources (CSS, JS, Images)
        content = content.replace(/href="styles\.css"/g, 'href="../styles.css"');
        content = content.replace(/src="script\.js"/g, 'src="../script.js"');
        content = content.replace(/src="images\//g, 'src="../images/');
        content = content.replace(/srcset="images\//g, 'srcset="../images/');
        content = content.replace(/content="images\//g, 'content="../images/');

        // 2. Update Header Logo Link
        content = content.replace(/href="index\.html"/g, 'href="../"');
        // Note: this might replace nav link too, which is fine: Home -> ../

        // 3. Update Nav Links and other internal links
        // We need to handle 'about.html', 'program.html' etc.
        // Regex to match href="filename.html"
        // And ensure we don't double replace if we run this script multiple times (though we shouldn't)

        filesToMigrate.forEach(f => {
            const fname = f.replace('.html', '');
            const regex = new RegExp(`href="${f}"`, 'g');
            content = content.replace(regex, `href="../${fname}/"`);

            // Also handle query params or anchors if simple regex missed them?
            // simpler regex above matches exact string.
            // Let's us a smarter regex for suffixes
            const regexSuffix = new RegExp(`href="${f}(#|\\?)`, 'g'); // e.g. about.html#team
            content = content.replace(regexSuffix, `href="../${fname}/$1`);
        });

        // 4. Set Active State in Navbar
        // Look for the link pointing to this page's new folder
        // e.g. href="../about/"
        // Add class="active". 
        // But beware of double class attribute or replacing existing class.
        // The nav links usually don't have a class except possibly 'active' which we want to set.
        // Current nav links: <li><a href="about.html">About Us</a></li>
        // Transformed above to: <li><a href="../about/">About Us</a></li>

        const myLinkRegex = new RegExp(`href="\.\.\/${folderName}\/"`);
        content = content.replace(myLinkRegex, `href="../${folderName}/" class="active"`);

        // 5. Create Directory and Move
        const folderPath = path.join(cwd, folderName);
        try {
            await fs.mkdir(folderPath, { recursive: true });
        } catch (e) { }

        const newFilePath = path.join(folderPath, 'index.html');
        await fs.writeFile(newFilePath, content, 'utf-8');

        console.log(`Migrated ${file} -> ${folderName}/index.html`);

        // 6. Delete old file
        await fs.unlink(filePath);
    }
}

migrate().catch(console.error);
