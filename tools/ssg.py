import os
import html
import re
from PIL import Image
import markdown
import json

def generate_media_json_files(media_dir, project_root):
    print("Generating media JSON files...")

    memes_dir = os.path.join(media_dir, 'memes')
    audios_dir = os.path.join(media_dir, 'audios')

    if not os.path.exists(memes_dir):
        os.makedirs(memes_dir)
    if not os.path.exists(audios_dir):
        os.makedirs(audios_dir)

    meme_files = [os.path.relpath(os.path.join(memes_dir, f), project_root) for f in os.listdir(memes_dir) if os.path.isfile(os.path.join(memes_dir, f))]
    audio_files = [os.path.relpath(os.path.join(audios_dir, f), project_root) for f in os.listdir(audios_dir) if os.path.isfile(os.path.join(audios_dir, f))]

    with open(os.path.join(media_dir, 'memes.json'), 'w') as f:
        json.dump(meme_files, f)

    with open(os.path.join(media_dir, 'audios.json'), 'w') as f:
        json.dump(audio_files, f)

    print("Finished generating media JSON files.")

def has_markdown_files(directory_path):
    for _, _, files in os.walk(directory_path):
        for file in files:
            if file.endswith('.md'):
                return True
    return False

def generate_file_tree_html(base_path, output_html_path, media_dir):
    base_path = os.path.abspath(base_path)
    output_html_path = os.path.abspath(output_html_path)
    media_dir = os.path.abspath(media_dir)
    images_output_dir = os.path.join(media_dir, 'images')

    if not os.path.exists(images_output_dir):
        os.makedirs(images_output_dir)

    imgs_path = os.path.join(base_path, 'Imgs')
    image_map = {}

    print("Processing and trimming images...")
    if not os.path.exists(imgs_path):
        print(f"Warning: Image directory not found at {imgs_path}")
    else:
        for root, _, files in os.walk(imgs_path):
            for file in files:
                if file.startswith('.') or not file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp')):
                    continue

                input_path = os.path.join(root, file)
                base_filename, _ = os.path.splitext(file)
                output_filename = f"{base_filename}.png"
                output_path = os.path.join(images_output_dir, output_filename)

                try:
                    with Image.open(input_path) as img:
                        if img.mode != 'RGBA':
                            img = img.convert('RGBA')

                        bbox = img.getbbox()
                        if bbox:
                            cropped_img = img.crop(bbox)
                            cropped_img.save(output_path, 'PNG')
                            image_map[file] = os.path.join(os.path.basename(media_dir), 'images', output_filename)
                        else:
                            img.save(output_path, 'PNG')
                            image_map[file] = os.path.join(os.path.basename(media_dir), 'images', output_filename)
                except Exception as e:
                    print(f"Could not process image {input_path}: {e}")

    print(f"Finished processing {len(image_map)} images.")

    def process_images_in_content(content):
        def replacer(match):
            block = match.group(0)
            image_tags = re.findall(r'!\[\[(.*?)\]\]', block)
            html_tags = []
            for img_name in image_tags:
                if img_name in image_map:
                    img_path = image_map[img_name]
                    alt_text = html.escape(os.path.splitext(img_name)[0])
                    html_tags.append(f'<img src="{img_path}" alt="{alt_text}">')
                else:
                    html_tags.append(f'[Image not found: {html.escape(img_name)}]')

            if len(html_tags) > 1:
                return f'<div class="image-grid">{" ".join(html_tags)}</div>'
            elif len(html_tags) == 1:
                return f'<p>{html_tags[0]}</p>'
            else:
                return ''

        return re.sub(r'(!\[\[.*?\]\]\s*)+', replacer, content)

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
            if has_markdown_files(item_path):
                html_string += f'<li class="folder">{item}'
                html_string += process_directory_to_html(item_path)
                html_string += '</li>'

        for item in files:
            item_path = os.path.join(current_path, item)
            with open(item_path, 'r', encoding='utf-8') as f:
                content = f.read()

            content_with_html_images = process_images_in_content(content)
            final_html = markdown.markdown(content_with_html_images)
            escaped_html = final_html.replace('"', '&quot;')

            file_name = os.path.splitext(item)[0]
            html_string += f'<li class="file" data-content="{escaped_html}">{file_name}</li>'

        html_string += "</ul>"
        return html_string

    root_html = '<ul>'

    for item in sorted(os.listdir(base_path)):
        item_path = os.path.join(base_path, item)
        if os.path.isdir(item_path) and not item.startswith('.') and has_markdown_files(item_path):
            root_html += f'<li class="folder">{item}'
            root_html += process_directory_to_html(item_path)
            root_html += '</li>'

    root_html += '</ul>'

    with open(output_html_path, 'w', encoding='utf-8') as f:
        f.write(root_html)

    print(f"Generated {output_html_path} successfully.")

script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(script_dir, '..'))

eom_traits_dir = os.path.join(project_root, 'EOM_TRAITS')
output_html_file = os.path.join(project_root, 'file_tree.html')
media_output_dir = os.path.join(project_root, 'media')

generate_file_tree_html(eom_traits_dir, output_html_file, media_output_dir)
generate_media_json_files(media_output_dir, project_root)
