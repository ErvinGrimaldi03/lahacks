import chromadb

COLLECTION_NAME = "intro_to_cs"
METADATA = [{"section" : f"Chapter {_+1}",
            "title" : "What is Computer Science",
            "class_title" : "intro_to_cs",
            "keywords": ["computing", "introduction", "fundamentals"]
             }for _ in range(4)]


def init_chromadb(client=None, collection_name="default_collection"):
    if client is None:
        try:
            client = chromadb.Client()  # Try to initialize the client as intended
        except AttributeError:
            print("ChromaDB client is not available in the module. Using a mock client.")
            client = MockChromaDBClient()  # Use the mock if real client is not available

    try:
        collection = client.create_collection(name=collection_name)
        print(f"Created new collection: {collection_name}")
    except Exception as e:
        print(f"Error or collection already exists: {e}")
        collection = client.get_collection(name=collection_name)

    return client, collection

def setup_collection_schema(collection, schema):
    try:
        collection.set_schema(schema)
    except Exception as e:
        print(e)



def addData(client, collection_name, embeddings, metadata):
    collection = init_chromadb(client, collection_name)

    for i, (embeddings, data) in enumerate(zip(embeddings, METADATA)):
        document = {
            "id" : i,
            "vector" : embeddings.tolist(),
            "metadata" : data
        }
    try:
        collection.insert(document)
    except Exception as e:
        print(e)


def queryData(client, name, vector, query_vector, top_k=5, class_title=None):
    collection = client.get_collection(name)
    query = {
        "vector" : query_vector,
        "metadata" : {
            "class_title" : class_title
        }
    }
    results = collection.find_nearest(query, top_k)
    return results
