import os
import sys
import zipfile
import xml.etree.ElementTree as ET
try:
    import pypdf
except ImportError:
    pypdf = None

def extract_docx(file_path):
    try:
        with zipfile.ZipFile(file_path) as docx:
            xml_content = docx.read('word/document.xml')
            root = ET.fromstring(xml_content)
            texts = []
            # w:t elements contain text
            for elem in root.iter():
                if elem.tag.endswith('}t') or elem.tag == 't':
                    if elem.text:
                        texts.append(elem.text)
            return '\n'.join(texts)
    except Exception as e:
        return f"[Error extracting DOCX {os.path.basename(file_path)}: {str(e)}]"

def extract_pdf(file_path):
    if pypdf is None:
        return f"[pypdf not installed. Cannot extract PDF {os.path.basename(file_path)}]"
    try:
        reader = pypdf.PdfReader(file_path)
        texts = []
        for i, page in enumerate(reader.pages):
            text = page.extract_text()
            if text:
                texts.append(f"--- PAGE {i+1} ---\n{text}")
        return '\n'.join(texts)
    except Exception as e:
        return f"[Error extracting PDF {os.path.basename(file_path)}: {str(e)}]"

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 extract.py <directory_path>")
        sys.exit(1)
        
    dir_path = sys.argv[1]
    if not os.path.exists(dir_path):
        print(f"[Directory not found: {dir_path}]")
        sys.exit(1)
        
    extracted_data = []
    
    # List files in the directory
    try:
        files = sorted(os.listdir(dir_path))
    except Exception as e:
        print(f"[Error listing directory {dir_path}: {str(e)}]")
        sys.exit(1)
        
    for filename in files:
        if filename.startswith('.') or filename == 'Thumbs.db':
            continue
        file_path = os.path.join(dir_path, filename)
        if not os.path.isfile(file_path):
            continue
            
        ext = os.path.splitext(filename)[1].lower()
        content = ""
        
        if ext in ['.md', '.txt', '.json', '.csv']:
            try:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
            except Exception as e:
                content = f"[Error reading text file: {str(e)}]"
        elif ext == '.docx':
            content = extract_docx(file_path)
        elif ext == '.pdf':
            content = extract_pdf(file_path)
            
        if content:
            extracted_data.append(f"=========================================\nFILE: {filename}\n=========================================\n{content}\n")
            
    print('\n'.join(extracted_data))

if __name__ == '__main__':
    main()
