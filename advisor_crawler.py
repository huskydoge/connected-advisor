import requests
from bs4 import BeautifulSoup
import openai
import os
import pandas as pd
from logger import logger

PROMPT = "You will serve as a programming agent that helps data collection for a crawler project.\
          The following text is extracted from an HTML homepage of a professor, \
          so there might be inconsistencies between the text that requires you to infer. \
          Please extract the following fields \
          - Name \
          - Affiliation history (including the current position) \
            e.g. A list of (Timespan - Affiliation - Lab - Position) \
            (You can skip certain fields and return results like N/A - SJTU - MVIG - Intern, and sort it chronically if possible)\
          - Github url \
          - Email address \
          - Google Scholar Homepage url (Should be compulsory) \
          - Field of Interest (You can summarize it in your own words) \
          - Personal Introduction (Around 100-200 words)\
          - Recruitment Information. \
          Please return the result in the exactly the following format for automated processing\
          field0: ... (for name)\n field1: ... (for affiliation) ...\
          If you cannot find the information, just return 'N/A' for that particular field\
          The text is as follows: "

# Function to crawl a professor's homepage and retrieve text
def crawl_homepage(url):
    # Make a request to the homepage
    page = requests.get(url)
    soup = BeautifulSoup(page.content, 'html.parser')
    
    # Find all links within the homepage domain
    links = [a['href'] for a in soup.find_all('a', href=True) if url in a['href']]
    
    # Initialize a set to store unique texts
    texts = set()
    
    # Add the main page's text
    texts.add(soup.get_text())
    
    # Loop through all found links to get their texts
    for link in links:
        page = requests.get(link)
        soup = BeautifulSoup(page.content, 'html.parser')
        texts.add(soup.get_text())
    
    return texts

def text_cleaning(text):
    cleaned_text = text.replace('\n', ' ').replace('\t', ' ').replace('\r', ' ')
    return cleaned_text

# Function to process text through GPT-3.5 API for structured data extraction
def process_text_with_gpt(text, client):
    text = text_cleaning(text)

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": "{PROMPT} {text}"}
        ]
    )

    print(response)
    assert False
    # Assume the response contains the structured data in the desired format
    return response

def fetch_csv_path(dir):
    # Fetch all csv files in the directory
    csv_files = [f for f in os.listdir(dir) if f.endswith('.csv')]
    return csv_files

def main_worker(args):
    dir = args.dir
    openai_key = args.key
    csv_files = fetch_csv_path(dir)
        
    # Craft a prompt for GPT-3.5 to structure the text
    client = openai.Client(api_key=openai_key)
    logger.info("OpenAI client created")
    
    
    for raw_csv in csv_files:
        df = pd.read_csv(os.path.join(dir, raw_csv))
        urls = df['homepage'].values.tolist()
        for url in urls:
            texts = crawl_homepage(url)
            combined_text = " ".join(texts)
            structured_data = process_text_with_gpt(combined_text, client)
            print(structured_data)
            print("\n\n")
        



if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--dir", type=str, required=True, help="directory to the csv files")
    parser.add_argument("--key", type=str, required=True, help="openai api key")
    args = parser.parse_args()
    
    os.environ["CURL_CA_BUNDLE"] = ""
    os.environ["http_proxy"] = "http://127.0.0.1:1080"
    os.environ["https_proxy"] = "http://127.0.0.1:1080"
        
    main_worker(args)
    
    # # Example usage
    # homepage_url = 'http://professor_homepage.com'
    # texts = crawl_homepage(homepage_url)
    
    # # Combine texts and process
    # combined_text = " ".join(texts)  # Simplified; you might need more sophisticated combining
    # structured_data = process_text_with_gpt(combined_text)
    
    # print(structured_data)

