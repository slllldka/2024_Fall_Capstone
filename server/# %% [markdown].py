# %% [markdown]
# 

# %%


# %% [markdown]
# # Dataset
# We firstly open the dataset created by us manually and with help of chatGPT to get the foods' description. If we use an AI to generate descriptions of food, then we just need to get new food names and get the descriptions easily. This will make the program scalable.

# %%
import pandas as pd
file_path = 'updated_food_data2-1.xlsx'
updated_food_data_df = pd.read_excel(file_path)
updated_food_data_df

# %% [markdown]
# # Text Preprocessing, Noun Extraction, and Entity Recognition for Keyword Extraction
# 
# 1. **`preprocess_text` Function**: 
#    - This function receives a raw text string as input.
#    - It tokenizes the text, removing common stopwords and non-alphabetic tokens to filter out unimportant words.
#    - Each token is then lemmatized (reduced to its base or "dictionary" form) using WordNetLemmatizer from NLTK. Lemmatization is crucial as it standardizes words, making variations of a word like "running" and "runs" equivalent to "run".
#    - The resulting list of cleaned, meaningful words is returned as output.
# 
# 2. **`get_nouns` Function**:
#    - This function receives a list of tokens, typically after preprocessing.
#    - It uses part-of-speech (POS) tagging to identify nouns, which are often central to determining the main subjects and concepts in the text.
#    - Only words tagged as nouns (POS tags beginning with "NN") are kept, as they tend to represent entities or topics.
#    - This filtered list of nouns is returned, narrowing down the tokens to those likely relevant for keywords.
# 
# 3. **`get_entities` Function**:
#    - This function performs named entity recognition (NER) on the original text using spaCy’s language model.
#    - Named entities are proper nouns, locations, dates, and other significant phrases that provide context and specificity.
#    - The function returns a list of these entities, capturing essential, named information in the text.
# 
# 4. **`extract_keywords` Function**:
#    - This function orchestrates the keyword extraction by combining the outputs from `preprocess_text`, `get_nouns`, and `get_entities`.
#    - It first preprocesses the text, then extracts nouns from the processed tokens, and finally recognizes named entities in the original text.
#    - The function merges the lists of nouns and entities, removing duplicates, to produce a final list of keywords that encompass both general topics and specific entities.
# 

# %%
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk import pos_tag
import string
import spacy

nlp = spacy.load("en_core_web_sm")

def preprocess_text(text):
    lemmatizer = WordNetLemmatizer()
    stop_words = set(stopwords.words("english"))
    tokens = nltk.word_tokenize(text)

    lemmas = []
    for token in tokens:
        if token.lower() not in stop_words and token.isalpha():
            lemma = lemmatizer.lemmatize(token.lower())
            lemmas.append(lemma)
    return lemmas

def get_nouns(tokens):
    pos_tags = pos_tag(tokens)
    nouns = []
    for word, pos in pos_tags:[savory, something]
        if pos.startswith('NN'):
            nouns.append(word)
    return nouns


def get_entities(text):
    doc = nlp(text)
    entities = [ent.text for ent in doc.ents]
    return entities


def extract_keywords(text):
    lemmas = preprocess_text(text)
    nouns = get_nouns(lemmas)
    entities = get_entities(text)
    relevant_keywords = list(set(nouns + entities))
    return relevant_keywords

# %%
updated_food_data_df['keywords'] = updated_food_data_df['description'].apply(

    lambda x: extract_keywords(str(x)) if isinstance(x, str) else extract_keywords("")

)
updated_food_data_df

# %%
def remove_duplicates(keywords):
    if isinstance(keywords, list):
        return list(set(keywords))
    return keywords  
updated_food_data_df['keywords'] = updated_food_data_df['keywords'].apply(remove_duplicates)

updated_food_data_df


# %%
updated_food_data_df['keywords'] = updated_food_data_df['keywords'].apply(
    lambda keywords: [keyword for keyword in keywords if len(keyword) > 2]
)

updated_food_data_df

# %%
import matplotlib.pyplot as plt
from collections import Counter

keywords_list = updated_food_data_df['keywords'].dropna().sum()
keywords_counts = Counter(keywords_list)

top_keywords_df = pd.DataFrame(keywords_counts.items(), columns=['Keyword', 'Count'])
top_keywords_df = top_keywords_df.sort_values(by='Count', ascending=False).head(30)

