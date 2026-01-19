---
title: "nlp and llm tool to help improve resumes"
description: "identifying missing keywords and providing ai-driven advice via local llms"
pubDate: 2026-01-18
---

## tl;dr

* **goal**: build a tool that could help you find missing key words from a given job description in your resume, and then give you general feedback on how to improve your resume
* **tech stack**:
    * **software**: Java, Python, Next.js
    * **ai**: sentence-transformers, qwen2.5b
* **[github](https://github.com/yves-a/simple-ats)**
<br>
<br>

---

## inspiration
A couple months ago I kept seeing new grad job postings that were looking for Java. I learned Java in school but never used it for personal projects, usually relying on other stacks. I figured it was finally time to build a project with a Java based API.

## objective
I didn't really know what I wanted to do with Java, but I remember using Simplify's chrome extension, and it would usually show me the missing keywords, but for some reason at that time it wasn't showing up for a couple of postings. I was genuinely curious on that part of the extension worked, and thought it would be pretty cool to build out.

<br>

My vision was a website where you upload a resume and provide a job link. The tool would then extract missing keywords and generate a 'match score' based on the description.

## vibe coded?
I was really interested in seeing how fast I could make this project, especially since I kept seeing everyone vibe coding their projects. Funny enough, at that time I didn't even have the free Gemini Premium subscription that students get for free for a year, so I was genuinely just using GitHub Copilot, and choosing the more premium models.

<br>

The project only took a couple of days, but I burned through an entire month’s worth of premium AI requests. It was definitely worth it. Also, the name may or may not have been a suggestion from the model I was using. It was simple, and I know it's not an applicant tracking system, but it helps you with those.

## NLP
I hadn't done anything with NLP ever, all I remember was a couple years ago it was all the rage around AI, I guess LLMs have killed that since, idk.

<br>

Through my prompting, I had learned that it would be good to use sentence-transformer. To be honest, I didn't really understand the analysis that was going on, but it was much easier to see how it worked once I could prompt and break down different parts of it.
<br>

I'll first walk through the pipeline of getting the analysis.

<br>

### semantic analysis

While keyword matching is great for spotting specific terms, it often misses the "vibe" or context. If a job description asks for "Distributed Systems" and my resume says "Microservices," a simple text search would fail.

<br>

By using `sentence-transformers`, I convert both documents into 384-dimensional vectors called **embeddings**. I then use **cosine similarity** to calculate the mathematical "distance" between these vectors.

<br>
This allows the tool to understand that "Developing REST APIs" and "Building backend endpoints" are semantically related, providing a "Match Score" that actually reflects the content's meaning.

<br>
<br>

```python
resume_text = request.resume_text.strip()
job_text = request.job_description.strip()
        
        
# Generate embeddings
embeddings = state.model.encode([resume_text, job_text])
        
# Calculate cosine similarity
similarity_score = float(cosine_similarity([embeddings[0]], [embeddings[1]])[0][0])
```
<br>

It wouldn't be enough to just calculate the similarity between both embeddings, I actually wanted to show which keywords were missing.

<br>

### keyword analysis
To find the keywords, I wish I could tell you I did some crazy magic AI, in reality, I did something much easier and simpler. I had set up actual sets of technical words and phrases that I had seen before, and basically matched the words from the resume and the job description to these sets.

<br>

Before all that I had to clean up the "data" a bit. I converted everything to lowercase, removed special characters, broke sentences to individual words (tokenization), and broke down words to their base word (lemmatization, "developing", "developed", "developer" all to "develop").

<br>

After that I ran three checks on the filtering, is it in the tech skills set, does it have a technical pattern (.js, C#), and can it be ignored. The code is pretty dense, but I have shown it for those interested below:

<br>

```python
def extract_skills_and_keywords(text: str) -> Set[str]:
    """Extract skills, technologies, and relevant professional keywords from text"""
    
    if not text or not text.strip():
        return set()
    
    try:
        # Clean and normalize text
        text = re.sub(r'[^\w\s+#.-]', ' ', text.lower())
        text = re.sub(r'\s+', ' ', text).strip()
        
        # Extract multi-word technical terms
        multi_word_terms = set()
        tech_phrases = [
            'machine learning', 'artificial intelligence', ...
        ]
        
        for phrase in tech_phrases:
            if phrase in text:
                multi_word_terms.add(phrase.replace(' ', '_'))
        
        # Tokenize
        if state.lemmatizer:
            try:
                tokens = word_tokenize(text)
                single_words = set()
                for token in tokens:
                    if (len(token) > Config.MIN_KEYWORD_LENGTH and 
                        re.search(r'[a-zA-Z]', token) and 
                        not is_pure_number(token)):
                        lemmatized = state.lemmatizer.lemmatize(token.lower())
                        if lemmatized not in state.stop_words:
                            single_words.add(lemmatized)
            except Exception as e:
                logger.warning(f"Tokenization failed, falling back to regex: {e}")
                # Fallback to regex tokenization
                words = re.findall(r'\b[a-zA-Z0-9+#.-]+\b', text.lower())
                single_words = {
                    word for word in words 
                    if len(word) > Config.MIN_KEYWORD_LENGTH 
                    and re.search(r'[a-zA-Z]', word) 
                    and not is_pure_number(word)
                    and word not in state.stop_words
                }
        else:
            words = re.findall(r'\b[a-zA-Z0-9+#.-]+\b', text.lower())
            single_words = {
                word for word in words 
                if len(word) > Config.MIN_KEYWORD_LENGTH 
                and re.search(r'[a-zA-Z]', word) 
                and not is_pure_number(word)
                and word not in state.stop_words
            }
        
        # Collect relevant keywords
        relevant_keywords = set()
        
        # Add words from curated skill sets
        for word in single_words:
            word_clean = word.replace('.', '').replace('-', '').replace('+', '').replace('#', '')
            
            if (word in state.tech_skills or word_clean in state.tech_skills or
                word in state.business_skills or word_clean in state.business_skills):
                relevant_keywords.add(word)
        
        # Add words with clear technical patterns
        for word in single_words:
            if (word not in relevant_keywords and 
                word not in state.generic_words and 
                word not in state.stop_words and
                has_technical_pattern(word)):
                relevant_keywords.add(word)
        
        # Final filtering
        relevant_keywords = relevant_keywords - state.generic_words - state.stop_words
        
        # Add multi-word terms
        relevant_keywords.update(multi_word_terms)
        
        return relevant_keywords
```

<br>

Now I was able to return a response with the similarity score from the cosine similarity, the shared keywords, and hte missing keywords.

## where's the Java
In reality, I was overengineering. Since the keyword and semantic analysis lived in Python/FastAPI, I could have exposed those endpoints directly to the frontend. However, I wanted the challenge of using Java as a gateway. I threw in an actual Java API that would take take the text from the resume and web scrape the job description, and then using that context send over the request to the FastAPI.

<br>

The Java controller file is very basic and what you expect, it might be cooler to see the webscraping logic:

<br>

```java
private static final List<String> JOB_DESCRIPTION_SELECTORS = Arrays.asList(
        "[data-testid='job-description']",  // LinkedIn
        ".job-description",                 // Generic
        ".jobsearch-jobDescriptionText",    // Indeed
        ".job-details",                     // Generic
        ".description",                     // Generic
        ".content",                         // Generic
        "article",                          // Generic article tag
        ".posting-content",                 // Some job boards
        ".job-posting-description",         // Some job boards
        "main"                              // Fallback to main content
    );
    
    public String extractJobDescription(String url) throws IOException {
        logger.info("Fetching job description from URL: {}", url);
        
        try {
            // Fetch the webpage with a proper User-Agent to avoid blocking
            Document doc = Jsoup.connect(url)
                    .userAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
                    .timeout(10000)  // 10 second timeout
                    .get();
            
            String jobDescription = null;
            
            // Try different selectors to find job description content
            for (String selector : JOB_DESCRIPTION_SELECTORS) {
                Elements elements = doc.select(selector);
                if (!elements.isEmpty()) {
                    Element element = elements.first();
                    String text = element.text();
                    
                    // Check if this looks like a substantial job description
                    if (text.length() > 200 && containsJobKeywords(text)) {
                        jobDescription = text;
                        logger.info("Found job description using selector: {}, length: {}", selector, text.length());
                        break;
                    }
                }
            }
            
            // Fallback: try to extract from body if no specific selectors worked
            if (jobDescription == null) {
                String bodyText = doc.body().text();
                if (bodyText.length() > 200) {
                    // Try to find job-related content by looking for common patterns
                    String[] sentences = bodyText.split("\\.");
                    StringBuilder jobContent = new StringBuilder();
                    
                    boolean inJobSection = false;
                    for (String sentence : sentences) {
                        String lowerSentence = sentence.toLowerCase();
                        
                        // Start capturing when we hit job-related content
                        if (containsJobKeywords(lowerSentence)) {
                            inJobSection = true;
                        }
                        
                        if (inJobSection) {
                            jobContent.append(sentence.trim()).append(". ");
                            
                            // Stop if we hit footer/contact info
                            if (lowerSentence.contains("contact us") || 
                                lowerSentence.contains("apply now") ||
                                lowerSentence.contains("privacy policy")) {
                                break;
                            }
                        }
                    }
                    
                    jobDescription = jobContent.toString().trim();
                }
            }
    // rest of code is error processing
```

<br>

Using `jsoup` to parse HTML is straightforward, but most job boards have anti-scraping measures. To make the Java service more robust, I implemented a few key features:

* **user-agent spoofing:** Identifying the request as a legitimate Chrome browser rather than a Java bot to avoid being blocked by headers.
* **selector fallbacks:** Since every job board uses different CSS classes, I created a prioritized list of selectors to hunt for the description body.
* **content validation:** The service checks for "job-dense" keywords to ensure it didn't accidentally scrape a "Login to Apply" wall or the site footer.

<br>

This was the extent of the Java, there's obviously more Java files, but they are very basic files that you can browse if you like.

## frontend

I am not going to bore you with the details of the frontend, it was very quickly built in Next.js, and has very simple styling. Feel free to poke around the frontend/ portion of the repo, but to make it easier on everyone enjoy this demo video:

<br>

[watch the demo, its pretty awkward lol](https://youtu.be/17OmQVSxx6Y)

## dockerization

I was fresh off my previous project using docker, and I needed to use it again. Also, I was tired of running all the different servers individually. I had just set up all the different parts of the project in their own services, and funny enough I had nginx in here too for reverse proxy. I don't show that below because I didn't use it and some AI model threw it in and I thought why not.

<br>

```yaml
services:
  # Ollama LLM Service
  ollama:
    image: ollama/ollama
    container_name: ats-ollama
    ports:
      - "11434:11434"
    volumes:
      - ollama_models:/root/.ollama
    networks:
      - ats-network
    restart: unless-stopped
    environment:
      - OLLAMA_HOST=0.0.0.0

  # Python AI Service
  python-ai:
    build:
      context: ./python-service
      dockerfile: Dockerfile
    container_name: ats-python-ai
    ports:
      - "8000:8000"
    environment:
      - PYTHONUNBUFFERED=1
      - MODEL_CACHE_DIR=/app/models
      - OLLAMA_URL=http://ollama:11434
      - ENVIRONMENT=production  # Set to production for Docker deployment
    volumes:
      - python_models:/app/models  # Cache downloaded models
    networks:
      - ats-network
    restart: unless-stopped
    depends_on:
      - ollama

  # Java API Gateway
  java-api:
    build:
      context: ./java-ats
      dockerfile: Dockerfile
    container_name: ats-java-api
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=docker
      - PYTHON_SERVICE_URL=http://python-ai:8000
    depends_on:
      - python-ai
    networks:
      - ats-network
    restart: unless-stopped

  # Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: ats-frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8080
      - NODE_ENV=production
    depends_on:
      - java-api
    networks:
      - ats-network
    restart: unless-stopped
```

<br>

### The Data Flow
Since I was using four different frameworks, I used docker to handle the communication. Here is the lifecycle of a single analysis request:

1.  **frontend (Next.js):** Sends the Resume text + Job URL to the Java API.
2.  **gateway (Java):** Scrapes the URL, bundles it with the resume, and sends it to the Python service.
3.  **intelligence (FastAPI):** Runs the NLP embeddings and hits the local **ollama** instance for the LLM advice.
4.  **result:** The JSON response pipes all the way back up to the UI.

## advice portion (LLM!)

At the time of creating this project, I thought it would be helpful to have some advice portion. Like if you were given all these keywords, and score, how do you make sense of it. So I thought why not have an LLM here. You might be able to guess, but I did not take the easy way of just using API calls, I wanted to run an LLM locally. Obviously, if I were to make this a production web app, I would use API calls, but I had never ran an LLM locally before. But it turned out to be very easy.

<br>

### using ollama

I had installed ollama locally easily using brew, and it was very quick to get started. Now I just needed to find which open source model I wanted to run. Remember that part of running in docker, I didn't know at that time that it would severely limit my options of models and parameters. Anyways, I stumbled on qwen2.5, but no matter how small the parameters I chose it could not even count to three in less than 30 seconds. It was really frustrating.

<br>

### running qwen2.5b
It turns out I had to run it outside the docker containers for it to better use my laptops hardware, that took a lot of time to figure out. Now I was at a point where I could run the three billion parameter version very efficiently, just needed a proper prompt that would work well.

<br>

### prompt engineering
Who knew writing out a prompt to get advice with already given score, missing and shared keywords would be so difficult but it was. With lower parameters when I was still testing using the docker version, I was having so much trouble with qwen giving me proper json that actually follows the right structure. I needed the right structure because my frontend was relying on that structure (don't worry I added some flexibility with this structure in my code later).

<br>

The prompt is below and worked well with three billion parameters and was relatively quick. It could have been quicker with better hardware, but unfortunately I don't have the facilities for that.

<br>

```python
prompt = f"""You are an expert ATS (Applicant Tracking System) resume consultant helping candidates optimize their resumes for specific job postings.

**Resume Analysis:**
- Match Score: {similarity_score:.1%}
- Missing Keywords: {', '.join(missing_keywords[:8]) if missing_keywords else 'None'}
- Shared Keywords: {', '.join(shared_keywords[:8]) if shared_keywords else 'None'}

**Your Task:**
Provide actionable, specific resume advice in JSON format. Focus on concrete improvements that will increase the ATS match score.

**Requirements:**
1. Respond with ONLY valid JSON (no additional text before or after)
2. Use this exact structure:

{{
  "skills_to_add": ["skill1", "skill2", "skill3"],
  "skills_to_emphasize": ["existing_skill1", "existing_skill2"],
  "resume_structure": ["tip1", "tip2", "tip3"],
  "content_optimization": ["tip1", "tip2", "tip3"],
  "keyword_strategy": "One clear paragraph explaining how to naturally integrate missing keywords",
  "overall_priority": ["top_priority1", "top_priority2", "top_priority3"]
}}

**Guidelines:**
- skills_to_add: Select 3-5 most critical missing keywords/skills from the job description
- skills_to_emphasize: Identify 2-4 existing skills that match the job and should be highlighted more prominently
- resume_structure: Provide 2-4 specific formatting/organization tips for ATS optimization
- content_optimization: Give 2-4 specific tips for improving bullet points and descriptions
- keyword_strategy: Write one clear, actionable paragraph (2-3 sentences) explaining how to naturally incorporate missing keywords
- overall_priority: List 2-4 most important actions to take immediately, ordered by impact

Respond with valid JSON only."""
```

## final product
It was really nice to get a polished product out with various moving parts and it taught me a lot of different parts of full-stack engineering.

<br>

Looking back, I could have eliminated the Python service entirely or used an external API instead of running qwen2.5 locally. However, I wouldn't trade the 'wrong' decisions for efficient ones. Overengineering is often where the best learning happens.

<br>

Why make the best decision when you can make the wrong one and learn exactly why it was wrong?