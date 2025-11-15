from openai import OpenAI

client = OpenAI(
    base_url="https://api.subconscious.dev/v1",
    api_key="sk-0bca18e22ce1fc738027d1edd9cb4b7b63363e8cbf64386ae76d0137a42d4517"
)

try:
    response = client.chat.completions.create(
        model="tim-small-preview",
        messages=[
            {"role": "user", "content": "Search the internet for dinner cooking recipes that are pretty easy and relatively easy to cook. Please out put in modern email html format that makes it easy to ready. Please include url's to recipes and total time to cook."}
        ],
        tools=[
            { "type": "web_search" }
        ],
    )

    content = response.choices[0].message.content
    
    # Check if content is a dict and extract the text
    if isinstance(content, dict):
        content_text = content.get('text', str(content))
    else:
        content_text = str(content)
    
    print(content_text)
    
    # Extract HTML from the JSON structure if present
    import json
    try:
        # Parse the JSON response
        data = json.loads(content_text)
        html_content = data.get('answer', content_text)
    except:
        html_content = content_text
    
    # Save the HTML output to a file
    with open("recipes_output.html", "w", encoding="utf-8") as f:
        f.write(html_content)
    with open("recipes.json", "w", encoding="utf-8") as f:
        f.write(content_text)
    print("\n✓ Output saved to recipes_output.html")
    
except Exception as e:
    print(f"Error: {e}")