plt.figure(figsize=(10, 6))
plt.bar(top_keywords_df['Keyword'], top_keywords_df['Count'])
plt.xlabel('Keywords')
plt.ylabel('Frequency')
plt.title('Top 30 Keywords by Frequency')
plt.xticks(rotation=45)
plt.show()


# %%
keywords_list = updated_food_data_df['keywords'].dropna().sum()
keywords_counts = Counter(keywords_list)
least_keywords_df = pd.DataFrame(keywords_counts.items(), columns=['Keyword', 'Count'])
least_keywords_df = least_keywords_df.sort_values(by='Count', ascending=True).head(20)

plt.figure(figsize=(10, 6))
plt.bar(least_keywords_df['Keyword'], least_keywords_df['Count'])
plt.xlabel('Keywords')
plt.ylabel('Frequency')
plt.title('20 Least Frequent Keywords')
plt.xticks(rotation=45)
plt.show()


# %% [markdown]
# # Analyzing Chat GPT's text
# We asked chat GPT to write some messages the user's could tell us on the app and also to tell us the positive and negative keywords of the message. Using that we can measure how well our application is working on finding keywords and also analyzing the sentiment of them.

# %%
messages = []
positive_keywords = []
negative_keywords = []
mapping_file_path_extended = 'food_message_keywords_mapping_extended.txt'

with open(mapping_file_path_extended, 'r') as file:
    for line in file:
        if line.startswith("Message:"):
            messages.append(line[len("Message: "):].strip())
        elif line.startswith("Positive Keywords:"):
            positive_keywords.append(line[len("Positive Keywords: "):].strip().split(", "))
        elif line.startswith("Negative Keywords:"):
            negative_keywords.append(line[len("Negative Keywords: "):].strip().split(", "))

df_trial = pd.DataFrame({
    "message": messages,
    "positive_keywords": positive_keywords,
    "negative_keywords": negative_keywords
})


# %%
df_trial

# %%
df_trial['keywords'] = df_trial['message'].apply(

    lambda x: extract_keywords(str(x)) if isinstance(x, str) else extract_keywords("")

)
df_trial['keywords'] = df_trial['keywords'].apply(remove_duplicates)
df_trial

# %%
df_trial['positive_keywords'] = df_trial['positive_keywords'].apply(lambda x: [kw for kw in x if kw != "None"])
df_trial['negative_keywords'] = df_trial['negative_keywords'].apply(lambda x: [kw for kw in x if kw != "None"])

df_trial

# %%
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Cargar el modelo preentrenado para generación de embeddings
model = SentenceTransformer('all-MiniLM-L6-v2')

def calculate_match_percentage(row, columnName, threshold=0.7):
    positive_embeddings = model.encode(row['positive_keywords'], convert_to_tensor=True) if row['positive_keywords'] else None
    negative_embeddings = model.encode(row['negative_keywords'], convert_to_tensor=True) if row['negative_keywords'] else None
    keywords_embeddings = model.encode(row[columnName], convert_to_tensor=True) if row[columnName] else None

    positive_matches = 0
    negative_matches = 0
    
    if positive_embeddings is not None and keywords_embeddings is not None:
        for positive in positive_embeddings:
            for keyword_embedding in keywords_embeddings:
                similarity = cosine_similarity(positive.unsqueeze(0), keyword_embedding.unsqueeze(0))
                if similarity >= threshold:
                    positive_matches += 1  

    if negative_embeddings is not None and keywords_embeddings is not None:
        for negative in negative_embeddings:
            for keyword_embedding in keywords_embeddings:
                similarity = cosine_similarity(negative.unsqueeze(0), keyword_embedding.unsqueeze(0))
                if similarity >= threshold:
                    negative_matches += 1  

    total_keywords = len(row['positive_keywords']) + len(row['negative_keywords'])
    matched_keywords = positive_matches + negative_matches
    
    return (matched_keywords / total_keywords) * 100 if total_keywords > 0 else 0

df_trial['match_percentage'] = df_trial.apply(calculate_match_percentage, axis=1, columnName='keywords')
df_trial


# %%
total_match_percentage = df_trial['match_percentage'].mean()
total_match_percentage


# %%
keywords_set = {keyword for sublist in updated_food_data_df['keywords'] for keyword in sublist}

df_trial['new_keywords'] = df_trial['message'].apply(

    lambda message: [keyword for keyword in keywords_set if keyword in message]

)

