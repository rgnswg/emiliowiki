import os
import html
import re
from PIL import Image

def generate_file_tree_html(base_path, output_html_path, media_dir):
    base_path = os.path.abspath(base_path)
    output_html_path = os.path.abspath(output_html_path)
    media_dir = os.path.abspath(media_dir)

    if not os.path.exists(media_dir):
        os.makedirs(media_dir)

    imgs_path = os.path.join(base_path, 'Imgs')
    image_map = {}

    print("Processing and trimming images...")
    if not os.path.exists(imgs_path):
        print(f"Warning: Image directory not found at {imgs_path}")
        return

    for root, _, files in os.walk(imgs_path):
        for file in files:
            if file.startswith('.') or not file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp')):
                continue
            
            input_path = os.path.join(root, file)
            base_filename, _ = os.path.splitext(file)
            output_filename = f"{base_filename}.png"
            output_path = os.path.join(media_dir, output_filename)
            
            try:
                with Image.open(input_path) as img:
                    if img.mode != 'RGBA':
                        img = img.convert('RGBA')
                    
                    bbox = img.getbbox()
                    if bbox:
                        cropped_img = img.crop(bbox)
                        cropped_img.save(output_path, 'PNG')
                        image_map[file] = os.path.join(os.path.basename(media_dir), output_filename)
                    else:
                        img.save(output_path, 'PNG')
                        image_map[file] = os.path.join(os.path.basename(media_dir), output_filename)
            except Exception as e:
                print(f"Could not process image {input_path}: {e}")

    print(f"Finished processing {len(image_map)} images.")

    def find_and_replace_images(content):
        matches = re.findall(r'!\[\[(.*?)\]\]', content)
        for img_name in matches:
            # The key in image_map is the full original filename (e.g., 'image.jpg')
            if img_name in image_map:
                img_path = image_map[img_name]
                img_tag = f'<img src="{img_path}" alt="{html.escape(img_name)}" style="max-width: 100%; height: auto;">'
                content = content.replace(f'![[{img_name}]]', img_tag)
            else:
                content = content.replace(f'![[{img_name}]]', f'[Image not found: {html.escape(img_name)}]')
        return content

    def process_directory_to_html(current_path):
        html_string = '<ul class="folder-content hidden">'
        
        dirs = []
        files = []
        for item in os.listdir(current_path):
            if item.startswith('.'):
                continue
            item_path = os.path.join(current_path, item)
            if os.path.isdir(item_path):
                dirs.append(item)
            elif os.path.isfile(item_path) and item.endswith('.md'):
                files.append(item)
        
        dirs.sort()
        files.sort()

        for item in dirs:
            item_path = os.path.join(current_path, item)
            html_string += f'<li class="folder">{item}'
            html_string += process_directory_to_html(item_path)
            html_string += '</li>'

        for item in files:
            item_path = os.path.join(current_path, item)
            with open(item_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            content_with_images = find_and_replace_images(content)
            escaped_content = html.escape(content_with_images)
            
            file_name = os.path.splitext(item)[0]
            html_string += f'<li class="file" data-content="{escaped_content}">{file_name}</li>'
            
        html_string += "</ul>"
        return html_string

    root_html = '<ul>'
    
    personajes_path = os.path.join(base_path, 'Personajes')
    if os.path.exists(personajes_path):
        root_html += '<li class="folder">Personajes'
        root_html += process_directory_to_html(personajes_path)
        root_html += '</li>'

    traits_path = os.path.join(base_path, 'Traits')
    if os.path.exists(traits_path):
        root_html += '<li class="folder">Traits'
        root_html += process_directory_to_html(traits_path)
        root_html += '</li>'
        
    root_html += '</ul>'

    with open(output_html_path, 'w', encoding='utf-8') as f:
        f.write(root_html)

    print(f"Generated {output_html_path} successfully.")

# Define paths relative to the project root, and make them absolute for the script
script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(script_dir, '..'))

eom_traits_dir = os.path.join(project_root, 'EOM_TRAITS')
output_html_file = os.path.join(project_root, 'file_tree.html')
media_output_dir = os.path.join(project_root, 'media')

# Run the generation
generate_file_tree_html(eom_traits_dir, output_html_file, media_output_dir)
