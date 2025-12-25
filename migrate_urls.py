
import os
import re

# Map of old filenames to new folder names
pages = {
    'about.html': 'about',
    'program.html': 'program',
    'team.html': 'team',
    'blog.html': 'blog',
    'contact.html': 'contact',
    'privacy.html': 'privacy',
    'blog-details.html': 'blog-details'
}

cwd = r'c:\Users\Thinkpad\Downloads\Heal_360'

def update_content(content, current_page_name, is_root=False):
    # Update CSS
    if is_root:
        # Root index.html doesn't need CSS/JS path changes, only links
        pass
    else:
        # Subpages need ../ prefix for resources
        content = content.replace('href="styles.css"', 'href="../styles.css"')
        content = content.replace('src="script.js"', 'src="../script.js"')
        content = content.replace('src="images/', 'src="../images/')
        content = content.replace('srcset="images/', 'srcset="../images/')
        content = content.replace('content="images/', 'content="../images/') # OG tags

    # Update Navigation Links
    # Map: 'index.html' -> '../' (if subpage) or './' (if root)
    # 'about.html' -> '../about/' (if subpage) or 'about/' (if root)
    
    # We will use regex to catch href="about.html" and href="about.html#..."
    
    def replace_link(match):
        url = match.group(1)
        if url.startswith('http') or url.startswith('#') or url.startswith('mailto:'):
            return f'href="{url}"'
        
        # Handle index.html
        if url == 'index.html' or url.startswith('index.html#'):
            suffix = url.replace('index.html', '')
            if is_root:
                return f'href="./{suffix}"' # ./ for root stability
            else:
                return f'href="../{suffix}"' # ../ for subpages to go up

        # Handle other pages
        for old_file, folder in pages.items():
            if url == old_file or url.startswith(old_file + '?') or url.startswith(old_file + '#'):
                suffix = url.replace(old_file, '')
                if is_root:
                     return f'href="{folder}/{suffix}"'
                else:
                     return f'href="../{folder}/{suffix}"'
        
        return f'href="{url}"' # No match found

    content = re.sub(r'href="([^"]+)"', replace_link, content)
    
    # Active State
    # Remove existing active classes
    # content = re.sub(r' class="active"', '', content) # Too dangerous, might remove from hamburger
    
    # Better: finding the specific link in nav-links and adding active class
    if not is_root and current_page_name:
        folder_name = pages[current_page_name]
        # Look for href="../folder_name/" and add class="active"
        # The link logic above transformed 'about.html' -> '../about/'
        
        target_href = f'../{folder_name}/'
        # Regex to find <li><a href="target_href"> and add class
        # Note: simplistic regex, assumes standard formatting we saw in view_file
        # Pattern: <li><a href="../about/">About Us</a></li>
        # We want: <li><a href="../about/" class="active">About Us</a></li>
        
        # Or if it already has a class? <a href="..." class="logo">
        
        pattern = f'href="{re.escape(target_href)}"'
        replacement = f'href="{target_href}" class="active"'
        content = re.sub(pattern, replacement, content)

    return content

# Process Subpages
for old_file, folder in pages.items():
    old_path = os.path.join(cwd, old_file)
    if not os.path.exists(old_path):
        print(f"Skipping {old_file}, not found")
        continue
        
    with open(old_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = update_content(content, old_file, is_root=False)
    
    folder_path = os.path.join(cwd, folder)
    os.makedirs(folder_path, exist_ok=True)
    
    new_file_path = os.path.join(folder_path, 'index.html')
    with open(new_file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"Processed {old_file} -> {folder}/index.html")
    # Delete old file
    os.remove(old_path)

# Process Root index.html
index_path = os.path.join(cwd, 'index.html')
with open(index_path, 'r', encoding='utf-8') as f:
    content = f.read()

new_content = update_content(content, 'index.html', is_root=True)

with open(index_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Processed index.html")
