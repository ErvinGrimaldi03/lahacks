from sentence_transformers import SentenceTransformer
from annoy import AnnoyIndex
import numpy as np
def clean_tokens(token_list):
    return [token.replace('\n', '') for token in token_list]

def transform(token_list):
    model = SentenceTransformer('all-MiniLM-L6-v2')
    tokens = clean_tokens(token_list)
    embeddings = model.encode(tokens)
    print(embeddings)

    dimension = embeddings.shape[1]
    print(dimension)

    return embeddings
