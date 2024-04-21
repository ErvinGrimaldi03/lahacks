import chromadb


import chromadb

def initChroma(chroma_client):
    # Initialize or retrieve a collection, assuming it does not already exist
    try:
        collection = chroma_client.create_collection(name="es")
    except Exception as e:
        # Handle exceptions, e.g., if the collection already exists
        print("Collection already exists or error in creating collection:", e)
        collection = chroma_client.get_collection(name="es")
    return collection

def addChroma(client, embeddings):
    # Ensure the collection exists
    collection = initChroma(client)

    # Assuming `embeddings` is a list of embedding vectors
    for i, embedding in enumerate(embeddings):

        document = {
            "id": i,  # Assign a unique identifier for each embedding
            "vector": embedding.tolist()  # Convert numpy array to list if necessary
        }
        # Insert the document into the collection
        try:
            collection.insert(document)  # The method name depends on the actual API
        except Exception as e:
            print(f"Error inserting document {i}: {e}")

def runChroma(embeddings):
    chroma_client = chromadb.Client('db')
    if not chroma_client:
        raise Exception("Failed to initialize ChromaDB client")

    addChroma(chroma_client, embeddings)


def query(client, collection_name, query, top_k=5):
    collection = client.get_collections(collection_name)
    results = collection.find_nearest(query, top_k)
    return results

def mostSimilar(self, query, tok_k):
    pass

if __name__ == "__main__":
    pass