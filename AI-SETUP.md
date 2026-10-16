# Turn on AI food recognition (about 15 minutes)

Photos you analyze are sent through your own Cloudflare Worker to Anthropic's AI service. Each analysis costs a small amount, so set a monthly spend limit.

## 1. Get an API key
1. Sign up at https://console.anthropic.com and add a small amount of credit.
2. Settings > Limits: set a low monthly spend limit.
3. API Keys > Create Key. Copy it. Never paste it into the website or into a chat.

## 2. Create the Worker (free Cloudflare account)
1. https://dash.cloudflare.com > Workers & Pages > Create > Create Worker > name it `my-journey-ai` > Deploy.
2. Edit code > delete everything > paste all of `ai-worker.js` > Deploy.
3. Settings > Variables and Secrets > add:
   - `ANTHROPIC_API_KEY` (Secret): your key
   - `ALLOWED_ORIGIN` (Text): `https://kush2109.github.io`
4. Copy the worker URL (like `https://my-journey-ai.YOURNAME.workers.dev`).

## 3. Connect the website
Open the site > Settings > paste the Worker URL > Save.
Then Photo Calorie Estimator > choose a meal photo > Analyze with AI. Adjust portions and tap Save to today's diary.
