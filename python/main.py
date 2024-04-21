import os
import re
import tempfile
import requests
import pdfplumber
from langchain.text_splitter import CharacterTextSplitter
from sentence_transformers import SentenceTransformer
from langchain_community.vectorstores import FAISS
from transformers import AutoModel, AutoTokenizer
import torch
from textTransformer import transform
from chromadb.chroma import runChroma
class HuggingFaceEmbeddings:
    def __init__(self, model_name="sentence-transformers/all-MiniLM-L6-v2"):
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModel.from_pretrained(model_name)

    def get_embeddings(self, texts):
        inputs = self.tokenizer(texts, return_tensors="pt", padding=True, truncation=True, max_length=512)
        with torch.no_grad():
            outputs = self.model(**inputs)
        return outputs.last_hidden_state.mean(dim=1).cpu().numpy()

def download_pdf(url):
    response = requests.get(url)
    if response.status_code == 200:
        temp_pdf = tempfile.NamedTemporaryFile(suffix=".pdf", delete=False)
        temp_pdf.write(response.content)
        temp_pdf.close()
        return temp_pdf.name
    else:
        raise Exception("Failed to download PDF file")

def extract_text_from_pdf(pdf_path):
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text()
    os.unlink(pdf_path)
    return text

def clean_text(text):
    text = text.replace('\x00', '')
    return text

def getText(pdf_url):
    pdf_file = download_pdf(pdf_url)
    text = extract_text_from_pdf(pdf_file)
    cleaned_text = clean_text(text)
    return cleaned_text

def get_text_chunks(text):
    text_splitter = CharacterTextSplitter(
        separator="\n",
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )
    chunks = text_splitter.split_text(text)
    return chunks





def normalize_text(text):
    text = re.sub(r'\s*([.,;?!])\s*', r' \1 ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    text = text.lower()
    return text


class HuggingFaceEmbeddings:
    def __init__(self, model_name="sentence-transformers/all-MiniLM-L6-v2"):
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModel.from_pretrained(model_name)

    def get_embeddings(self, texts):
        inputs = self.tokenizer(texts, return_tensors="pt", padding=True, truncation=True, max_length=512)
        with torch.no_grad():
            outputs = self.model(**inputs)
        return outputs.last_hidden_state.mean(dim=1).cpu().numpy()


def main(pdf_url):
    text = getText(pdf_url)
    chunks = get_text_chunks(text)
    embeddings = transform(chunks)
    runChroma(embeddings)

if __name__ == "__main__":
    pdf_url = "https://res.cloudinary.com/dairtsywx/image/upload/v1713682160/LA%20Hacks/IHM_Scholarship_Essay_u4ya47.pdf"
    main(pdf_url)
