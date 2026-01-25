import re
import datetime

file_path = '/Users/m/Documents/cosiampira/cosiampira/src/data/articles.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Header is everything before the first article object
header_match = re.search(r'export const articles = \[\n', content)
if not header_match:
    print("Could not find start of articles array")
    exit(1)

start_index = header_match.end()
# Footer is everything after the last closing brace and bracket
footer_match = re.search(r'\n\];\s*$', content)
if not footer_match:
    print("Could not find end of articles array")
    exit(1)

end_index = footer_match.start()

header = content[:start_index]
footer = content[end_index:]
articles_body = content[start_index:end_index]

# Split into individual article blocks.
# We assume each article starts with "    {" and ends with "    },"
# But the last one might not have a comma.
# Let's use a regex to find the start of each object.

# Regex to split items.
# We look for the pattern "    {" at the start of a line.
items = re.split(r'\n(?=    \{)', articles_body)
# The first split might be empty if the body starts with newline
items = [item for item in items if item.strip()]

parsed_items = []

for item in items:
    # Extract ID
    id_match = re.search(r'id:\s*(\d+)', item)
    article_id = int(id_match.group(1)) if id_match else 0
    
    # Extract Date
    date_match = re.search(r'date:\s*[\'"]([^\'"]+)[\'"]', item)
    article_date = date_match.group(1) if date_match else ''
    
    # Extract Author (for updating)
    author_match = re.search(r'author:\s*[\'"]([^\'"]+)[\'"]', item)
    current_author = author_match.group(1) if author_match else ''
    
    # Apply updates
    new_item_content = item
    
    if article_id == 3:
        # Éliane Radigue... -> eme isaza
        new_item_content = re.sub(r"author:\s*'[^']+'", "author: 'eme isaza'", new_item_content)
    elif article_id == 6:
        # Devenir y Deriva -> eme isaza
        new_item_content = re.sub(r"author:\s*'[^']+'", "author: 'eme isaza'", new_item_content)
    elif article_id == 7:
        # Sobre los senderos del jardín -> Émilie Gillet
        # Note: Current author in file is François J. Bonnet
        new_item_content = re.sub(r"author:\s*'[^']+'", "author: 'Émilie Gillet'", new_item_content)
        
    parsed_items.append({
        'id': article_id,
        'date': article_date,
        'content': new_item_content
    })

# Sort by date descending
parsed_items.sort(key=lambda x: x['date'], reverse=True)

# Reconstruct the body
new_body = '\n'.join([item['content'] for item in parsed_items])

# Remove leading newline from the first item if it exists in the join, but join adds it between.
# We need to ensure the indentation is correct.
# The original items likely kept their indentation.

# Just to be sure, let's check if the first item has a leading newline from the split
if not new_body.startswith('\n') and not new_body.startswith('    {'):
     new_body = '\n' + new_body

# Ensure the last item has a comma if it's not the last one in the list?
# The original array had commas after each item usually, except maybe the last one.
# It's JS, trailing comma is allowed and good.
# Let's ensure every item ends with a comma.
final_items_str = []
for i, item in enumerate(parsed_items):
    c = item['content'].rstrip()
    if c.endswith(','):
        # Good
        pass
    else:
        # Add comma
        c += ','
    final_items_str.append(c)
    
new_body_str = '\n'.join(final_items_str)

# Write back
new_full_content = header + new_body_str + footer

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_full_content)

print("Successfully updated and sorted articles.")