# %%
df_trial['match_percentage2'] = df_trial.apply(calculate_match_percentage, axis=1, columnName='new_keywords')

# %%
total_match_percentage = df_trial['match_percentage2'].mean()
total_match_percentage


# %%
df_trial['combined_keywords'] = df_trial.apply(
    lambda row: list(set(row['keywords'] + row['new_keywords'])), axis=1
)

# %%
df_trial['match_percentage3'] = df_trial.apply(calculate_match_percentage, axis=1, columnName='combined_keywords')

# %%
total_match_percentage = df_trial['match_percentage3'].mean()
total_match_percentage

# %% [markdown]
# # Aspect-Based Sentiment Analysis (ABSA) Using DeBERTa Model
# 
# We use the `transformers` library to load and apply the model `yangheng/deberta-v3-large-absa-v1.1` for ABSA. The steps are as follows:
# 
# 1. **Loading the Model**:
#    - We start by loading the DeBERTa model and tokenizer from Hugging Face's Transformers library.
# 
# 2. **Aspect-Based Sentiment Analysis Function**:
#    - The main function, `aspect_based_sentiment_analysis`, takes a text input and a list of aspects to evaluate.
#    - For each aspect, the function:
#      - Concatenates the aspect with the text using a separator (`[SEP]`), following the format needed for ABSA.
#      - Tokenizes this combined input and passes it through the model.
#      - Obtains the model's output, interprets the logits, and maps the predicted class ID to a sentiment label (negative, neutral, or positive).
#    - It returns a dictionary where each aspect is mapped to its predicted sentiment.
# 

# %%
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

model_name = 'yangheng/deberta-v3-large-absa-v1.1'

tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

def aspect_based_sentiment_analysis(text, aspects):
    sentiment_results = {}

    for aspect in aspects:
        aspect_text = f"{text} [SEP] {aspect}"
        inputs = tokenizer(aspect_text, return_tensors='pt', truncation=True)
        outputs = model(**inputs)
        logits = outputs.logits
        predicted_class_id = logits.argmax().item()
        if predicted_class_id == 0:
            sentiment = "negative"
        elif predicted_class_id == 1:
            sentiment = "neutral"
        elif predicted_class_id == 2:
            sentiment = "positive"

        sentiment_results[aspect] = sentiment

    return sentiment_results


# %%
df_trial['sentiment_analysis'] = df_trial.apply(lambda row: aspect_based_sentiment_analysis(row['message'], row['combined_keywords']), axis=1)

# %%
df_trial.iloc[6]['sentiment_analysis']

# %%
from sklearn.metrics.pairwise import cosine_similarity

model_name = 'all-MiniLM-L6-v2'
model = SentenceTransformer(model_name)

def calculate_accuracy_with_similarity(row, threshold=0.7):
    sentiment_results = row['sentiment_analysis']
    positive_keywords = row['positive_keywords']
    negative_keywords = row['negative_keywords']
    positive_embeddings = model.encode(positive_keywords, convert_to_tensor=True) if positive_keywords else []
    negative_embeddings = model.encode(negative_keywords, convert_to_tensor=True) if negative_keywords else []
    
    correct_predictions = 0
    total_counted = 0

    for keyword, predicted_sentiment in sentiment_results.items():
        keyword_embedding = model.encode([keyword], convert_to_tensor=True)
        max_positive_similarity = max([cosine_similarity(keyword_embedding, pos_emb.unsqueeze(0)).item() for pos_emb in positive_embeddings], default=0)
        max_negative_similarity = max([cosine_similarity(keyword_embedding, neg_emb.unsqueeze(0)).item() for neg_emb in negative_embeddings], default=0)

        if max_positive_similarity >= threshold:
            true_sentiment = "positive"
        elif max_negative_similarity >= threshold:
            true_sentiment = "negative"
        else:
            continue  

        if predicted_sentiment == true_sentiment:
            correct_predictions += 1
        total_counted += 1
    return (correct_predictions / total_counted) * 100 if total_counted > 0 else None

df_trial['accuracy_percentage'] = df_trial.apply(calculate_accuracy_with_similarity, axis=1)

df_trial[['message', 'positive_keywords', 'negative_keywords', 'sentiment_analysis', 'accuracy_percentage']]


# %%
average_accuracy = df_trial['accuracy_percentage'].mean(skipna=True)
average_accuracy


