import os
import warnings
import faiss
from flask_cors import CORS
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_ollama import OllamaEmbeddings, ChatOllama
from langchain_community.vectorstores import FAISS
from langchain_community.docstore.in_memory import InMemoryDocstore
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain import hub
import speech_recognition as sr
# Ignore warnings
warnings.filterwarnings("ignore")
load_dotenv()

app = Flask(__name__)
app.config['DEBUG'] = True
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Global variables
chat_history = []
db_name = "health_supplements"
db_path = f"{db_name}/index.faiss"

# Load embedding model
embeddings = OllamaEmbeddings(model="nomic-embed-text", base_url="http://localhost:11434")

# Ensure FAISS index exists with correct dimensions
try:
    test_embedding = embeddings.embed_query("test")
    embedding_dim = len(test_embedding)  # Ensure correct dimension

    if os.path.exists(db_path):
        vector_store = FAISS.load_local(db_name, embeddings=embeddings, allow_dangerous_deserialization=True)

        if vector_store.index.d != embedding_dim:
            print(f"FAISS index dimension mismatch: expected {embedding_dim}, found {vector_store.index.d}. Recreating index.")
            raise ValueError("Dimension mismatch")
    else:
        raise FileNotFoundError("FAISS index not found.")

except Exception as e:
    print(f"Error loading FAISS: {e}")
    
    # Reinitialize FAISS index with correct dimensions
    index = faiss.IndexFlatL2(embedding_dim)
    vector_store = FAISS(embedding_function=embeddings, index=index, docstore=InMemoryDocstore(), index_to_docstore_id={})
    
    # Save FAISS index
    os.makedirs(db_name, exist_ok=True)
    vector_store.save_local(db_name)
    print("New FAISS index created and saved.")

# Setup retriever
retriever = vector_store.as_retriever(search_type="mmr", search_kwargs={"k": 3, "fetch_k": 20, "lambda_mult": 0.5})


# Load AI model
model = ChatOllama(model="medllama2:latest", base_url="http://localhost:11434")
prompt = hub.pull("rlm/rag-prompt")
# Define prompt template
prompt_template = """
VERY IMPORTANT : Do not provide any medical advice or diagnosis. If you are unsure about the answer, please mention that you are unsure.
VERY IMPORTANT: DO  NOT PROVIDE ANYTHING ELSE OTHER THAN MEDICAL  DATA. JUST SAY THAT IT IS NOT RELATED TO MEDICINES like multiplications or artihmetic operations
You are an assistant for doctor tasks. Use the following context to answer the question:
Context: {context}
Question: {question}
Answer in bullet points. Answer only from context .
"""

prompt = ChatPromptTemplate.from_template(prompt_template)

# Format documents for retrieval
def format_docs(docs):
    return "\n\n".join([doc.page_content for doc in docs])

# # Define RAG pipeline
# rag_chain = (
#     {
#         "context": retriever | format_docs,
#         "question": RunnablePassthrough(),
#         "history": lambda x: "\n".join(item["content"] for item in chat_history) if chat_history else "No previous context",
#     }
#     | prompt
#     | model
#     | StrOutputParser()
# )
rag_chain = (
    {"context": retriever|format_docs, "question": RunnablePassthrough()}
    | prompt
    | model
    | StrOutputParser()
)

prompttt = """
VERY IMPORTANT: ACT AS A MEDICAL CHATBOT AND GIVE MEANINGFUL ADVICES DO NOT HALLUCIANATE OR GIVE ANYTHING ELSE"""

# @app.route("/chat", methods=["POST"])
# def chat():
#     user_input = request.json.get("message", "").strip()
#     if not isinstance(user_input, str):
#         user_input = str(user_input)
    
#     user_input = user_input + " " + prompttt
#     print(f"User Input: {user_input}")

#     def generate():
#         for response in model.stream(user_input):
#             yield f"{response.content} "

#     return app.response_class(generate(), content_type='text/plain')

@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("message", "").strip()

    # Ensure input is a string
    if not isinstance(user_input, str):
        user_input = str(user_input)
    user_input = user_input + " " + prompttt

    print(f"User Input: {user_input}")
    response = model.invoke(f"{user_input}")

    # Extract content from the response
    content = response.content if hasattr(response, "content") else str(response)

    return jsonify({"reply": content})


@app.route("/upload", methods=["POST"])
def upload():
    uploaded_file = request.files.get("pdf")
    question = request.form.get("question", "").strip()

    if not uploaded_file or uploaded_file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    # Save file temporarily
    tmp_path = os.path.join("/tmp", uploaded_file.filename)
    uploaded_file.save(tmp_path)

    # Load and process PDF
    loader = PyMuPDFLoader(tmp_path)
    pages = loader.load()
    splitter = RecursiveCharacterTextSplitter(chunk_size=2000, chunk_overlap=200)
    new_chunks = splitter.split_documents(pages)

    if new_chunks:
        # Avoid re-processing same documents
        existing_ids = set(vector_store.index_to_docstore_id.values())
        new_docs = [chunk for chunk in new_chunks if chunk.metadata["source"] not in existing_ids]

        if new_docs:
            vector_store.add_documents(new_docs)
            vector_store.save_local(db_name)

    # Retrieve context and generate response
    response = rag_chain.invoke(question)
    return jsonify({"reply": response.content if hasattr(response, "content") else str(response)})

from pydub import AudioSegment
import io

@app.route("/voice", methods=["POST"])
def voice():
    if "voice" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["voice"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    try:
        # Convert webm to wav
        audio = AudioSegment.from_file(file, format="webm")
        wav_io = io.BytesIO()
        audio.export(wav_io, format="wav")
        wav_io.seek(0)

        recognizer = sr.Recognizer()
        audio_file = sr.AudioFile(wav_io)

        with audio_file as source:
            audio = recognizer.record(source)
        user_input = recognizer.recognize_google(audio).strip()

        # Ensure input is a string
        if not isinstance(user_input, str):
            user_input = str(user_input)
        user_input = user_input + " " + prompttt

        print(f"User Input: {user_input}")
        response = model.invoke(f"{user_input}")

        # Extract content from the response
        content = response.content if hasattr(response, "content") else str(response)

        return jsonify({"reply": content})

    except sr.UnknownValueError:
        return jsonify({"error": "Could not understand audio"}), 400
    except sr.RequestError as e:
        return jsonify({"error": f"Could not request results; {e}"}), 500
    except Exception as e:
        return jsonify({"error": f"An error occurred: {e}"}), 500

# Run Flask app
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)