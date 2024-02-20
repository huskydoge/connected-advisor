import requests
from bs4 import BeautifulSoup
import openai
import os
import pandas as pd
from logger import logger
import random
from http import HTTPStatus
import dashscope
from tqdm import tqdm


PROMPT = "You will serve as a programming agent that helps data collection for a crawler project.\
          The following text is directly extracted from an HTML homepage of a professor, \
          so there might be inconsistencies between the text that requires you to infer. \
          Please extract the following fields \
          - Name \
          - Affiliation history (including the current position) \
            e.g. A list of (Timespan - Affiliation - Lab - Position) \
            (You can skip certain fields and return results similar to the following example: N/A - SJTU - MVIG - Intern, and sort it chronically if possible)\
          - Github url \
          - Email address \
          - Google Scholar Homepage url (Should be compulsory) \
          - Field of Interest (You can summarize it in your own words) \
          - Personal Introduction (Around 100-200 words, you can summarize it using the material provided in the paper)\
          - Recruitment Information. \
          Please return the result in the exactly the following format for automated processing\
          field0: ... (for name)\n field1: ... (for affiliation)\n ...\
          If you cannot find the information, just return 'N/A' for that particular field and no other explanation\
          The text is as follows: "


def get_page(url):
    try:
        page = requests.get(url)
        return page
    except Exception as e:
        logger.warning(f"Failed to get page from {url}")
        return -1

# Function to crawl a professor's homepage and retrieve text
def crawl_homepage(url):
    # Make a request to the homepage
    page = get_page(url)
    if page == -1:
        return -1
    
    soup = BeautifulSoup(page.content, 'html.parser')
    
    # Find all links within the homepage domain
    links = [a['href'] for a in soup.find_all('a', href=True) if url in a['href']]
    
    # Initialize a set to store unique texts
    texts = set()
    
    # Add the main page's text
    texts.add(soup.get_text())
    
    # Loop through all found links to get their texts
    for link in links:
        page = get_page(link)
        if page == -1:
            continue
        soup = BeautifulSoup(page.content, 'html.parser')
        texts.add(soup.get_text())
    
    return texts

def text_cleaning(text):
    cleaned_text = text.replace('\n', ' ').replace('\t', ' ').replace('\r', ' ')
    return cleaned_text

# Function to process text through GPT-3.5 API for structured data extraction
def process_text_with_gpt(text, args, client=None):
    text = text_cleaning(text)
    if len(text) > 4096:
        return -1
    
    assert args.opt in ["llama", "gpt3"], "Invalid option"
    if args.opt == "llama":
        dashscope.api_key = args.key
        
        # Parse the text with Llama
        messages = [{'role': 'system', 'content': PROMPT},
                {'role': 'user', 'content': f'{text}'}]
        
        response = dashscope.Generation.call(
            model='qwen-72b-chat',
            messages=messages,
        )
        
        if response.status_code == HTTPStatus.OK:
            print(response)
        else:
            print('Request id: %s, Status code: %s, error code: %s, error message: %s' % (
                response.request_id, response.status_code,
                response.code, response.message
            ))
        return response["output"]["text"]
    else:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": "{PROMPT} {text}"}
            ]
        )

    # Assume the response contains the structured data in the desired format
    return response

def fetch_csv_path(dir):
    # Fetch all csv files in the directory
    csv_files = [f for f in os.listdir(dir) if f.endswith('.csv')]
    return csv_files

def main_worker(args):
    dir = args.dir
    opt = args.opt
    csv_files = fetch_csv_path(dir)
        
    # Craft a prompt for GPT-3.5 to structure the text
    if opt == "gpt3":
        client = openai.Client(api_key=args.key)
        logger.info("OpenAI client created")
    else:
        client = None
    
    for raw_csv in csv_files:
        df = pd.read_csv(os.path.join(dir, raw_csv))
        urls = df['homepage'].values.tolist()
        # shuffle the list
        random.shuffle(urls)
        
        for i, url in enumerate(urls):
            logger.info(f"Processing {url}")
            texts = crawl_homepage(url)
            if texts == -1:
                continue
            combined_text = " ".join(texts)
            structured_data = process_text_with_gpt(combined_text, args, client)
            if structured_data == -1:
                continue
            print(structured_data)
            # logger.info(f"Structured data saved to {save_path}")
            



if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--dir", type=str, required=True, help="directory to the csv files")
    parser.add_argument("--key", type=str, required=True, help="api key")
    parser.add_argument("--opt", type=str, required=False, default='llama', help="llama or gpt3")
    args = parser.parse_args()
    
    # This is used for proxy settings
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

